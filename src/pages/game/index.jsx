import React from 'react'

import Game from './component/game.jsx'
import io from 'socket.io-client'


class Main extends React.Component {
  socket = io()

  render () {
    return (
      <div>
        <Game socket={this.socket} />
      </div>
    )
  }
}

export default Main
