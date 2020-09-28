import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import FrontPage from "./frontPage";
import JobPage from "./jobPage";


class App extends React.Component{

  constructor(props){
    super(props)
    this.state = {
        jobResults: [],
        searchValue:'',
        displayLoadbar: 'none',
        loadBarProgress: 0,
    }
  }

  loadJobs= (querySearch, location)=>{
    let linkedInLoaded = false;
    let indeedLoaded = false;
    const url = new URL('http://localhost:3000/stream');
    url.searchParams.set('q', querySearch);
    url.searchParams.set('location', location);
    const sse = new EventSource(url);
    const loadamount = 2;
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
        console.log("error occured "+ JSON.stringify(e));
        sse.close();
      };

    sse.addEventListener('newData',(event)=> {
      console.log(this.state.jobResults)
      this.state.jobResults.push(JSON.parse(event.data))
      this.setState({
          jobResults : this.state.jobResults,
          //increases the loadbar by 2 till loadBar is complete
          loadBarProgress: this.state.loadBarProgress+ loadamount,
      })
    });
    
    sse.addEventListener('close',(event)=> {
        if(event.data ==='indeed'){
            indeedLoaded = true;
        }else if(event.data ==='linkedIn'){
            linkedInLoaded = true;
        }
        if(linkedInLoaded && indeedLoaded){
            sse.close();
            console.log('closing connection')
            this.setState({
                loadBarProgress: 100,
                displayLoadbar: 'none',
            })
        }
    });
  }
  sortData=()=>{
        this.setState({
            jobResults: this.quickSortData(this.state.jobResults, 'time'),
        })
    }


  quickSortData(array, format ){
    if(array.length <= 1){
        return array;
    }
    const pivot = array[array.length-1][format];
    const lessThanPivot=[];
    const moreThanPivot=[];
    for(let i = 0; i< array.length-1; i++){
        if(typeof(array[i][format]) === undefined || +array[i][format]<= pivot){
            lessThanPivot.push(array[i])  
        }else{
            moreThanPivot.push(array[i])
        }
    }
    return [...this.quickSortData(lessThanPivot),array[array.length-1],...this.quickSortData(moreThanPivot)]
  }
  

  searchChange=([value, location])=>{
    this.setState({
        searchValue: value,
    }, ()=>{this.loadJobs(value, location)})
    
  }
  
  render(){
    return(
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jobResults">Job Results</Link>
            </li>
            <li>
              <Link to="/saved">My Saved Jobs</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/jobResults">
            <JobPage 
            searchChange={this.searchChange} 
            searchValue={this.state.searchValue}
            progress = {this.state.loadBarProgress}
            displayLoadbar={this.state.displayLoadbar}
            sortData ={this.sortData}
            jobResults = {this.state.jobResults}
            />
          </Route>
          <Route path="/saved">
            <Users />
          </Route>
          <Route path="/">
            <FrontPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
  }
    
}

function Users(){
    return <h1>Saved Images</h1>
}

export default App