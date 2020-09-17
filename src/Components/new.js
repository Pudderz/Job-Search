import React from 'react';
import './new.scss'
function New(props){
    if(props.new){
        return(
            <p className="new">New!</p>
        )
    }
    return(<React.Fragment/>)
}

export default New;
