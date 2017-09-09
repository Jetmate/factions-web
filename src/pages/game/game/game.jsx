import React from 'react'
import style from './stylesheet.css'

import { HEALTH_BAR_SIZE, BULLET_BAR_SIZE, MINIMAP_SIZE, LEADERBOARD_SIZE, GUI_MARGIN, ELEMENT_OFFSET } from './constants.js'
import HealthBar from './component/HealthBar.jsx'
import BulletBar from './component/BulletBar.jsx'
import MiniMap from './component/MiniMap.jsx'
import Leaderboard from './component/Leaderboard.jsx'
import MainView from './MainView.jsx'

class Component extends React.Component {
  render () {
    const elementStyle = {marginBottom: ELEMENT_OFFSET}
    return (
      <div>
        <div style={{margin: GUI_MARGIN + 'px'}} className={style.gui}>
          <Leaderboard className={style.right + ' ' + style.leaderboard} socket={this.props.socket} style={elementStyle} />

          <HealthBar style={elementStyle} size={HEALTH_BAR_SIZE} />
          <BulletBar style={elementStyle} size={BULLET_BAR_SIZE} />
          <MiniMap style={elementStyle} size={MINIMAP_SIZE} />
        </div>
        <MainView className={style.game} socket={this.props.socket} />
      </div>
    )
  }
}

export default Component
