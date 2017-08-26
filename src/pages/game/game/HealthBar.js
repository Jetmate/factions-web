export default class HealthBar {
  constructor (coords, size, color) {
    this.coords = coords
    this.initialSize = size
    this.height = this.initialSize[1]
    this.color = color
  }

  changeHealth (percentage) {
    this.height = this.initialSize[1] * percentage
  }

  draw (ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.coords[0], this.coords[1], this.initialSize[0], this.height)
  }
}
