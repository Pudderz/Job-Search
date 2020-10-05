import React, { Component } from 'react'
import JobBlock from './jobBlock'

import {get , keys , del} from 'idb-keyval'
export default class SavedJobsPage extends Component {
    constructor(){
        super()
        this.state={
            savedJobs: [],
        }
    }
    componentDidMount = async() =>{
       
        const jobs = []
     keys()
        .then((keys) => {
            for(const key of keys){
                console.log(key);
                get(key).then((value)=>{
                    jobs.push([key,value])  
                })
                .then(()=>{
                    this.setState({
                        savedJobs: jobs,
                    })
                }) 
            }
        }) 
    }

    removeItem = id=>{
        const list = this.state.savedJobs.filter(item =>item[0] !== id)
        this.setState({
            savedJobs: list,
        });
    }
    
    render() {
        if (!window.indexedDB) {
            return(
                <div>
                    <div id="headerBackground">
                    </div>
                    <p>You have no Jobs Saved due to IndexedDb not being supported 
                        on your browser.
                    </p>
                </div>
            )
        }
        return (
            <div>
                <div id="headerBackground">
                </div>
                <h1>Saved Jobs</h1>
                
                <ol id="saved results">
                    {this.state.savedJobs.map(data=>(
                        <JobBlock  key={data[0]} jobDetails={data[1]} removeCallback={e=>this.removeItem(data[0])} isSaved={true} />
                    ))}
                    
                </ol>
            </div>
        )
    }
}


