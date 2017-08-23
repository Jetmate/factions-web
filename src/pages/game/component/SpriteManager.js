import { findCenter } from './helpers.js'
import { SCALE_FACTOR } from './constants.js'

export default class SpriteManager {
  constructor (sprite) {
    this.sprite = sprite
    this.size = [this.sprite.width * SCALE_FACTOR, this.sprite.height * SCALE_FACTOR]
    this.canvas = document.createElement('canvas')

    this.diagonal = Math.sqrt(this.sprite.width ** 2 + this.sprite.height ** 2) >> 0
    this.translation1 = this.diagonal / 2 >> 0
    let centerCoords = findCenter([this.diagonal, this.diagonal], [this.sprite.width, this.sprite.height])
    this.translation2 = [-(this.translation1 - (centerCoords[0] >> 0)), -(this.translation1 - (centerCoords[1] >> 0))]

    this.canvas.width = this.diagonal * SCALE_FACTOR
    this.canvas.height = this.canvas.width
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.rotate(0)
  }

  rotate (rotation) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.scale(SCALE_FACTOR, SCALE_FACTOR)
    this.ctx.translate(this.translation1, this.translation1)
    this.ctx.rotate(rotation)
    this.ctx.translate(this.translation2[0], this.translation2[1])
    this.ctx.drawImage(this.sprite, 0, 0)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  currentSprite () {
    return this.canvas
  }
}
