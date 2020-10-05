import React from 'react'
import FilterResults from './filterResults'
import { MySearchContext } from './searchBarContext'

export default function sortResults() {
    return (
        <MySearchContext.Consumer>
            {context=>
            <>
                <label id="sortBy" htmlFor="searchtype">Sort by:
                    <select value={context.state.sortBy} name="options" id="searchBy" onChange={context.sortBy}>
                        <option value="id" defaultValue>ID</option>
                        <option value="time">Time</option>
                    </select>
                <FilterResults/>
                </label>
                <hr/>
            </>
            }
        </MySearchContext.Consumer>
        
    )
}
