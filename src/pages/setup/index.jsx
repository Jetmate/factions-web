import React from 'react'

class Component extends React.Component {
  render () {
    return (
      <form action="/game" method="post">
        <input name="id" />
        <button>go!</button>
      </form>
    )
  }
}

export default Component
