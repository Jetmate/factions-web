import React from 'react'
import { connect } from 'react-redux'

import { BULLET_BAR_SIZE } from '../constants.js'
import BulletBar from '../class/BulletBar.js'

class Component extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.ammoCapacity != this.props.ammoCapacity) {
      this.bulletBar.setAmmoCapacity(nextProps.ammoCapacity)
    } else {
      this.bulletBar.changeAmmo(nextProps.ammo)
    }
    this.bulletBar.draw(this.ctx)
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
    this.bulletBar = new BulletBar(BULLET_BAR_SIZE, 1, canvas)
  }
}

const mapStateToProps = (state) => {
  return {
    ammoCapacity: state.ammoCapacity,
    ammo: state.ammo
  }
}

export default connect(mapStateToProps)(Component)
