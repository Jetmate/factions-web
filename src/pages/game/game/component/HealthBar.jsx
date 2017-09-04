import { connect } from 'react-redux'

import GuiComponent from './GuiComponent.jsx'
import HealthBar from '../class/gui/HealthBar.js'

class Component extends GuiComponent {
  constructor (props) {
    super(props)
    this.object = new HealthBar(this.props.size, 1)
  }

  componentWillReceiveProps (nextProps) {
    this.object.changeHealth(nextProps.health)
    this.draw()
  }
}

function mapStateToProps (state) {
  return {
    health: state.health
  }
}

export default connect(mapStateToProps)(Component)
