import React from 'react';
import Search from '../Components/Options/searchBar';
import JobBlock from '../Components/mainPage/jobBlock';
import LoadBar from '../Components/Options/LoadBar';
import '../styling/styles.scss';
import '../styling/advancedOptions2.scss'
import SortResults from '../Components/Options/sortJobsBy'
import GoToTopBot from '../Components/goToTopBot';
import FormPage from '../Components/advancedOptions/advancedOptions'
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