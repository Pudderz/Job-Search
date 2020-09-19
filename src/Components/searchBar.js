import React, { Component } from 'react';
import './searchStyles.scss'
import SearchResult from './searchResult.js';

class search extends Component {
    constructor(props){
        super(props)
        this.state={
            value: '',
            location:'',
        }
    }
    changeSearch=(event)=>{
        this.setState({
            value: event.target.value
        })
    }
    changeLocation=(event)=>{
        this.setState({
            location: event.target.value
        })
    }
    onSubmit=(e)=>{
        e.preventDefault();
        this.props.onSearchChange(this.state.value,this.state.location)
    }

    render() {
        return (
            <div id="search">
                    
                   {/* <SearchResult key={index} result = {result} onRemoveValue={(e)=>this.onRemoveClicked(e)}/>  */}
                   <form>
                        <input type="search" onChange={this.changeSearch} required placeholder="Search Jobs"/>  
                        <input type="search" onChange={this.changeLocation} required placeholder="Location"/> 
                        <div className="button">
                        <button className="clear" type="submit" onClick={this.onSubmit}>Search</button>
                        <input className="clear" type="button" value="Clear" />
                        </div> 
            </form>
            {/*
                Old search, however in the design we dont need to search we just need to filter the categorys and put the results in a search bar when clicked on

                <input list="searches" value={this.props.value} name="options" id="search" onChange={(e)=>this.changeValue(e)} placeholder="Search Category" multiple/>
                <datalist id="searches">
                    <option value="fullstack"/>
                    <option value="midweight"/>
                    <option value="junior"/>  
                    <option value="python"/>
                <option value="ruby"/>
                <option value="css"/>
                <option value="javascript"/>
                </datalist> */}
            </div>
        )
    }
}

export default search
