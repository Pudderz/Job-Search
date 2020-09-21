import React, { Component } from 'react'
import './loadBar.scss'
class LoadBar extends Component {
    
    render() { 
        return (
            <div id="loadBar" style={{display: this.props.show}}>
                <div style={{width:`${this.props.progress}%`}}/>
            </div>
        )
    }
}

export default LoadBar
