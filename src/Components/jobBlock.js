import React from 'react';
import './jobBlock.scss';
import New from './new';
import Featured from './featured';
import Tag from './tag';
import Logo from './logo'


class JobBlock extends React.Component{
    
    render(){
        return(
            <li className={`item featured${this.props.jobDetails.featured}`}>
                <div className="logo">
                    <Logo className="logoImage" logo={this.props.jobDetails.logo} />
                </div>
  
                <div className="grid">
                    <div className="features">
                        <p className="company">{this.props.jobDetails.company}</p>
                        <New className="new" new= {this.props.jobDetails.new}/>
                        <Featured className="featured" featured={this.props.jobDetails.featured}/>
                    </div>
                    <h2 className="jobName">
                        {this.props.jobDetails.position}  
                    </h2>
                    <div className="extraInfo">
                        <p>{this.props.jobDetails.postedAt}</p> 
                        <p>{this.props.jobDetails.contract}</p> 
                        <p>{this.props.jobDetails.location}</p> 
                    </div>  
                </div>
                <hr className="lineBreak"/>
                <div className="tags">
                    <Tag onTagClick={this.props.onTagClick} role={this.props.jobDetails.role} level={this.props.jobDetails.level} languages={this.props.jobDetails.languages} tools={this.props.jobDetails.tools}/>
                </div>    
            </li>
        );
    }
}

export default JobBlock