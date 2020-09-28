import React, { Component } from 'react'
import './formStyles.scss'


class FrontPage extends Component {
    constructor(props){
        super(props)
        this.state = ({
            searchValue: '',
            location: '',
        })
    }
    
    searchChange=(value, location)=>{
        this.setState({
            searchValue: value,
            location: location,
        })
        
    }
    jobSearch = (e) =>{
     e.preventDefault();
        console.log(e.target)
        console.log(e.target.elements)
    }
    //Todo replace html for to jsx htmlFor
    render() {
        return (
            <div id="frontPage">
                <nav>
                    <a href=""></a>
                    <a href=""></a>
                    <a href=""></a>
                </nav>
                <div id="headerBackground">
                    <h1>Job Search</h1>
                </div>
                <div id="formDiv">
                    <form id="form" onSubmit={this.jobSearch}>
                        <label>Job Name:<input type="search" onChange={this.changeSearch} required placeholder="Search Jobs"/></label>  
                        <label>Location<input id="location" type="search" onChange={this.changeLocation} required placeholder="Location"/></label>        
                        <label>Search Website by:
                            <select id="searchtype" value={this.props.value} name="options" id="searchBy">
                                <option value="Most Relevant">Most Relevant</option>
                                <option value="Most Recent">Most Recent</option>
                            </select>
                        </label>
                        <div className="sort by">

                        </div>
                        <label for="sortByData" className="whichSite">
                            Automatically sort by date once received:
                            <input type="checkbox" id="sortBydata" value="Data"/>
                        </label>

                        <div className="whichSite">
                            <label for="websites">Which Website:</label>
                            <label for="all">All:
                                <input type="radio" name="websites" id="all" value="All" required/>
                            </label>
                            
                            <label for="linkedIn">LinkedIn: 
                            <input type="radio" name="websites" id="linkedIn" value="LinkedIn"/>
                            </label>
                           
                            {/* <input type="radio" name="websites" id="reed" value="Reed"/> */}
                            <label for="indeed">Indeed:
                            <input type="radio" name="websites" id="indeed" value="Indeed"/>
                            </label>
                            
                        </div>
                        <button type="submit">Search</button>
                    </form>    
                </div>
            </div>
        )
    }
}

export default FrontPage
