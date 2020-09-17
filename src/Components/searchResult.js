import React from 'react';


class SearchResult extends React.Component{
    handleChange(event){
        this.props.onRemoveValue(this.props.result)
    }
    render(){
        if(this.props.result === ''){
            return(<></>)
        }
        return(
            <div className="searchResult">
                <p>{this.props.result}</p>
                <button className="close" onClick={e=>this.handleChange(e)}>X</button>
            </div>
        )
    }

}

export default SearchResult;