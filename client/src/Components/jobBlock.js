import React from 'react';
import './jobBlock.scss';
import Link from './link'


class JobBlock extends React.Component{

    //Compares the old props to the new props to see whether it should update
    // used this site as a reference: 
    //https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/using_should_component_update.html
    
    compare=(previousProps, newProps)=>{
        //test if same object
        if(previousProps === newProps){
            return true
        }
        //tests if bother props objs are not null and are objects
        if (typeof previousProps !== 'object' || previousProps === null ||
        typeof newProps !== 'object' || newProps === null) {
        return false;
        }

        //Creates array of keys from each props so we can test if they are the same length
        //and has the same values in the for loop

        const oldPropsKeys = Object.keys(previousProps);
        const newPropsKeys = Object.keys(newProps);

        if (oldPropsKeys.length !== newPropsKeys.length) {
            return false;
        }
        
        const newPropsHasOwnProperty = hasOwnProperty.bind(newProps);
        for (var i = 0; i < oldPropsKeys.length; i++) {
            if (!newPropsHasOwnProperty(oldPropsKeys[i]) || previousProps[oldPropsKeys[i]] !== newProps[oldPropsKeys[i]]) {
            return false;
            }
        }
        return true;
    }


    shouldComponentUpdate = (nextProps)=>{
        return !(this.compare(this.props, nextProps))
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