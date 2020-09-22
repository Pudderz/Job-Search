import React from 'react';
import Search from './searchBar';
import JobBlock from './jobBlock';
import LoadBar from './LoadBar';
import './styles.scss';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            jobResults: [],
            searchValue:'',
            displayLoadbar: 'none',
            loadBarProgress: 0,
        }
    }
    


    loadJobs= (querySearch, location)=>{
        let linkedInLoaded = false;
        let indeedLoaded = false;
        const url = new URL('http://localhost:3000/stream');
        url.searchParams.set('q', querySearch);
        url.searchParams.set('location', location);
        const sse = new EventSource(url);
        const loadamount = 2;
        this.setState({
            displayLoadbar: 'block',
            loadBarProgress:1,
        })
        sse.onopen = ()=> {
            console.log("Sse connection opened");
            this.setState({
                jobResults : [],
                loadBarProgress:22,
             })
          };
      
        sse.onerror = function (e) {
            console.log("error occured "+ JSON.stringify(e));
            sse.close();
          };

        sse.addEventListener('newData',(event)=> {
            console.log("received")
            console.log(event.data);
            console.log(this.state.jobResults)
            this.state.jobResults.push(JSON.parse(event.data))
             this.setState({
                 jobResults : this.state.jobResults,
                 //increases the loadbar by 2 till loadBar is complete
                 loadBarProgress: this.state.loadBarProgress+ loadamount,
              })
        });
        
        sse.addEventListener('close',(event)=> {
            if(event.data ==='indeed'){
                indeedLoaded = true;
            }else if(event.data ==='linkedIn'){
                linkedInLoaded = true;
            }
            if(linkedInLoaded && indeedLoaded){
                sse.close();
                console.log('closing connection')
                this.setState({
                    loadBarProgress: 100,
                    displayLoadbar: 'none',
                })
            }
        });
    }

    searchChange=(value, location)=>{
        this.setState({
            searchValue: value,
        }, ()=>{this.loadJobs(value, location)})
        
    }

    // removeSearch= e=>{
    //     this.setState({
    //         searchValue: this.state.searchValue.split(' ').filter((item, index)=> item!== e).join(' '),

    //     },()=>{this.setState({
    //         jobResults: this.loadJobs(this.state.searchValue),
    //     })})
        
    //     console.log(this.state.searchValue)
    // }
    quickSortData(array, ){
        if(array.length <= 1){
            return array;
        }
        const pivot = array[array.length-1]['time'];
        const lessThanPivot=[];
        const moreThanPivot=[];
        for(let i = 0; i< array.length-1; i++){
            if(typeof(array[i]['time']) === undefined || +array[i]['time']<= pivot){
                lessThanPivot.push(array[i])  
            }else{
                moreThanPivot.push(array[i])
            }
        }
        return [...this.quickSortData(lessThanPivot),array[array.length-1],...this.quickSortData(moreThanPivot)]
    }
    sortData=()=>{
        this.setState({
            jobResults: this.quickSortData(this.state.jobResults, 'time'),
        })
    }
    tagClick= e =>{
        this.searchChange(`${this.state.searchValue} ${e}`);
    }
    render(){
        return(
            <main>
                
                <div id="headerBackground">
                </div>
               <Search value={this.state.searchValue} onSearchChange={this.searchChange}/>
               <LoadBar progress = {this.state.loadBarProgress} show={this.state.displayLoadbar} />
               <button onClick={this.sortData}>Sort Data</button>
               <ul>
                {this.state.jobResults.map( data => {
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

export default App