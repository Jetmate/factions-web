import { HEALTH_BAR_SIZE, HEALTH_BAR_COORDS, HEALTH_BAR_COLOR } from './constants.js'

export default class HealthBar {
  constructor () {
    this.height = HEALTH_BAR_SIZE[1]
  }

  changeHealth (percentage) {
    this.height = this.initialSize[1] * percentage
  }

  draw (ctx) {
    ctx.fillStyle = HEALTH_BAR_COLOR
    ctx.fillRect(HEALTH_BAR_COORDS[0], HEALTH_BAR_COORDS[1], HEALTH_BAR_SIZE[0], this.height)
  }
}
