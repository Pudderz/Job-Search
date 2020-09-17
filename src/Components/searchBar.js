import React, { Component } from 'react';
import './searchStyles.scss'
import SearchResult from './searchResult.js';

class search extends Component {
    changeValue=(event)=>{
        this.props.onSearchChange(event)
    }
    onRemoveClicked=(event)=>{
        this.props.removeValue(event)
    }

    render() {
        if(!this.props.value){
            return <></>
        }
        return (
            <div id="search">
        
            {this.props.value.split(' ').map((result, index)=>{
                return(
                   <SearchResult key={index} result = {result} onRemoveValue={(e)=>this.onRemoveClicked(e)}/> 
                )
            })}
            <input className="clear" type="button" value="Clear" onClick={(e)=>this.changeValue('')}/>
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
