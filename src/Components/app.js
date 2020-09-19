import React from 'react';
import {data} from '../data';
import Search from './searchBar';
import JobBlock from './jobBlock';
import './styles.scss';

let result = true
let listOfTags='';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            jobResults: JSON.parse(data),
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


    loadJobs= async()=>{
        let response = await fetch('http://localhost:3000/', this.state.options)
        let json = await response.json();
        this.setState({
            jobResults: json,
        }) 
    }

    searchChange=e=>{
        this.setState({
            searchValue: e,
            jobResults: this.loadJobs(e),
        })
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
               <button onClick={this.loadJobs}>Click</button>
               <ul>
                {this.state.jobResults.map((data,index)=>{
                    return(
                    <JobBlock key={index} jobDetails={data} onTagClick={this.tagClick}/>
                    )
                })
                }
                </ul>
            </React.Fragment>
        )
    }
}

export default App