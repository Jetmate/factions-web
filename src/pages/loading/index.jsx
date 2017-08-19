import React from 'react'

// import style from './stylesheet.css'
import io from 'socket.io-client'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.socket = io('/loading')

    this.socket.on('found', (id) => {
      console.log('ID RECEIVED:', id)
      if (id === window.id) {
        window.location = '/game'
      }
    })

    window.onbeforeunload = () => {
      this.socket.emit('close', window.id)
    }
  }

  render () {
    return (
      <p>loading....</p>
    )
  }
}

export default Component
