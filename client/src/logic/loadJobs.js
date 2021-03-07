export const loadJobs= (searchValue, locationValue) =>{
    let whatSitesToLoad= {
      'linkedIn': !this.state.loadLinkedIn,
      'reed': !this.state.loadReed,
      'jobSite': !this.state.loadJobSite,
      'indeed': !this.state.loadIndeed,
    } 
    
    
    const url = new URL('http://localhost:8080/stream');
    url.searchParams.set('q', searchValue);
    url.searchParams.set('location', locationValue);
    url.searchParams.set('indeed', this.state.loadIndeed);
    url.searchParams.set('linked', this.state.loadLinkedIn);
    url.searchParams.set('reed', this.state.loadReed);
    url.searchParams.set('jobsite', this.state.loadJobSite);
    if(this.state.sortBy !== 'R'){
      url.searchParams.set('sortby', this.state.searchBy);
    }
    for(const key in this.state.extraParametersInfo){
      if(this.state[`load${key}`]=== true){
          for(const [itemKey, value] of Object.entries(this.state.extraParametersInfo[key])){
            if(value !== 'none'){
              console.log(`${key.slice(0,1).toLowerCase()}${itemKey}`, value);
              url.searchParams.set(`${key.slice(0,1).toLowerCase()}${itemKey}`, value);
            }
          }
      }
    }
      const sse = new EventSource(url);
      let stateArray = []; 
      let loaded = false;
      this.isDownloading = true;
      this.setState({
        displayLoadbar: 'block',
        loadBarProgress:1,
        info: 'sending...'
      })
      //closes the connection and tells the user that the connection
      // couldnt connect if no response from the server in 12seconds
      setTimeout(()=>{
        if(loaded === false){
          console.log('error loading')
          this.setState({
            info:'Connection Error, Closing connection',
            displayLoadbar: 'none',
          })
          sse.removeEventListener('error', event => {
            whatSitesToLoad[`${event.data}`]=true;
            console.log(`server could not load ${event.data}`)
          })
          sse.removeEventListener('newData', e=> newData(e));
          sse.removeEventListener('close', e=> closeData(e))
          sse.close()
          
        }
      },12000)

    sse.onopen = ()=> {
        console.log("Sse connection opened");
        loaded=true;
        this.setState({
            jobResults : [],
            loadBarProgress:22,
            info: 'Connection established'
         }, ()=>{
           this.isDownloading=false;
         })
      };
  
    sse.onerror = (e)=> {
        console.log("error occured "+ e.eventPhase);
        this.setState({info: 'Error occured while scrapping'})
      };
    const newData = event=>{
      stateArray.push(JSON.parse(event.data))
      this.setState({
          jobResults : stateArray,
          initialResults: stateArray,
          //increases the loadbar by 2 till loadBar is complete
          loadBarProgress: this.state.loadBarProgress+ 1,
      })
    }

    const closeData =event=>{
      whatSitesToLoad[`${event.data}`]= true;   
            console.log(`${event.data} finished`);
            this.setState({
              info: `${event.data} complete`
            })
            console.log(whatSitesToLoad);
            //tests to see if all the required websites have been loaded
        if(whatSitesToLoad['linkedIn'] && 
            whatSitesToLoad['indeed'] &&
            whatSitesToLoad['reed'] &&
            whatSitesToLoad['jobSite']){
              
          console.log('closing connection');
          sse.close();
          this.setState({
              loadBarProgress: 100,
              displayLoadbar: 'none',
              info: 'Scraping complete',
              jobResults: this.quickSortData(this.state.jobResults, this.state.sortBy)
          })
        }
        sse.removeEventListener('error', event => {
          whatSitesToLoad[`${event.data}`]=true;
          console.log(`server could not load ${event.data}`)
        })
        sse.removeEventListener('newData', e=> newData(e));
        sse.removeEventListener('close', e=> closeData(e))
    }

    
    sse.addEventListener('newData', e=> newData(e));
    sse.addEventListener('error', event => {
      whatSitesToLoad[`${event.data}`]=true;
      console.log(`server could not load ${event.data}`)
    });
    
    sse.addEventListener('close', e=> closeData(e));
  }
  