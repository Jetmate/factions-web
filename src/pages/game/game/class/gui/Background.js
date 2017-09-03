import { SCALE_FACTOR, ELEMENT_OUTLINE_COLOR, ELEMENT_BACKGROUND_COLOR } from '../../constants.js'

export default class Element {
  constructor (size) {
    this.sprite = document.createElement('canvas')
    let outerSize = [size[0] + SCALE_FACTOR * 2, size[1] + SCALE_FACTOR * 2]
    this.sprite.width = outerSize[0]
    this.sprite.height = outerSize[1]
    let ctx = this.sprite.getContext('2d')
    ctx.fillStyle = ELEMENT_OUTLINE_COLOR
    ctx.fillRect(0, 0, outerSize[0], outerSize[1])
    ctx.fillStyle = ELEMENT_BACKGROUND_COLOR
    ctx.fillRect(SCALE_FACTOR, SCALE_FACTOR, this.size[0], this.size[1])
  }
}
