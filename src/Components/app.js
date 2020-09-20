import React from 'react';
// import {data} from '../data';
import Search from './searchBar';
import JobBlock from './jobBlock';
import './styles.scss';

let data = [];

let result = true
let listOfTags='';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            jobResults: [],
            searchValue:'',
            options:{
            method: 'GET',
            headers:{
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin": "http://localhost:3001",
            },
        }
    }
    }


    loadJobs= (querySearch, location)=>{
        let url = new URL('http://localhost:3000/stream')
        url.searchParams.set('q', querySearch)
        url.searchParams.set('location', location)
        let sse = new EventSource(url)
        sse.onopen = ()=> {
            console.log("Sse connection opened");
            this.setState({
                jobResults : [],
             })
          };
      
        sse.onerror = function (e) {
            console.log("error occured "+ JSON.stringify(e));
          };
      
        sse.addEventListener('newData',(event)=> {
            console.log("received")
            console.log(event.data);
            console.log(this.state.jobResults)
            let sseResult = JSON.parse(event.data)
            this.state.jobResults.push(sseResult)
             this.setState({
                 jobResults : this.state.jobResults,
              })
        });
        
        sse.addEventListener('close',function (event) {
            sse.close();
        });
    }

    searchChange=(value, location)=>{
        this.setState({
            searchValue: value,
        }, ()=>{this.loadJobs(value, location)})
        
    }

    removeSearch= e=>{
        this.setState({
            searchValue: this.state.searchValue.split(' ').filter((item, index)=> item!== e).join(' '),

        },()=>{this.setState({
            jobResults: this.loadJobs(this.state.searchValue),
        })})
        
        console.log(this.state.searchValue)
    }


    tagClick= e =>{
        this.searchChange(`${this.state.searchValue} ${e}`);
    }
    render(){
        return(
            <React.Fragment>
                <div id="headerBackground">
                </div>
               <Search value={this.state.searchValue} onSearchChange={this.searchChange} removeValue={this.removeSearch}/>
               <ul>
                {this.state.jobResults.map((data,index)=>{
                    return(
                    <JobBlock key={data.id} jobDetails={data} onTagClick={this.tagClick}/>
                    )
                })
                }
                </ul>
            </React.Fragment>
        )
    }
}

export default App