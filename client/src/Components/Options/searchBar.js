import React, { Component , useRef, useEffect, useState} from 'react';
import '../../styling/searchStyles.scss'
import {MySearchContext} from '../../context/searchBarContext'
 export const Search = (props) => {
    let _isMounted = false
    // constructor(props){
    //     super(props)
    //     this.state={
    //         top: '1%',
    //     }
    // }
    const [state, setState]= useState({top:'1%'})
    const[searchState, setSearchState] = useState({value: ''})
    const[locationState, setLocationState] = useState({value: ''})

    useEffect(() => {
        _isMounted = true;
        let previousYPos = window.pageYOffset;
        window.addEventListener('scroll', e=>{
            let currentYPos = window.pageYOffset;
            if(_isMounted){
                if(previousYPos > currentYPos){
                setState({
                    top: '1%',
                });
            }else{
                setState({
                    top: '-200px',
                });
            }
            }
            
            previousYPos = currentYPos;
        })
        return () => {
            _isMounted =false
        }
    }, [])

    const changeSearch = (e)=>{
        setSearchState({value: e.target.value});
    }
    const changeLocation = (e)=>{
        setLocationState({value: e.target.value})
    }
    
        return (
            <div id="search" style={{top:state.top}}>
                <MySearchContext.Consumer>
                    {context=>
                        <form onSubmit={(e)=>context.onSubmit( e, searchState.value, locationState.value)}>
                            <input type="search" 
                            onChange={changeSearch} 
                            value={searchState.value} 
                            required 
                            placeholder="Search Jobs"/>  
                            <input id="location" type="search" 
                            onChange={changeLocation} 
                            value={locationState.value} required placeholder="Location"/> 
                            <div className="button">
                                <button className="clear" type="submit">Search</button>
                                <button className="clear" type="button" value="" 
                                    onClick={e=>{
                                        changeSearch(e);
                                        changeLocation(e);
                                    }}
                                >Clear</button>
                            </div> 
                        </form>
                    }
                </MySearchContext.Consumer>
            </div>
            
        )
    
}

export default Search
