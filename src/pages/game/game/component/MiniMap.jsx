import { connect } from 'react-redux'

import GuiComponent from './GuiComponent.jsx'
import MiniMap from '../class/gui/MiniMap.js'

class Component extends GuiComponent {
  constructor (props) {
    super(props)
    this.object = new MiniMap(this.props.size, 1)
  }

  componentWillReceiveProps (nextProps) {
    this.object.changeMarkerCoords(nextProps.coords)
    super.componentWillReceiveProps()
  }
}

function mapStateToProps (state) {
  return {
    coords: state.coords.slice()
  }
}

export default connect(mapStateToProps)(Component)
