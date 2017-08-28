import { HEALTH_BAR_COLOR, SCALE_FACTOR, HEALTH_BAR_OUTLINE_COLOR, HEALTH_BAR_BACKGROUND_COLOR } from './constants.js'

export default class HealthBar {
  constructor (initialSize, index) {
    this.innerSize = [initialSize[0] - SCALE_FACTOR * 2, initialSize[1] - SCALE_FACTOR * 2]
    this.index = index
    this.length = this.innerSize[index]
    this.sprite = document.createElement('canvas')
    this.sprite.width = initialSize[0]
    this.sprite.height = initialSize[1]
    let ctx = this.sprite.getContext('2d')
    ctx.fillStyle = HEALTH_BAR_OUTLINE_COLOR
    ctx.fillRect(0, 0, initialSize[0], initialSize[1])
    ctx.fillStyle = HEALTH_BAR_BACKGROUND_COLOR
    ctx.fillRect(SCALE_FACTOR, SCALE_FACTOR, this.innerSize[0], this.innerSize[1])
  }

  changeHealth (percentage) {
    this.length = this.innerSize[this.index] * percentage
  }

  draw (ctx, coords) {
    ctx.drawImage(this.sprite, coords[0], coords[1])
    ctx.fillStyle = HEALTH_BAR_COLOR

    if (this.index === 0) {
      ctx.fillRect(coords[0] + SCALE_FACTOR + (this.innerSize[0] - this.length), coords[1] + SCALE_FACTOR, this.length, this.innerSize[1])
    } else {
      ctx.fillRect(coords[0] + SCALE_FACTOR, coords[1] + SCALE_FACTOR + (this.innerSize[1] - this.length), this.innerSize[0], this.length)
    }
  }
}
