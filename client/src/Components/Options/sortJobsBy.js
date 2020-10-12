import React from 'react'
import FilterResults from './filterResults'
import { MySearchContext } from '../searchBarContext'

export default function sortResults() {

    return (
        <MySearchContext.Consumer>
            {context=>
            <>  
                <button className="clear" onClick={context.showAdvanced} style={{'textDecoration': 'underline'}}>Advance search options</button>
                
                <label id="sortBy" htmlFor="searchtype">Sort by:
                    <select value={context.state.sortBy} name="options" id="searchBy" onChange={context.sortBy}>
                        <option value="id" defaultValue>ID</option>
                        <option value="time">Time</option>
                    </select>
                </label>   
                <FilterResults jobResults={context.state.initialResults} changeJobs={context.onFilter} changeLayout={context.changeLayout}/>
                
                <hr/>
            </>
            }
        </MySearchContext.Consumer>
        
    )
}
