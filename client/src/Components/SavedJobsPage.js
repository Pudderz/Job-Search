import React, { Component } from 'react'
import JobBlock from './jobBlock'
import {db} from './indexedDB'
export default class SavedJobsPage extends Component {
    constructor(){
        super()
        this.state={
            savedJobs: [],
        }
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
                {/* </div><Search Results> */}
                <ol id="saved results">
                    {this.state.savedJobs.map(data=>(
                        <JobBlock  key={data.id} jobDetails={data}/>
                    ))}
                    
                </ol>
            </div>
        )
    }
}


