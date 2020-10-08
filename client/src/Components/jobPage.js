import React from 'react';
import Search from './searchBar';
import JobBlock from './jobBlock';
import LoadBar from './LoadBar';
import './styles.scss';
import SortResults from './sortResults'
import GoToTopBot from './goToTopBot';
import FormPage from './formPage'
class JobPage extends React.Component{
    
    render(){
        console.log(this.props.jobResults);
        return(
            <main> 
                <div id="headerBackground">
                </div>
                
                <Search/>    
                <LoadBar/>
                <SortResults/>
                <FormPage />
               <ul>
                {this.props.jobResults.length >= 0 &&
                this.props.jobResults.map(data => {
                    return(
                    <JobBlock key={data.id} jobDetails={data} isSaved={false}/>
                    )
                })
                }
                {this.props.jobResults.length === 0 &&
                <div>
                    <p>There's nothing here, try searching for somthing</p>
                </div>
                }
                </ul>
                <GoToTopBot/>
            </main>
        )
    }
}

export default JobPage