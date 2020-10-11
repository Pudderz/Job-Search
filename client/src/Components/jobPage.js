import React from 'react';
import Search from './searchBar';
import JobBlock from './jobBlock';
import LoadBar from './LoadBar';
import './styles.scss';
import SortResults from './sortResults'
import GoToTopBot from './goToTopBot';
import FormPage from './formPage'
class JobPage extends React.Component{
    handleFormChange= (a, b, c)=>{
        this.props.changeExtraParametersInfo(a, b, c);
    }
    render(){
        console.log(this.props.jobResults);
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
                
                
               <ul className={`listOfJobs ${this.props.widthResults}`}  >
                {this.props.jobResults.length >= 0 &&
                this.props.jobResults.map(data => {
                    return(
                    <JobBlock key={data.id} jobDetails={data} isSaved={false}/>
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