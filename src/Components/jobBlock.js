import React from 'react';
import './jobBlock.scss';
import New from './new';
import Featured from './featured';
import Tag from './tag';
import Logo from './logo'


class JobBlock extends React.Component{
    
    render(){
        return(
            <li className={`item`}>
                <div className="logo">
                    {/* <Logo className="logoImage" logo={this.props.jobDetails.logo} /> */}
                </div>
  
                <div className="grid">
                    <div className="features">
                        <p className="company">{this.props.jobDetails.company}</p>
                        {/* <New className="new" new= {this.props.jobDetails.new}/> */}
                        {/* <Featured className="featured" featured={this.props.jobDetails.featured}/> */}
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
                    <a href={`https://www.indeed.co.uk${this.props.jobDetails.link}`} target="_blank" rel="noopener noreferrer">Link to site</a>
                    {/* <Tag onTagClick={this.props.onTagClick} role={this.props.jobDetails.role} level={this.props.jobDetails.level} languages={this.props.jobDetails.languages} tools={this.props.jobDetails.tools}/> */}
                </div>    
            </li>
        );
    }
}

export default JobBlock