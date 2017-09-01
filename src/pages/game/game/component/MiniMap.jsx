import React from 'react'
import { connect } from 'react-redux'

import { MINI_MAP_SIZE } from '../constants.js'
import MiniMap from '../class/MiniMap.js'

export default class Component extends React.Component {
  componentWillReceiveProps (nextProps) {
    this.miniMap.changeHealth(nextProps.health)
    this.miniMap.draw(this.ctx)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  render () {
    return (
      <canvas ref={this.initCanvas}></canvas>
    )
  }

  initCanvas (canvas) {
    this.miniMap = new MiniMap(HEALTH_BAR_SIZE, 1, canvas)
  }
}
