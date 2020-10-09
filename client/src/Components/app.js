import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import FormPage from "./formPage";
import JobPage from "./jobPage";
import SavedJobsPage from "./SavedJobsPage";
import {MySearchContext} from './searchBarContext';

class App extends React.Component{

  constructor(props){
    super(props)
    this.isDownloading = false;
    this.state = {
        initialResults:[],
        jobResults: [],
        searchValue:'',
        locationValue:'',
        displayLoadbar: 'none',
        loadBarProgress: 0,
        loadLinkedIn: true,
        loadIndeed: true,
        loadReed: true,
        loadJobSite: true,
        sortBy: 'id',
        info: '',
        extraParametersInfo: {
          LinkedIn: {
            Date: 'none',
            Job: 'none',
          },
          Indeed:{
            Date: 'none',
            Job: 'none',
            Rad: 'none',
            Sal: 'none',
          },
          Reed:{
            Date: 'none',
            Job: 'none',
            Rad: 'none',
            Sal: 'none',
          },
          JobSite:{
            Date: 'none',
            Job: 'none',
            Rad: 'none',
            Sal: 'none',
          }
        }
    }
  }
  compare=(previousProps, newProps)=>{
    //test if same object
    if(previousProps === newProps){
        return true
    }
    //tests if bother props objs are not null and are objects
    if (typeof previousProps !== 'object' || previousProps === null ||
    typeof newProps !== 'object' || newProps === null) {
    return false;
    }

    //Creates array of keys from each props so we can test if they are the same length
    //and has the same values in the for loop

    const oldPropsKeys = Object.keys(previousProps);
    const newPropsKeys = Object.keys(newProps);

    if (oldPropsKeys.length !== newPropsKeys.length) {
        return false;
    }
    
    const newPropsHasOwnProperty = hasOwnProperty.bind(newProps);
    for (var i = 0; i < oldPropsKeys.length; i++) {
        if (!newPropsHasOwnProperty(oldPropsKeys[i]) || previousProps[oldPropsKeys[i]] !== newProps[oldPropsKeys[i]]) {
        return false;
        }
    }
    return true;
}


shouldComponentUpdate = (nextProps, nextState)=>{
    if(this.isDownloading)return true
    return !(this.compare(this.props, nextProps))  || !(this.compare(this.state, nextState))
}


loadJobs= (searchValue, locationValue) =>{
    let whatSitesToLoad= {
      'linkedIn': !this.state.loadLinkedIn,
      'reed': !this.state.loadReed,
      'jobSite': !this.state.loadJobSite,
      'indeed': !this.state.loadIndeed,
    } 
    
    
    const url = new URL('http://localhost:3000/stream');
    url.searchParams.set('q', searchValue);
    url.searchParams.set('location', locationValue);
    url.searchParams.set('indeed', this.state.loadIndeed);
    url.searchParams.set('linked', this.state.loadLinkedIn);
    url.searchParams.set('reed', this.state.loadReed);
    url.searchParams.set('jobsite', this.state.loadJobSite);
    if(this.state.sortBy !== 'id'){
      url.searchParams.set('sortby', this.state.sortBy);
    }
    for(const key in this.state.extraParametersInfo){
      if(this.state[`load${key}`]=== true){
          for(const [itemKey, value] of Object.entries(this.state.extraParametersInfo[key])){
            if(value !== 'none'){
              console.log(`${key.slice(0,1).toLowerCase()}${itemKey}`, value);
              url.searchParams.set(`${key.slice(0,1).toLowerCase()}${itemKey}`, value);
            }
          }
      }
    }
      const sse = new EventSource(url);
      let stateArray = []; 
      let loaded = false;
      this.isDownloading = true;
      this.setState({
        displayLoadbar: 'block',
        loadBarProgress:1,
        info: 'sending...'
      })
      setTimeout(()=>{
      if(loaded === false){
        console.log('error loading')
        this.setState({
          info:'Connection Error, Closing connection',
          displayLoadbar: 'none',
        })
        sse.removeEventListener('error', event => {
          whatSitesToLoad[`${event.data}`]=true;
          console.log(`server could not load ${event.data}`)
        })
        sse.removeEventListener('newData', e=> newData(e));
        sse.removeEventListener('close', e=> closeData(e))
        sse.close()
        
      }
    },10000)

    sse.onopen = ()=> {
        console.log("Sse connection opened");
        loaded=true;
        this.setState({
            jobResults : [],
            loadBarProgress:22,
            info: 'Connection established'
         }, ()=>{
           this.isDownloading=false;
         })
      };
  
    sse.onerror = (e)=> {
        console.log("error occured "+ e.eventPhase);
        this.setState({info: 'Error occured while scrapping'})
      };
    const newData = event=>{
      stateArray.push(JSON.parse(event.data))
      this.setState({
          jobResults : stateArray,
          initialResults: stateArray,
          //increases the loadbar by 2 till loadBar is complete
          loadBarProgress: this.state.loadBarProgress+ 1,
      })
    }

    const closeData =event=>{
      whatSitesToLoad[`${event.data}`]= true;   
            console.log(`${event.data} finished`);
            this.setState({
              info: `${event.data} complete`
            })
            console.log(whatSitesToLoad);
            //tests to see if all the required websites have been loaded
        if(whatSitesToLoad['linkedIn'] && 
            whatSitesToLoad['indeed'] &&
            whatSitesToLoad['reed'] &&
            whatSitesToLoad['jobSite']){
              
          console.log('closing connection');
          sse.close();
          this.setState({
              loadBarProgress: 100,
              displayLoadbar: 'none',
              info: 'Scraping complete'
          })
          this.quickSortData(this.state.jobResults, this.state.sortBy)
        }
        sse.removeEventListener('error', event => {
          whatSitesToLoad[`${event.data}`]=true;
          console.log(`server could not load ${event.data}`)
        })
        sse.removeEventListener('newData', e=> newData(e));
        sse.removeEventListener('close', e=> closeData(e))
    }

    
    sse.addEventListener('newData', e=> newData(e));
    sse.addEventListener('error', event => {
      whatSitesToLoad[`${event.data}`]=true;
      console.log(`server could not load ${event.data}`)
    });
    
    sse.addEventListener('close', e=> closeData(e));
  }
  

  quickSortData(array , sortBy){
    if(array.length <= 1){
        return array;
    }
    const pivot = array[array.length-1][sortBy];
    const lessThanPivot=[];
    const moreThanPivot=[];
    for(let i = 0; i< array.length-1; i++){
        if(+array[i][sortBy]<= pivot){
            lessThanPivot.push(array[i]);
        }else{
            moreThanPivot.push(array[i]);
        }
    }
    return [...this.quickSortData(lessThanPivot, sortBy),array[array.length-1],...this.quickSortData(moreThanPivot, sortBy)];
  }
 
  sortData=(results = this.state.jobResults)=>{
        this.setState({
            jobResults: this.quickSortData(results, this.state.sortBy),
        })
    }
    changeExtraParametersInfo=(site, parameter, value)=>{
        this.setState({
          extraParametersInfo:{
            ...this.state.extraParametersInfo,
            [site]:{
              ...this.state.extraParametersInfo[site],
              [parameter]: value,
            }
          },
        })
 
    }

  render(){
    return(
    <Router>
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Job Results</Link>
            </li>
            <li>
              <Link to="/saved">Saved Jobs</Link>
            </li>
          </ul>
        </nav>

        
        <MySearchContext.Provider value={{
          state: this.state,
          changeSearchValue: value =>this.setState({searchValue: value.target.value}),
          changeLocationValue: value =>this.setState({locationValue: value.target.value}),
          clearValues: ()=>{this.setState({
            searchValue: '',
            locationValue:'', 
          })
          },
          onFilter: (value)=>this.sortData(value),
          onSubmit: (e, searchValue, locationValue)=> {
            e.preventDefault();
            console.log(searchValue, locationValue)
            this.loadJobs(searchValue, locationValue);
          },
          sortBy: value =>{
            this.setState({
              sortBy: value.target.value,
              jobResults: this.quickSortData(this.state.jobResults, value.target.value),
            })
          },
          loadLinkedIn: value =>this.setState({loadLinkedIn: value.target.checked}),
          loadIndeed: value =>this.setState({loadIndeed: value.target.checked}),
          loadJobSite: value =>this.setState({loadJobSite: value.target.checked}),
          loadReed: value =>this.setState({loadReed: value.target.checked}),
        }}>
          <Switch>

            
            <Route path="/saved">
              <SavedJobsPage />
            </Route>
            <Route path="/">
              <JobPage
               jobResults = {this.state.jobResults}
               changeExtraParametersInfo={this.changeExtraParametersInfo}
               />
            </Route>
          </Switch>
        </MySearchContext.Provider>
      </>
    </Router>
  );
  }
    
}


export default App