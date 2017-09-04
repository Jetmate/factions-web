import React from 'react'

export default class Component extends React.Component {
  constructor (props) {
    super(props)

    this.state = JSON.parse(window.leaderboard)
    this.state[window.id] = 0
    this.state['a'] = 0
    this.state['b'] = 0
    this.state['c'] = 0
    this.state['d'] = 0
    this.state['e'] = 0
    this.state['w'] = 0
    this.state['h'] = 0
    this.state['k'] = 0
    this.state['g'] = 0

    this.props.socket.on('playerDeath', (playerId, killerId) => {
      delete this.state[playerId]
      this.setState({[killerId]: this.state[killerId] + 1})
    })

    this.props.socket.on('newPlayer', (id) => {
      this.setState({[id]: 0})
    })

    this.props.socket.on('close', (id) => {
      delete this.state[playerId]
      this.forceUpdate()
    })
  }

  render () {
    return (
      <div className={this.props.className}>
        {Object.keys(this.state).map((id) =>
          <div key={id} className="row">
            <div>{id}</div>
            <div>{this.state[id]}</div>
          </div>
        )}
      </div>
    )
  }
}
