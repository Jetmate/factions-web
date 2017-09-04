import React from 'react'

import Center from '../../component/Center.jsx'

class Component extends React.Component {
  render () {
    return (
      <Center>
        <h1>Factions.io</h1>
        <h3>open-world, survival, shooter...all in an io game!</h3>
        <form action="/signup" method="post">
          <input name="id" />
          <button>go!</button>
        </form>
      </Center>
    )
  }
}

export default Component
