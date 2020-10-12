import React, { Component } from 'react';
import './link.scss';
const Link =(props)=> {
    
        if(props.site === 'indeed' || props.site === 'reed'){
           return (
                <a href={`https://www.${props.site}.co.uk${props.link}`} target="_blank" rel="noopener noreferrer">Link to job</a>
            ) 
        }
        return (
            <a href={props.link} target="_blank" rel="noopener noreferrer">Link to job</a>
        )
    
}

export default Link
