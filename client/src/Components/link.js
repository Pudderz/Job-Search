import React, { Component } from 'react';
import './link.scss';
class Link extends Component {
    render() {
        if(this.props.site === 'indeed'){
           return (
                <a href={`https://www.indeed.co.uk${this.props.link}`} target="_blank" rel="noopener noreferrer">Link to job</a>
            ) 
        }
        return (
            <a href={this.props.link} target="_blank" rel="noopener noreferrer">Link to job</a>
        )
    }
}

export default Link
