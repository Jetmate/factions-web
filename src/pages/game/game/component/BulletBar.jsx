import { connect } from 'react-redux'

import GuiComponent from './GuiComponent.jsx'
import BulletBar from '../class/gui/BulletBar.js'

class Component extends GuiComponent {
  constructor (props) {
    super(props)
    this.object = new BulletBar(this.props.size, 1)
  }

  componentWillReceiveProps (nextProps) {
    console.log('bar', nextProps)
    if (nextProps.ammoCapacity !== this.props.ammoCapacity) {
      this.object.setAmmoCapacity(nextProps.ammoCapacity)
    } else {
      this.object.changeAmmo(nextProps.ammo)
    }
    super.componentWillReceiveProps()
  }
}

function mapStateToProps (state) {
  return {
    ammoCapacity: state.ammoCapacity,
    ammo: state.ammo
  }
}

export default connect(mapStateToProps)(Component)
