import React from 'react'

import { initSocket, initCanvas } from './game.js'

class Component extends React.Component {
  constructor (props) {
    super(props)

    initSocket(this.props.socket)
  }

  render () {
    return (
      <canvas ref={initCanvas}>Looks like your browser does not support the JS canvas. yikes.</canvas>
    )
  }
}

export default Component
