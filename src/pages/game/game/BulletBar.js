import Element from './Element.js'

export default class BulletBar extends Element {
  constructor (initialSize, bulletNumber) {
    super(initialSize)
    this.reset(bulletNumber)
  }

  reset (bulletNumber) {
    this.bulletNumber = bulletNumber
  }

  draw (ctx, coords) {
    ctx.drawImage(this.sprite, coords[0], coords[1])
    // ctx.fillStyle = HEALTH_BAR_COLOR

    // if (this.index === 0) {
    //   ctx.fillRect(coords[0] + SCALE_FACTOR + (this.innerSize[0] - this.length), coords[1] + SCALE_FACTOR, this.length, this.innerSize[1])
    // } else {
    //   ctx.fillRect(coords[0] + SCALE_FACTOR, coords[1] + SCALE_FACTOR + (this.innerSize[1] - this.length), this.innerSize[0], this.length)
    // }
  }
}
