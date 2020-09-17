import React from 'react';
import './featured.scss'

function Featured(props){
    if(props.featured){
        return(
            <p className="featured">Featured</p>
        )
    }
    return(<React.Fragment/>)
}

export default Featured;