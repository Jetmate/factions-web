import React from 'react'

export default class GuiComponent extends React.Component {
  componentWillReceiveProps () {
    this.ctx.clearRect(0, 0, this.props.size[0], this.props.size[1])
    this.object.draw(this.ctx)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <canvas className={this.props.className} ref={this.initCanvas}></canvas>
    )
  }

  initCanvas = (canvas) => {
    canvas.width = this.props.size[0]
    canvas.height = this.props.size[1]
    this.ctx = canvas.getContext('2d')
  }
}
