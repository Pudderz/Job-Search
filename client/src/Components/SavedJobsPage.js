import React, { Component } from 'react'
import JobBlock from './jobBlock'
import GoToTopBot from './goToTopBot'
import {get , keys } from 'idb-keyval'
import FilterResults from './filterResults'
export default class SavedJobsPage extends Component {
    constructor(){
        super()
        this.state={
            savedJobs: [],
            initialResults: [],
        }
    }
    componentDidMount = async() =>{
       
        const jobs = []
     keys()
        .then((keys) => {
            for(const key of keys){
                console.log(key);
                get(key).then((value)=>{
                    value.id=key
                    jobs.push(value)  
                })
                .then(()=>{
                    this.setState({
                        savedJobs: jobs,
                        initialResults: jobs,
                    })
                }) 
            }
        }) 
    }

    removeItem = id=>{
        const list = this.state.savedJobs.filter(item =>item.id !== id)
        this.setState({
            savedJobs: list,
        });
    }
    onFilter = (value)=>{
        this.setState({
            savedJobs: value
        })
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
                 <FilterResults jobResults={this.state.initialResults} changeJobs={this.onFilter}/>
                <ol id="saved results">
                    {this.state.savedJobs.map(data=>(
                        <JobBlock  key={data.id} jobDetails={data} removeCallback={e=>this.removeItem(data.id)} isSaved={true} />
                    ))}
                    
                </ol>
                <GoToTopBot/>
            </div>

        )
    }
}


