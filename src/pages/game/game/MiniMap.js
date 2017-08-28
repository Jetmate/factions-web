import { MINIMAP_COORDS, MINIMAP_WIDTH, MINIMAP_BACKGROUND_COLOR, MINIMAP_PLAYER_COLOR, MINIMAP_UNIT_WIDTH, CANVAS_WIDTH, SCALE_FACTOR, MINIMAP_OUTLINE_COLOR } from './constants.js'

export default class MiniMap {
  constructor () {
    this.sprite = document.createElement('canvas')
    this.sprite.width = MINIMAP_WIDTH
    this.sprite.height = MINIMAP_WIDTH
    let ctx = this.sprite.getContext('2d')
    ctx.fillStyle = MINIMAP_OUTLINE_COLOR
    ctx.fillRect(0, 0, MINIMAP_WIDTH, MINIMAP_WIDTH)
    ctx.fillStyle = MINIMAP_BACKGROUND_COLOR
    ctx.fillRect(SCALE_FACTOR, SCALE_FACTOR, MINIMAP_WIDTH - SCALE_FACTOR * 2, MINIMAP_WIDTH - SCALE_FACTOR * 2)
  }

  draw (ctx, percentage) {
    ctx.drawImage(this.sprite, CANVAS_WIDTH - (MINIMAP_COORDS[0] + MINIMAP_WIDTH), MINIMAP_COORDS[1])
    ctx.fillStyle = MINIMAP_PLAYER_COLOR
    let markerCoords = [percentage[0] * MINIMAP_WIDTH - MINIMAP_UNIT_WIDTH / 2, percentage[1] * MINIMAP_WIDTH - MINIMAP_UNIT_WIDTH / 2]
    ctx.fillRect(CANVAS_WIDTH - (MINIMAP_COORDS[0] + MINIMAP_WIDTH - markerCoords[0]) >> 0, MINIMAP_COORDS[1] + markerCoords[1] >> 0, MINIMAP_UNIT_WIDTH, MINIMAP_UNIT_WIDTH)
  }
}
