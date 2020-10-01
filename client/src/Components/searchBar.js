import React, { Component } from 'react';
import './searchStyles.scss'
import {MySearchContext} from './searchBarContext'
class search extends Component {
    _isMounted = false
    constructor(props){
        super(props)
        this.state={
            top: '1%',
        }
    }

    componentDidMount = ()=>{
        this._isMounted = true;
        let previousYPos = window.pageYOffset;
        window.addEventListener('scroll', e=>{
            let currentYPos = window.pageYOffset;
            if(this._isMounted){
                if(previousYPos > currentYPos){
                this.setState({
                    top: '1%',
                });
            }else{
                this.setState({
                    top: '-200px',
                });
            }
            }
            
            previousYPos = currentYPos;
        })
    }
    componentWillUnmount(){
        this._isMounted =false
    }

    render() {
        return (
            <div id="search" style={{top:this.state.top}}>
                <MySearchContext.Consumer>
                    {context=>
                        <form onSubmit={context.onSubmit}>
                            <input type="search" 
                            onChange={context.changeSearchValue} 
                            value={context.state.searchValue} 
                            required 
                            placeholder="Search Jobs"/>  
                            <input id="location" type="search" 
                            onChange={context.changeLocationValue} 
                            value={context.state.locationValue} required placeholder="Location"/> 
                            <div className="button">
                                <button className="clear" type="submit">Search</button>
                                <input className="clear" type="button" value="Clear" 
                                    onClick={context.clearValues}
                                />
                            </div> 
                        </form>
                    }
                </MySearchContext.Consumer>
            </div>
            
        )
    }
}

export default search
