import React from 'react'

export default function FilterResults() {
    let prevResult = ' ';
    let list = [];
    const filter = (event) =>{
        if(prevResult.length < event.target.value.length){
            list = list.filter(job=> job.position.includes(event.target.value))
        }else{
            list = this.props.jobResults.filter(job=> job.position.includes(event.target.value))
        }
        prevResult = event.target.value.length;

    }
    return (
        <div>
            <input type="text" onChange={filter}/>
        </div>
    )
}
