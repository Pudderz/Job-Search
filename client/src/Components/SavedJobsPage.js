import React, { Component } from 'react'

export default class SavedJobsPage extends Component {
    componentDidMount = () =>{

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
                <h1>Saved Images</h1>
                {/* </div><Search Results> */}
                <ol>

                </ol>
            </div>
        )
    }
}
