import React from 'react';
import Search from './searchBar';
import JobBlock from './jobBlock';
import LoadBar from './LoadBar';
import './styles.scss';
import SortResults from './sortResults'
import GoToTopBot from './goToTopBot';

class JobPage extends React.Component{
    
    render(){
        return(
            <main> 
                <div id="headerBackground">
                </div>
                
                <Search/>    
                <LoadBar/>
                <SortResults/>
               
               <ul>
                {this.props.jobResults.map(data => {
                    return(
                    <JobBlock key={data.id} jobDetails={data}/>
                    )
                })
                }
                </ul>
                <GoToTopBot/>
            </main>
        )
    }
}

export default JobPage