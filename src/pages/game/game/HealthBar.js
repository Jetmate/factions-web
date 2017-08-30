import { HEALTH_BAR_COLOR, SCALE_FACTOR } from './constants.js'
import Element from './Element.js'

export default class HealthBar extends Element {
  constructor (initialSize, index) {
    super(initialSize)
    this.index = index
    this.length = this.innerSize[index]
  }

  changeHealth (percentage) {
    this.length = this.innerSize[this.index] * percentage
  }

  draw (ctx, coords) {
    if (typeof this.coords !== 'undefined') {
      coords = this.coords
    }
    ctx.drawImage(this.sprite, coords[0], coords[1])
    ctx.fillStyle = HEALTH_BAR_COLOR

    if (this.index === 0) {
      ctx.fillRect(coords[0] + SCALE_FACTOR + (this.innerSize[0] - this.length), coords[1] + SCALE_FACTOR, this.length, this.innerSize[1])
    } else {
      ctx.fillRect(coords[0] + SCALE_FACTOR, coords[1] + SCALE_FACTOR + (this.innerSize[1] - this.length), this.innerSize[0], this.length)
    }
  }
}
