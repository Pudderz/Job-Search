import React, { Component } from 'react'
import JobBlock from '../Components/mainPage/jobBlock'
import GoToTopBot from '../Components/goToTopBot'
import {get , keys } from 'idb-keyval'
import FilterResults from '../Components/Options/filterResults'
import '../styling/savedJobs.scss'
export default class SavedJobsPage extends Component {
    constructor(){
        super()
        this.state={
            savedJobs: [],
            initialResults: [],
            layout: ['',''],
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
    changeLayout= (colLayout, rowLayout)=>{
        console.log(`changing Layout ${colLayout} ${rowLayout}`);
        this.setState({layout: [colLayout, rowLayout]}, ()=>{
          console.log(`layout changed ${this.state.layout}`)
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
                <div id="savedFilter">
                    <h1>Saved Jobs</h1>
                 <FilterResults jobResults={this.state.initialResults} changeJobs={this.onFilter} changeLayout={this.changeLayout}/>
                </div>
                 <hr/>
                <ol id="savedResults" className = {this.state.layout[0]}>
                    {this.state.savedJobs.map(data=>(
                        <JobBlock  key={data.id} jobDetails={data} removeCallback={e=>this.removeItem(data.id)} isSaved={true} layout={this.state.layout[1]} />
                    ))}
                    
                </ol>
                <GoToTopBot/>
            </div>

        )
    }
}


