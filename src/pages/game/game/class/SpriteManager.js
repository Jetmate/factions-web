import { SCALE_FACTOR } from './constants.js'

export default class SpriteManager {
  constructor (sprite) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = sprite.width * SCALE_FACTOR
    this.canvas.height = sprite.height * SCALE_FACTOR
    let ctx = this.canvas.getContext('2d')
    ctx.scale(SCALE_FACTOR, SCALE_FACTOR)
    ctx.imageSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    ctx.mozImageSmoothingEnabled = false
    ctx.drawImage(sprite, 0, 0)
  }

  currentSprite () {
    return this.canvas
  }
}
