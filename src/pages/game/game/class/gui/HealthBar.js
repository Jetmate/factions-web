import { HEALTH_BAR_COLOR } from '../../constants.js'

export default class HealthBar {
  constructor (size, index) {
    this.size = size
    this.length = size[index]
    this.index = index
  }

  changeHealth (percentage) {
    this.length = this.size[this.index] * percentage
  }

  draw (ctx, coords = [0, 0]) {
    ctx.fillStyle = HEALTH_BAR_COLOR
    if (this.index === 0) {
      ctx.fillRect(coords[0] + (this.size[0] - this.length), coords[1], this.length, this.size[1])
    } else {
      ctx.fillRect(coords[0], coords[1] + (this.size[1] - this.length), this.size[0], this.length)
    }
  }
}
