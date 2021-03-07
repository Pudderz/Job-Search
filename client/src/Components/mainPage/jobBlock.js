import React from 'react';
import '../../styling/jobBlock.scss';
import Link from './jobLink'
import SiteLink from './siteLink';
import {get, set, del} from 'idb-keyval';

class JobBlock extends React.Component{
    constructor(props){
        super(props)
        this.state={
            saved: this.props.isSaved,
        }
    }
    //Compares the old props to the new props to see whether it should update
    // used this site as a reference: 
    //https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/using_should_component_update.html
    
    compare=(previous, next) => {
        //test if same object
        if (previous === next) {
            return true;
        }
        //tests if bother props objs are not null and are objects
        if (typeof previous !== 'object' || previous === null ||
            typeof next !== 'object' || next === null) {
            return false;
        }

        //Creates array of keys from each props so we can test if they are the same length
        //and has the same values in the for loop
        const oldPropsKeys = Object.keys(previous);
        const newPropsKeys = Object.keys(next);

        if (oldPropsKeys.length !== newPropsKeys.length) {
            return false;
        }

        const newPropsHasOwnProperty = hasOwnProperty.bind(next);
        for (var i = 0; i < oldPropsKeys.length; i++) {
            if (!newPropsHasOwnProperty(oldPropsKeys[i]) || previous[oldPropsKeys[i]] !== next[oldPropsKeys[i]]) {
                return false;
            }
        }
        return true;
    }


    shouldComponentUpdate = (nextProps, nextState)=>{
        return !(this.compare(this.props, nextProps))  || !(this.compare(this.state, nextState))
    }
    //Checks to see if the component is already saved
    componentDidMount = ()=>{
        if(!this.state.saved){
           get(`${this.props.jobDetails.company}_${this.props.jobDetails.position}`)
            .then((value)=>{
                if(value!==undefined){
                    this.setState({saved:true})
                }
            }) 
        }
        
    }
    saveJob = async () =>{
        const jobDate = new Date();
        jobDate.setDate(jobDate.getDate()-this.props.jobDetails.time);
        set(`${this.props.jobDetails.company}_${this.props.jobDetails.position}`, {
            ...this.props.jobDetails,
            time: jobDate.getTime(),
            postedAt: jobDate.toISOString().split('T')[0],
        })
            .then(()=> {
                this.setState({saved: true}, ()=> console.log('saved'))})
            .catch((e)=>{console.log(`error ${e}`)})
    }
    removeJob = async () =>{
        del(`${this.props.jobDetails.company}_${this.props.jobDetails.position}`)
            .then(()=> {
                this.setState({saved: false},()=>{
                if(this.props.removeCallback !== undefined){
                    this.props.removeCallback()
                }})
            })
    }
    render(){
        return(
            <li className={`item ${this.props.layout}`}>
                <div className="logo">
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
                        <p>{this.props.jobDetails.location}</p> 
                    </div>  
                </div>
                <hr className="lineBreak"/>
                <div className="tags">
                    <p>{this.props.jobDetails.summary}</p>
                    {this.state.saved === false &&
                        <button className="save" onClick={this.saveJob}>Save</button>
                    }
                    {this.state.saved=== true &&
                         <button className="save" onClick={this.removeJob}>Remove</button>
                    }
                    <Link link={this.props.jobDetails.link} site={this.props.jobDetails.site}/>
                </div> 
                <SiteLink site={this.props.jobDetails.site}/>   
            </li>
        );
    }
}

export default JobBlock