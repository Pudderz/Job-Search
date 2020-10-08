import React, { Component } from 'react'
import './formStyles.scss'
import LoadBar from './LoadBar'
import { MySearchContext } from './searchBarContext'


class FormPage extends Component {
   changeExtraParameters=(e)=>{
        const value = e.target.value
        const location = e.target.parentElement.parentElement.childNodes[0].textContent.toLowerCase();
        const parameter = e.target.getAttribute('name');
        console.log('value:'+ value);
        console.log(`location ${location}`);
        console.log(`parameters ${parameter}`)
       this.props.changeExtraParametersInfo(location, parameter, value)
   }
    render() {
        return (
            <MySearchContext.Consumer>
                {context=>
                <div id="frontPage">
                    {/* <div id="headerBackground">
                        <h1>Job Search</h1>
                    </div> */}
                    <div id="formDiv">
                        
                        <form id="form" onSubmit={context.onSubmit}>
                            <h3>Advance search options</h3>
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
                            <label htmlFor="websites">Which Websites:</label>
                            <div className="whichSite card">
                                
                                
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
                            <h2>Extra Parameters</h2>
                        <div className="options extraParameters">
                             <div className="card">
                                <h5>LinkedIn</h5>
                                <label>
                                    DatePosted:
                                    <select name="datePosted" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.linkedin.datePosted}>
                                        <option value="none">All</option>
                                        <option value="1">Past 24 hours</option>
                                        <option value="1%2C2">Past week</option>
                                        <option value="%2C2%2C3%2C4">Past month</option>
                                    </select>
                                </label>
                                <label>
                                    Job Type:
                                    <select name="jobType" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.linkedin.jobType}>
                                        <option value="none">All</option>
                                        <option value="T">Temporary</option>
                                        <option value="F">FullTime</option>
                                        <option value="P">Part-Time</option>
                                        <option value="C">Contract</option>
                                        <option value="I">Internship</option>
                                    </select>
                                </label>
                            </div>
                            <div className="card">
                                <h5>Indeed</h5>
                                <label>
                                    DatePosted:
                                    <select name="datePosted" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.indeed.datePosted}>
                                        <option value="none">All</option>
                                        <option value="1">Past 24 hours</option>
                                        <option value="7">Past week</option>
                                        <option value="14">Past 2 weeks</option>
                                    </select>
                                </label>
                                <label>
                                    Job Type:
                                    <select name="jobType" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.indeed.jobType}>
                                        <option value="none">All</option>
                                        <option value="temporary">Temporary</option>
                                        <option value="fulltime">FullTime</option>
                                        <option value="parttime">Part-Time</option>
                                    </select>
                                </label>
                                <label>
                                    Radius:
                                    <select name="radius" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.indeed.radius}>
                                        <option value="none">All</option>
                                        <option value="0">0</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </label>
                                <label>
                                    Minimum Salary: £{context.state.extraParametersInfo.indeed.salary}
                                    <input name="salary" type="range" min={10000} max={100000} step={1000} onChange={this.changeExtraParameters} />
                                </label>

                            </div>
                            <div className="card">
                                <h5>Jobsite</h5>
                                <label>
                                    DatePosted:
                                    <select name="datePosted" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.jobsite.datePosted}>
                                        <option value="none">All</option>
                                        <option value="1">Past 24 hours</option>
                                        <option value="3">Past 3 days</option>
                                        <option value="7">Past week</option>
                                        <option value="14">Past 2 weeks</option>
                                    </select>
                                </label>
                                <label>
                                    Job Type:
                                    <select name="jobType" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.jobsite.jobType}>
                                        <option value="none">All</option>
                                        <option value="temporary">Temporary</option>
                                        <option value="permanent">FullTime</option>
                                        <option value="part-time">Part-Time</option>
                                    </select>
                                </label>
                                <label>
                                    Radius:
                                    <select name="radius" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.jobsite.jobType}>
                                    <   option value="none">All</option>
                                        <option value="0">0</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                    </select>
                                </label>
                                <label>
                                    Minimum Salary: £{context.state.extraParametersInfo.jobsite.salary}
                                    <input name="salary" type="range" min={10000} max={100000} step={10000} onChange={this.changeExtraParameters}/>
                                </label>
                            </div>
                            <div className="card">
                                <h5>Reed</h5>
                                <label>
                                    DatePosted:
                                    <select name="datePosted" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.reed.datePosted}>
                                        <option value="none">All</option>
                                        <option value="Today">Past 24 hours</option>
                                        <option value="LastThreeDays">Past 3 days</option>
                                        <option value="LastWeek">Past week</option>
                                        <option value="LastTwoWeeks">Past 2 weeks</option>
                                    </select>
                                </label>
                                <label>
                                    Job Type:
                                    <select name="jobType" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.reed.jobType}>
                                        <option value="none">All</option>
                                        <option value="temp">Temporary</option>
                                        <option value="perm">Permanent</option>
                                        <option value="fulltime">FullTime</option>
                                        <option value="parttime">Part-Time</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                </label>
                                <label>
                                    Radius:
                                    <select name="radius" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.reed.radius}>
                                        <option value="none" defaultValue>All</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="3">3</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </select>
                                </label>
                                <label>
                                    Minimum Salary: £{context.state.extraParametersInfo.reed.salary}
                                    <input name="salary" type="range" min={10000} max={100000} step={2000} onChange={this.changeExtraParameters}/>
                                </label>
                            </div>
                        </div>

                           
                            



                            <button type="submit" id="formSubmit" >reset</button>
                        </form>    
                    </div>
                    <LoadBar/>
                        
                </div>
            }</MySearchContext.Consumer>
        )
    }
}

export default FormPage
