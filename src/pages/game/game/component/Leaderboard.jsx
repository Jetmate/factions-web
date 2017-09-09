import React from 'react'

import style from '../stylesheet.css'
import { LEADERBOARD_ROW_NUMBER, LEADERBOARD_SIZE, LEADERBOARD_ROW_HEIGHT } from '../constants.js'

export default class Component extends React.Component {
  constructor (props) {
    super(props)

    this.state = JSON.parse(window.leaderboard)

    this.props.socket.on('playerDeath', (playerId, killerId) => {
      // delete this.state[playerId]
      console.log('death')
      this.setState({[killerId]: this.state[killerId] + 1})
    })

    this.props.socket.on('newPlayer', (id) => {
      console.log('newPlayer')
      if (!(id in this.state)) {
        this.setState({[id]: 0})
      }
      // this.setState({[id]: 0})
    })

    this.props.socket.on('close', (id) => {
      console.log('close')
      delete this.state[id]
      this.forceUpdate()
    })
  }

  render () {
    let sorted = this.sortState()
    return (
      <div style={{...{width: LEADERBOARD_SIZE[0], height: LEADERBOARD_SIZE[1]}, ...this.props.style}} className={this.props.className}>
        {sorted.map(([id, kills]) =>
          <div key={id} style={{height: LEADERBOARD_ROW_HEIGHT + 'px'}} className={"row " + (window.id === id ? style.currentPlayer : '')}>
            <div style={{fontSize: LEADERBOARD_ROW_HEIGHT + 'px'}}>{id}</div>
            <div style={{fontSize: LEADERBOARD_ROW_HEIGHT + 'px'}}>{kills}</div>
          </div>
        )}
      </div>
    )
  }

  sortState = () => {
    let sorted = []
    for (let id in this.state) {
      sorted.push([id, this.state[id]])
    }
    sorted.sort((a, b) => {
      return b[1] - a[1]
    })
    sorted = sorted.slice(0, LEADERBOARD_ROW_NUMBER)
    return sorted
  }
}
