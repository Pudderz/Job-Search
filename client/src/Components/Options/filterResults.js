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
        const lowerCasedResult= (prevResult.current==='')? event.target.value : event.target.value.toLowerCase().trim();
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

    useEffect(()=>{
        const checkList = document.getElementById('list1');
        checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
            if (checkList.classList.contains('visible'))
                checkList.classList.remove('visible');
            else
                checkList.classList.add('visible');
            }
        
    }, [])
    
    const changeLayout=(e)=>{
        console.log('changing');
        if(e.target.value === 'row'){
            props.changeLayout('', '');
        }else if(e.target.value === 'columnSmall'){
            props.changeLayout('colSmallUl', 'colSmallLi');
        }else if(e.target.value === 'columnLarge'){
            props.changeLayout('colSmallUl', 'colMedLi');
        }
        
    }
    return (
        <>  <label style={{
        'margin': '5px'}}>Filter Results by:
            <input type="text" id="filterSearchBar" onChange={filter} style={{ 'width': 'auto'}} placeholder="Filter Results"/>
        </label>
        <div className="filterSites">
            <div id="list1" className="dropdown-check-list" tabIndex="100">
                <span className="anchor">Filter by Sites</span>
                <ul className="items">
                    <li><input type="checkbox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="linkedIn" defaultChecked/>LinkedIn </li>
                    <li><input type="checkbox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="jobSite" defaultChecked/>JobSite</li>
                    <li><input type="checkbox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="reed" defaultChecked/>Reed </li>
                    <li><input type="checkbox" onChange={changeFilter} style={{'backgroundColor': 'white', 'width': 'auto'}} value="indeed" defaultChecked/>Indeed </li>
                </ul>
            </div>


            <select className="layout"  onChange={changeLayout}>
                <option value="row" key="row">Row</option>
                <option value="columnSmall" key="colSmall">Column Small</option>
                <option value="columnLarge" key="colLarge">Column medium</option>
            </select>
        </div>

            

        </>
    )

}