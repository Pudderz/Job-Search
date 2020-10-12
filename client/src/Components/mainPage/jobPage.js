import React from 'react';
import Search from '../Options/searchBar';
import JobBlock from './jobBlock';
import LoadBar from '../Options/LoadBar';
import '../styles.scss';
import '../advancedOptions/advancedOptions.scss'
import SortResults from '../Options/sortJobsBy'
import GoToTopBot from '../goToTopBot';
import FormPage from '../advancedOptions/advancedOptions'
class JobPage extends React.Component{

    handleFormChange= (a, b, c)=>{
        this.props.changeExtraParametersInfo(a, b, c);
    }
    render(){
        return(
            <> 
                <div className="select">
                <div id="headerBackground">
                </div>
                <Search/>    
                <LoadBar/>
                <SortResults/>
                </div>
                <FormPage changeExtraParametersInfo= {this.handleFormChange}/>
    
                <ul className={`listOfJobs ${this.props.widthResults} ${this.props.layout[0]}`}  >
                {this.props.jobResults.length >= 0 &&
                this.props.jobResults.map(data => {
                    return(
                    <JobBlock key={data.id} jobDetails={data} isSaved={false} layout={this.props.layout[1]}/>
                    )
                })
                }
                {this.props.jobResults.length === 0 &&
                <div>
                    <p>There's nothing here</p>
                </div>
                }
                </ul>
                <GoToTopBot/>
            </>
        )
    }
}

export default JobPage