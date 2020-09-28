import React from 'react';
import Search from './searchBar';
import JobBlock from './jobBlock';
import LoadBar from './LoadBar';
import './styles.scss';


class JobPage extends React.Component{
    handleSearchChange=(e)=>{
        this.props.searchChange(e)
    }
    sortByDate= (e)=>{
        this.props.sortData(e)
    }

    
    
    
    render(){
        return(
            <main>
                
                <div id="headerBackground">
                </div>
               <Search value={this.props.searchValue} onSearchChange={this.handleSearchChange}/>
               <LoadBar progress = {this.props.progress} show={this.props.displayLoadbar} />
               <button onClick={this.sortByDate}>Sort Data</button>
               <ul>
                {this.props.jobResults.map( data => {
                    return(
                    <JobBlock key={data.id} jobDetails={data}/>
                    )
                })
                }
                </ul>
            </main>
        )
    }
}

export default JobPage