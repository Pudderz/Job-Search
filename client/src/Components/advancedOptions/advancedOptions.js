import React, { Component } from 'react'
import '../../styling/advancedOptions.scss'
import { MySearchContext } from '../../context/searchBarContext'


class FormPage extends Component {
    constructor(){
        super()
        this.state={
            styleClass:"",
            displayLinked: 'none',
            showIndeed: 'none',
            showJobsite: 'none',
            showReed: 'none',
            indeedButton: 'Show',
            reedButton: 'Show',
            linkedButton: 'Show',
            jobSiteButton: 'Show',
        }
    }
   changeExtraParameters=(e)=>{
        const value = e.target.value
        const location = e.target.parentElement.parentElement.parentElement.childNodes[0].childNodes[0].textContent;
        const parameter = e.target.getAttribute('name');
        console.log(location, parameter, value)
       this.props.changeExtraParametersInfo(location, parameter, value)
   }

   showIndeed= ()=>{
       this.setState({
           showIndeed: (this.state.showIndeed==='block')?'none': 'block',
           indeedButton :(this.state.showIndeed==='block')? 'Show': 'Hide',
       })
   }
   showLinked=()=>{
        this.setState({
            displayLinked: (this.state.displayLinked==='block')?'none': 'block',
            linkedButton :(this.state.displayLinked==='block')? 'Show': 'Hide',
        })
   }
   showReed=()=>{
        this.setState({
            showReed: (this.state.showReed==='block')?'none': 'block',
            reedButton :(this.state.showReed==='block')? 'Show': 'Hide',
        })
   }
   showJobsite=()=>{
        this.setState({
            showJobsite: (this.state.showJobsite==='block')?'none': 'block',
            jobSiteButton :(this.state.showJobsite==='block')? 'Show': 'Hide',
        })
   }

   onSubmit=(e)=>{
    e.preventDefault();
   }

   showExtra=(e)=>{
       this.setState({
           [e.target.value] :(e.target.checked)? 'grid': 'none',
           
       })
    
   }
    render() {
        return (
            <MySearchContext.Consumer>
                {context=>
                <div id="frontPage" className={context.state.showAdvanced} >
                    <div id="formDiv">
                        
                        <form id="form" onSubmit={this.onSubmit}>
                            
                            <h3>Advance search options</h3>
                                  
                            <label htmlFor="searchBy">Search Website by:
                                <select name="options" id="searchBy" onChange={context.searchBy} value={context.state.searchBy}>
                                    <option value="R">Most Relevant</option>
                                    <option value="DD">Most Recent</option>
                                </select>
                            </label>
                            <label htmlFor="websites"  style={{'fontWeight': '600','marginTop': '15px'}}>Which Websites:</label>
                            <div className="whichSite card">
                                
                                
                                <label htmlFor="linkedIn">LinkedIn: 
                                <input type="checkBox" name="websites" id="linkedIn" value="LinkedIn" onChange={e=>{context.loadLinkedIn(e); this.showExtra(e)}} checked={context.state.loadLinkedIn}/>
                                </label>
                                <label htmlFor="indeed">Indeed:
                                <input type="checkBox" name="websites" id="indeed" value="Indeed" onChange={e=>{context.loadIndeed(e); this.showExtra(e)}} checked={context.state.loadIndeed}/>
                                </label>
                                <label htmlFor="reed">Reed:
                                <input type="checkBox" name="websites" id="reed" value="Reed" onChange={e=>{context.loadReed(e); this.showExtra(e)}} checked={context.state.loadReed}/>
                                </label>
                                <label htmlFor="jobsite">Jobsite:
                                <input type="checkBox" name="websites" id="jobsite" value="Jobsite" onChange={e=>{context.loadJobSite(e); this.showExtra(e)}} checked={context.state.loadJobSite}/>
                                </label>
                                
                            </div>
                            <h2>Extra Parameters</h2>
                        <div className="options extraParameters">
                             <div className="card"  style={{'display': this.state.LinkedIn}}>
                             <div className="extraParaheader" >
                                <h5>LinkedIn</h5>
                <button className="clear" onClick={this.showLinked}>{this.state.linkedButton}</button>
                            </div>
                                
                                <div className="extraDetails" style={{'display': this.state.displayLinked}}>
                                    <label>
                                    DatePosted:
                                    <select name="Date" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.LinkedIn.Date}>
                                        <option value="none">All</option>
                                        <option value="1">Past 24 hours</option>
                                        <option value="1%2C2">Past week</option>
                                        <option value="%2C2%2C3%2C4">Past month</option>
                                    </select>
                                    </label>
                                    <label>
                                    Job Type:
                                    <select name="Job" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.LinkedIn.Job}>
                                        <option value="none">All</option>
                                        <option value="T">Temporary</option>
                                        <option value="F">FullTime</option>
                                        <option value="P">Part-Time</option>
                                        <option value="C">Contract</option>
                                        <option value="I">Internship</option>
                                    </select>
                                    </label>
                                </div>
                                
                            </div>
                            <div className="card" style={{'display': this.state.Indeed}}>
                                <div className="extraParaheader">
                                    <h5>Indeed</h5>
                <button type="button" className="clear" onClick={this.showIndeed}>{this.state.indeedButton}</button>
                                </div>
                                
                                <div className="extraDetails" style={{'display': this.state.showIndeed}}>
                                    <label>
                                        DatePosted:
                                        <select name="Date" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.Indeed.Date}>
                                            <option value="none">All</option>
                                            <option value="1">Past 24 hours</option>
                                            <option value="7">Past week</option>
                                            <option value="14">Past 2 weeks</option>
                                        </select>
                                    </label>
                                    <label>
                                        Job Type:
                                        <select name="Job" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.Indeed.Job}>
                                            <option value="none">All</option>
                                            <option value="temporary">Temporary</option>
                                            <option value="fulltime">FullTime</option>
                                            <option value="parttime">Part-Time</option>
                                        </select>
                                    </label>
                                    <label>
                                        Radius:
                                        <select name="Rad" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.Indeed.Rad}>
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
                                        Minimum Salary: {context.state.extraParametersInfo.Indeed.Sal}
                                        <input name="Sal" type="range" min={10000} max={100000} step={1000} onChange={this.changeExtraParameters} />
                                    </label>
                                </div>
                                

                            </div>
                            <div className="card" style={{'display': this.state.Jobsite}}>
                                <div className="extraParaheader">
                                    <h5>JobSite</h5>
                                <button className="clear" onClick={this.showJobsite}>{this.state.jobSiteButton}</button>
                                    
                                </div>
                                
                                <div className="extraDetails" style={{'display': this.state.showJobsite}}>
                                <label>
                                    DatePosted:
                                    <select name="Date" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.JobSite.Date}>
                                        <option value="none">All</option>
                                        <option value="1">Past 24 hours</option>
                                        <option value="3">Past 3 days</option>
                                        <option value="7">Past week</option>
                                        <option value="14">Past 2 weeks</option>
                                    </select>
                                </label>
                                <label>
                                    Job Type:
                                    <select name="Job" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.JobSite.Job}>
                                        <option value="none">All</option>
                                        <option value="temporary">Temporary</option>
                                        <option value="permanent">FullTime</option>
                                        <option value="part-time">Part-Time</option>
                                    </select>
                                </label>
                                <label>
                                    Radius:
                                    <select name="Rad" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.JobSite.Job}>
                                    <   option value="none">All</option>
                                        <option value="0">0</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                    </select>
                                </label>
                                <label>
                                    Minimum Salary: {context.state.extraParametersInfo.JobSite.Sal}
                                    <input name="Sal" type="range" min={10000} max={100000} step={10000} onChange={this.changeExtraParameters}/>
                                </label>
                                </div>
                               
                            </div>
                            <div className="card" style={{'display': this.state.Reed}}>
                                <div className="extraParaheader">
                                    <h5>Reed</h5>
                <button className="clear" onClick={this.showReed}>{this.state.reedButton}</button> 
                                </div>
                                
                                <div className="extraDetails" style={{'display': this.state.showReed}}>
                                    <label>
                                    DatePosted:
                                    <select name="Date" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.Reed.Date}>
                                        <option value="none">All</option>
                                        <option value="Today">Past 24 hours</option>
                                        <option value="LastThreeDays">Past 3 days</option>
                                        <option value="LastWeek">Past week</option>
                                        <option value="LastTwoWeeks">Past 2 weeks</option>
                                    </select>
                                </label>
                                <label>
                                    Job Type:
                                    <select name="Job" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.Reed.Job}>
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
                                    <select name="Rad" onChange={this.changeExtraParameters} value={context.state.extraParametersInfo.Reed.Rad}>
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
                                    Minimum Salary: {context.state.extraParametersInfo.Reed.Sal}
                                    
                                </label>
                                    <input name="Sal" type="range" min={10000} max={100000} step={2000} onChange={this.changeExtraParameters}/>
                                </div>
                                
                            </div>
                        </div>

   
                            <button type="submit" className="clear" id="formSubmit" onClick={context.resetOptions}>Reset</button>
                        </form>    
                    </div>
                    
                </div>
            }</MySearchContext.Consumer>
        )
    }
}

export default FormPage
