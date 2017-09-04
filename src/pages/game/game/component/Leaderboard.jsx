import React from 'react'

export default class Component extends React.Component {
  constructor (props) {
    super(props)

    this.state = JSON.parse(window.leaderboard)
    this.state[window.id] = 0

    this.props.socket.on('playerDeath', (playerId, killerId) => {
      delete this.state[playerId]
      this.setState({[killerId]: this.state[killerId] + 1})
    })

    this.props.socket.on('newPlayer', (id) => {
      this.setState({[id]: 0})
    })
  }

  render () {
    return (
      <ul className={this.props.className}>
        {Object.keys(this.state).map((id) =>
          <li key={id}>{id} = {this.state[id]}</li>
        )}
      </ul>
    )
  }
}
