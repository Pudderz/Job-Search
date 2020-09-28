import React from 'react';
import './jobBlock.scss';
import Link from './link'


class JobBlock extends React.Component{
    shouldComponentUpdate = (nextProps, nextState)=>{

    }
    render(){
        return(
            <li className={`item`}>
                <div className="logo">
                    {/* <Logo className="logoImage" logo={this.props.jobDetails.logo} /> */}
                </div>
  
                <div className="grid">
                    <div className="features">
                        <p className="company">{this.props.jobDetails.company}</p>
                    </div>
                    <h2 className="jobName">
                        {this.props.jobDetails.position}  
                    </h2>
                    <div className="extraInfo">
                        <p>{this.props.jobDetails.postedAt}</p> 
                        {/* <p>{this.props.jobDetails.contract}</p>  */}
                        <p>{this.props.jobDetails.location}</p> 
                    </div>  
                </div>
                <hr className="lineBreak"/>
                <div className="tags">
                    <p>{this.props.jobDetails.summary}</p>
                    <button className="save" onClick={console.log('save')}>Save</button>
                    <Link link={this.props.jobDetails.link} site={this.props.jobDetails.site}/>
                    <p className="site">{this.props.jobDetails.site}</p>
                </div>    
            </li>
        );
    }
}

export default JobBlock