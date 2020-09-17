import React from 'react';
import {data} from '../data';
import Search from './searchBar';
import JobBlock from './jobBlock';
import './styles.scss';
const jobs = JSON.parse(data);
let result = true
let listOfTags='';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            jobResults: jobs,
            searchValue:'',
        }
    }

    changeJob=(e)=>{
        return jobs.filter(item=>{
            if(e ==='')return true
            else {
                result =true
                listOfTags = `${item.languages.join(' ')} ${item.tools.join(' ')} ${item.level} ${item.role} `;
                listOfTags = listOfTags.toLowerCase();
                e.toLowerCase().split(' ').forEach(element => {
                    if(!listOfTags.includes(element)) result=false
                });   
                return result
            }
    })}

    searchChange=e=>{
        this.setState({
            searchValue: e,
            jobResults: this.changeJob(e),
        })
    }

    removeSearch= e=>{
        this.setState({
            searchValue: this.state.searchValue.split(' ').filter((item, index)=> item!== e).join(' '),

        },()=>{this.setState({
            jobResults: this.changeJob(this.state.searchValue),
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
                {this.state.jobResults.map((job,index)=>{
                    return(
                    <JobBlock key={index} jobDetails={job} onTagClick={this.tagClick}/>
                    )
                })
                }
                </ul>
            </React.Fragment>
        )
    }
}

export default App