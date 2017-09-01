import { SCALE_FACTOR, ELEMENT_OUTLINE_COLOR, ELEMENT_BACKGROUND_COLOR } from './constants.js'

export default class Element {
  constructor (size, canvas) {
    this.size = size
    if (canvas === undefined) {
      canvas = document.createElement('canvas')
    }
    this.sprite = canvas
    this.innerSize = [size[0] - SCALE_FACTOR * 2, size[1] - SCALE_FACTOR * 2]
    this.sprite.width = size[0]
    this.sprite.height = size[1]
    let ctx = this.sprite.getContext('2d')
    ctx.fillStyle = ELEMENT_OUTLINE_COLOR
    ctx.fillRect(0, 0, size[0], size[1])
    ctx.fillStyle = ELEMENT_BACKGROUND_COLOR
    ctx.fillRect(SCALE_FACTOR, SCALE_FACTOR, this.innerSize[0], this.innerSize[1])
  }
}
