import React from 'react'

class Component extends React.Component {
  render () {
    return (
      <HealthBar />
      <BulletBar />
      <MiniMap />
      <MainView socket={this.props.socket} />
    )
  }
}

export default Component
