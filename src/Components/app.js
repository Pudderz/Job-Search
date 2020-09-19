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
            jobResults: data,
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


    loadJobs= async(querySearch, location)=>{
        let url = new URL('http://localhost:3000')
        url.searchParams.set('q', querySearch)
        url.searchParams.set('location', location)
        let response = await fetch(url, this.state.options)
        let json = await response.json();
        this.setState({
            jobResults: json,
        }) 
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