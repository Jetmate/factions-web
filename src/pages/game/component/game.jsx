import React from 'react'

import { setSocket, setCanvas } from './game.js'

class Component extends React.Component {
  constructor (props) {
    super(props)

    setSocket(this.props.socket)
  }

  render () {
    return (
      <canvas ref={setCanvas}>Looks like your browser does not support the JS canvas. yikes.</canvas>
    )
  }
}

export default Component
