import React, { Component } from 'react'
import './formStyles.scss'
import LoadBar from './LoadBar'
import { MySearchContext } from './searchBarContext'


class FormPage extends Component {
   
    render() {
        return (
            <MySearchContext.Consumer>
                {context=>
                <div id="frontPage">
                    
                    <div id="headerBackground">
                        <h1>Job Search</h1>
                    </div>
                    <div id="formDiv">
                        <form id="form" onSubmit={context.onSubmit}>
                            <label>Job Name:
                                <input type="search" onChange={context.changeSearchValue} value={context.state.searchValue} required placeholder="Search Jobs"/></label>  
                            <label htmlFor="location">Location:
                            <input id="location" type="search" onChange={context.changeLocationValue} value={context.state.locationValue} required placeholder="Location"/></label>        
                            <label htmlFor="searchBy">Search Website by:
                                <select name="options" id="searchBy" onChange={context.sortBy} value={context.state.sortBy}>
                                    <option value="R">Most Relevant</option>
                                    <option value="DD">Most Recent</option>
                                </select>
                            </label>
                            
                            <div className="whichSite">
                                <label htmlFor="websites">Which Websites:</label>
                                
                                <label htmlFor="linkedIn">LinkedIn: 
                                <input type="checkBox" name="websites" id="linkedIn" value="LinkedIn" onChange={context.loadLinkedIn} checked={context.state.loadLinkedIn}/>
                                </label>
                                <label htmlFor="indeed">Indeed:
                                <input type="checkBox" name="websites" id="indeed" value="Indeed" onChange={context.loadIndeed} checked={context.state.loadIndeed}/>
                                </label>
                                <label htmlFor="reed">Reed:
                                <input type="checkBox" name="websites" id="reed" value="Reed" onChange={context.loadReed} checked={context.state.loadReed}/>
                                </label>
                                <label htmlFor="jobsite">Jobsite:
                                <input type="checkBox" name="websites" id="jobsite" value="Jobsite" onChange={context.loadJobSite} checked={context.state.loadJobSite}/>
                                </label>
                                
                            </div>
                            <button type="submit" id="formSubmit" >Search</button>
                        </form>    
                    </div>
                    <LoadBar/>
                        
                </div>
            }</MySearchContext.Consumer>
        )
    }
}

export default FormPage
