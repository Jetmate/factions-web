import React from 'react'

class Center extends React.Component {
  render () {
    return (
      <div className='vertical-center'>
        <div className='horizontal-center element'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Center
