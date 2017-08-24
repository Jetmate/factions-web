import React from 'react'

import Game from './component/game.jsx'
import io from 'socket.io-client'


class Main extends React.Component {
  socket = io()
  state = {
    gameOver: false
  }

  constructor (props) {
    super(props)
    window.onbeforeunload = () => {
      this.socket.emit('close', window.id)
    }

    this.socket.on('bulletHit', (id, playerId) => {
      if (playerId === window.id) {
        this.setState({gameOver: true})
      }
    })
  }

  render () {
    if (this.state.gameOver) {
      console.log('GAME OVER')
      return (
        <p>Game over!</p>
      )
    } else {
      return (
        <Game socket={this.socket} />
      )
    }
  }
}

export default Main
