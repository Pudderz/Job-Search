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
    this.state = {
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
    }
  }

  loadJobs= () =>{
    let whatSitesToLoad= {
      'linkedIn': !this.state.loadLinkedIn,
      'reed': !this.state.loadReed,
      'jobSite': !this.state.loadJobSite,
      'indeed': !this.state.loadIndeed,
    } 
    
    //TODO remove event listeners 
    const url = new URL('http://localhost:3000/stream');
    url.searchParams.set('q', this.state.searchValue);
    url.searchParams.set('location', this.state.locationValue);
    url.searchParams.set('indeed', this.state.loadIndeed);
    url.searchParams.set('linked', this.state.loadLinkedIn);
    url.searchParams.set('reed', this.state.loadReed);
    url.searchParams.set('jobsite', this.state.loadJobSite);
    if(this.state.sortBy !== 'id'){
      url.searchParams.set('sortby', this.state.sortBy);
    }
    const sse = new EventSource(url);
   let stateArray = []; 
    this.setState({
        displayLoadbar: 'block',
        loadBarProgress:1,
    })

    sse.onopen = ()=> {
        console.log("Sse connection opened");
        this.setState({
            jobResults : [],
            loadBarProgress:22,
         })
      };
  
    sse.onerror = function (e) {
        console.log("error occured "+ e.eventPhase);
      };
    const newData = event=>{
      stateArray.push(JSON.parse(event.data))
      this.setState({
          jobResults : stateArray,
          //increases the loadbar by 2 till loadBar is complete
          loadBarProgress: this.state.loadBarProgress+ 2,
      })
    }

    const closeData =event=>{
      whatSitesToLoad[`${event.data}`]= true;   
            console.log(`${event.data} finished`);

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


  sortData=()=>{
        this.setState({
            jobResults: this.quickSortData(this.state.jobResults, this.state.sortBy),
        })
    }

  render(){
    return(
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Advanced</Link>
            </li>
            <li>
              <Link to="/job">Job Results</Link>
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
          onSubmit: e=> {
            e.preventDefault();
            this.loadJobs();
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
            <Route path="/job">
              <JobPage jobResults = {this.state.jobResults}/>
            </Route>
            <Route path="/saved">
              <SavedJobsPage/>
            </Route>
            <Route path="/">
              <FormPage/>
            </Route>
            
          </Switch>
        </MySearchContext.Provider>
      </div>
    </Router>
  );
  }
    
}


export default App