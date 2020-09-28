import React, { Component } from 'react';
import './searchStyles.scss'

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

   clearSearch=()=>{
       this.setState({
           value: '',
           location: '',
       })
   }

    render() {
        return (
            <div id="search">
                <form>
                        <input type="search" onChange={this.changeSearch} value={this.state.value} required placeholder="Search Jobs"/>  
                        <input id="location" type="search" onChange={this.changeLocation} value={this.state.location} required placeholder="Location"/> 
                        <div className="button">
                            <button className="clear" type="submit" onClick={this.onSubmit}>Search</button>
                            <input className="clear" type="button" value="Clear" onClick={this.clearSearch}/>
                        </div> 
                </form>
            </div>
        )
    }
}

export default search
