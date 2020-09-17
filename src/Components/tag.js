import React from 'react'

function Tag(props){
    let tagSelected = (e) =>{
        props.onTagClick(e.target.textContent);
        console.log(e);
    }
    let listItems = [];
    listItems.push(props.role)
    listItems.push(props.level);
    props.languages.forEach(element => listItems.push(element));
    props.tools.forEach(element => listItems.push(element));
    return(<React.Fragment>
                {listItems.map((info, index)=>{
                    return(<p onClick ={e=>tagSelected(e)} key = {index.toString()}>{info}</p>) 
                })}
            </React.Fragment>
    )             
}

export default Tag;