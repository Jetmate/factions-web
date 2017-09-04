import React from 'react'

import Game from './game/game.jsx'
import io from 'socket.io-client'
import Center from '../../component/Center.jsx'

class Main extends React.Component {
  socket = io()
  state = {
    gameOver: false
  }
  emitClose = true

  constructor (props) {
    super(props)
    window.onbeforeunload = () => {
      console.log('CLOSING EVENT EMMITED')
      if (this.emitClose) {
        this.socket.emit('close', window.id)
      } else {
        this.socket.emit('reload', window.id)
        this.emitClose = true
      }
    }

    this.socket.on('playerDeath', (playerId) => {
      if (playerId === window.id) {
        this.setState({gameOver: true})
      }
    })
  }

  render () {
    if (this.state.gameOver) {
      return (
        <Center className='element'>
          <h3>Game Over!</h3>
          <button onClick={this.clickHandler}>play again?</button>
        </Center>
      )
    } else {
      return (
        <Game socket={this.socket} />
      )
    }
  }

  clickHandler = () => {
    this.emitClose = false
    window.location.reload(true)
  }
}

export default Main
