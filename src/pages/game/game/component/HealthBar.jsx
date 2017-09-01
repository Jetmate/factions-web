import React from 'react'

import { HEALTH_BAR_SIZE } from '../constants.js'
import HealthBar from '../class/HealthBar.js'

export default class Component extends React.Component {
  componentWillReceiveProps (nextProps) {
    this.healthBar.changeHealth(nextProps.health)
    this.healthBar.draw(this.ctx)
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
    this.healthBar = new HealthBar(HEALTH_BAR_SIZE, 1, canvas)
  }
}
