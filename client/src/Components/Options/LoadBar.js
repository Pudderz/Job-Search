import React, { Component } from 'react'
import '../../styling/loadBar.scss'
import LoadBarDetails from './loadBarDetails'
import { MySearchContext } from '../../context/searchBarContext'
class LoadBar extends Component {
    
    render() { 
        return (
            <MySearchContext.Consumer>
                {context=>
                    <>
                        <div className="loadBar" style={{display: context.state.displayLoadbar}}>
                            <div style={{width:`${context.state.loadBarProgress}%`}}/>
                        </div>
                        <LoadBarDetails info={context.state.info} display={context.state.displayLoadbar}/>
                        
                    </>
                }
            </MySearchContext.Consumer>
        )
    }
}

export default LoadBar
