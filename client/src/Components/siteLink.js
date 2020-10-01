import React, { Component } from 'react'

export class SiteLink extends Component {
    render() {
        return (
            <a className="site" href={`http://www.${this.props.site}.co.uk`}
                target="_blank"
                rel="noopener noreferrer"
            >{this.props.site}</a>
        )
    }
}

export default SiteLink
