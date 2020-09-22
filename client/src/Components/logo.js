import React from 'react';
import './logo.scss'

class Logo extends React.Component{
    render(){
        return(
        <img src={require(`${this.props.logo}`)} alt="logo" height="60px" width="60px"/>
        )
    }
    
}

export default Logo;