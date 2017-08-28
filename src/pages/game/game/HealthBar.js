import { HEALTH_BAR_SIZE, HEALTH_BAR_COORDS, HEALTH_BAR_COLOR, SCALE_FACTOR, HEALTH_BAR_OUTLINE_COLOR, HEALTH_BAR_BACKGROUND_COLOR } from './constants.js'

export default class HealthBar {
  constructor () {
    this.height = HEALTH_BAR_SIZE[1]
    this.sprite = document.createElement('canvas')
    this.sprite.width = HEALTH_BAR_SIZE[0]
    this.sprite.height = HEALTH_BAR_SIZE[1]
    let ctx = this.sprite.getContext('2d')
    ctx.fillStyle = HEALTH_BAR_OUTLINE_COLOR
    ctx.fillRect(0, 0, HEALTH_BAR_SIZE[0], HEALTH_BAR_SIZE[1])
    ctx.fillStyle = HEALTH_BAR_BACKGROUND_COLOR
    ctx.fillRect(SCALE_FACTOR, SCALE_FACTOR, HEALTH_BAR_SIZE[0] - SCALE_FACTOR * 2, HEALTH_BAR_SIZE[1] - SCALE_FACTOR * 2)
  }

  changeHealth (percentage) {
    this.height = HEALTH_BAR_SIZE[1] * percentage
  }

  draw (ctx) {
    ctx.drawImage(this.sprite, HEALTH_BAR_COORDS[0], HEALTH_BAR_COORDS[1])
    ctx.fillStyle = HEALTH_BAR_COLOR
    ctx.fillRect(HEALTH_BAR_COORDS[0] + SCALE_FACTOR, HEALTH_BAR_COORDS[1] + SCALE_FACTOR + (HEALTH_BAR_SIZE[1] - this.height), HEALTH_BAR_SIZE[0] - SCALE_FACTOR * 2, this.height - SCALE_FACTOR * 2)
  }
}
