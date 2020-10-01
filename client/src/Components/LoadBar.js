import React, { Component } from 'react'
import './loadBar.scss'
import { MySearchContext } from './searchBarContext'
class LoadBar extends Component {
    
    render() { 
        return (
            <MySearchContext.Consumer>
                {context=>
                    <div id="loadBar" style={{display: context.state.displayLoadbar}}>
                        <div style={{width:`${context.state.loadBarProgress}%`}}/>
                    </div>
                }
            </MySearchContext.Consumer>
        )
    }
}

export default LoadBar
