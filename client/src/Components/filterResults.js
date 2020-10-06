import React ,{useState, useEffect, useRef} from 'react'

export default function FilterResults(props) {
    const ref = useRef(
       {
            'indeed': true,
            'linkedIn': true,
            'jobSite': true,
            'reed': true,
        }
    )
    const prevResult=useRef('') 
    
    
    
    const filter = (event) =>{
        let list = [];
        console.log(ref.current)
        console.log(prevResult.current);
        console.log(props.jobResults)
        // prevResult.length < event.target.value.length
        const lowerCasedResult= (prevResult.current==='')? event.target.value : event.target.value.toLowerCase();
        if(false){
            list = list.filter(job=> job.position.includes(event.target.value))
        }else{
            list = props.jobResults.filter(job=> 
                (job.position.toLowerCase().includes(lowerCasedResult)||
                job.company.toLowerCase().includes(lowerCasedResult))&&
                ref.current[job.site]=== true
                )
        }
        console.log(list)
        props.changeJobs(list);
        prevResult.current = event.target.value
    }
    
    const changeFilter=(event)=>{
         console.log(event.target.value)
        ref.current[event.target.value] = event.target.checked
         console.log(event.target.checked)
        filter({target:{value: prevResult.current}})
    }

    return (
        <>
            <input type="text" onChange={filter} style={{'backgroundColor': 'white', 'width': 'auto'}}/>
            <input type="checkBox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="indeed" defaultChecked/>
            <input type="checkBox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="linkedIn" defaultChecked/>
            <input type="checkBox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="jobSite" defaultChecked/>
            <input type="checkBox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="reed" defaultChecked/>
        </>
    )

}