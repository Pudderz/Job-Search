import React, { Component } from 'react'
import './formStyles.scss'


class frontPage extends Component {
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
    

    }
    render() {
        return (
            <div id="frontPage">
                <h1>Job Search</h1>
                <form id="form" onSubmit={this.jobSearch}>
                    <label>Job Name:<input type="search" onChange={this.changeSearch} required placeholder="Search Jobs"/></label>  
                    <label>Location<input id="location" type="search" onChange={this.changeLocation} required placeholder="Location"/></label>        
                    <label>Search Website by:<input list="searchtype" value={this.props.value} name="options" id="searchBy"/>
                    <datalist id="searchtype">
                    <option value="Most Relevant"/>
                    <option value="Most Recent"/>
                    </datalist>
                    </label>
                    <label>Which Website:<input list="searches" value={this.props.value} name="options"/>
                    <datalist id="searches">
                    <option value="All"/>
                    <option value="LinkedIn"/>
                    <option value="indeed"/>  
                    </datalist></label>
                    <button type="submit">Search</button>
                </form>
            </div>
        )
    }
}

export default frontPage
