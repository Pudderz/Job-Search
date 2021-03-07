import React from 'react'
import '../styling/goToStyles.scss'

export default function GoToTopBot() {
    const scrollTop =()=>{
        window.scrollTo({
            top:0,
            left:0,
            behavior: 'smooth',
        })
    }

    const scrollBot =()=>{
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            left: 0,
            behavior: 'smooth',
        })
    }

    return (
        <div className="scrollTo">
            <button id="top" onClick={scrollTop} >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.67 64"><defs></defs><title>Asset 45</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path className="cls-1" d="M19.57.78.78,19.5a2.67,2.67,0,0,0,3.77,3.78L18.67,9.21V61.33a2.67,2.67,0,1,0,5.33,0V9L38.11,23.27a2.67,2.67,0,1,0,3.78-3.76L23.35.79a2.67,2.67,0,0,0-3.78,0Z"/></g></g></svg>
            </button>
            <button id="bottom" onClick={scrollBot} >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.67 64"><defs></defs><title>Asset 44</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path className="cls-1" d="M23.1,63.22,41.88,44.5a2.67,2.67,0,1,0-3.76-3.78L24,54.79V2.67a2.67,2.67,0,1,0-5.33,0V55L4.56,40.73a2.67,2.67,0,0,0-3.77,0A2.63,2.63,0,0,0,0,42.61a2.68,2.68,0,0,0,.77,1.88L19.32,63.21a2.67,2.67,0,0,0,3.78,0Z"/></g></g></svg>
            </button>
        </div>
    )
}
