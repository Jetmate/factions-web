import React from 'react'

import Game from './component/game.jsx'
import io from 'socket.io-client'

const roomId = () => {
  return window.playerIndex == 0 ? window.id : window.opponent 
}

class Main extends React.Component {
  constructor (props) {
    super(props)

    this.socket = io()

    this.socket.emit('ready', roomId())

    window.onbeforeunload = () => {
      this.socket.emit('close', window.id)
    }

    this.socket.on('close', (id) => {
      if (id === window.opponent) {
        console.log('opponent left!')
      }
    })
  }

  render () {
    return (
      <div>
        <Game socket={this.socket} />
      </div>
    )
  }
}

export default Main
