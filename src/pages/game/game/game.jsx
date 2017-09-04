import React from 'react'
import style from './stylesheet.css.js'

import { HEALTH_BAR_SIZE, BULLET_BAR_SIZE, MINIMAP_SIZE, LEADERBOARD_SIZE } from './constants.js'
import HealthBar from './component/HealthBar.jsx'
import BulletBar from './component/BulletBar.jsx'
import MiniMap from './component/MiniMap.jsx'
import Leaderboard from './component/Leaderboard.jsx'
import MainView from './MainView.jsx'

class Component extends React.Component {
  render () {
    return (
      <div>
        <div className={style.gui}>
          <Leaderboard className={style.right} size={LEADERBOARD_SIZE} socket={this.props.socket} />

          <HealthBar size={HEALTH_BAR_SIZE} />
          <BulletBar size={BULLET_BAR_SIZE} />
          <MiniMap size={MINIMAP_SIZE} />
        </div>
        <MainView className={style.game} socket={this.props.socket} />
      </div>
    )
  }
}

export default Component
