import React ,{useRef, useEffect, useState}from 'react'


export default function LoadBarDetails(props) {
    const [state, setstate] = useState({display: props.display}) 
    const displayRef = useRef('none');
    const ref = useRef(0)
    useEffect(() => {
        console.log(props.display)
        console.log(displayRef.current)
        if(props.display==='none'){
            ref.current = setTimeout(()=>setstate({display: 'none'}), 3000)
        } else if(props.display==='block'){
            clearTimeout(ref.current)
            if(state.display !== 'block')setstate({display: 'block'});
            
        }
       
       
    }, [props.info, props.display])
    
    return (
        
        <div className="loadBarDetails" style={{'display': state.display}}><p>{props.info}</p></div>
    )
}
