import React from 'react'

import style from '../stylesheet.css.js'
import { LEADERBOARD_ROW_NUMBER } from '../constants.js'

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
      <div className={this.props.className}>
        {sorted.map(([id, kills]) =>
          (id === window.id) ? (
            <div key={id} className={"row " + style.currentPlayer}>
              <div>{id}</div>
              <div>{kills}</div>
            </div>
          ) : (
            <div key={id} className="row">
              <div>{id}</div>
              <div>{kills}</div>
            </div>
          )
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
