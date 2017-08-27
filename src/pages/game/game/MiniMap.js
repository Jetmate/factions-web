import { MINIMAP_COORDS, MINIMAP_WIDTH, MINIMAP_BACKGROUND_COLOR, MINIMAP_PLAYER_COLOR, MINIMAP_UNIT_WIDTH } from './constants.js'

export default class MiniMap {
  draw (ctx, percentage) {
    ctx.fillStyle = MINIMAP_BACKGROUND_COLOR
    ctx.fillRect(window.innerWidth - (MINIMAP_COORDS[0] + MINIMAP_WIDTH), MINIMAP_COORDS[1], MINIMAP_WIDTH, MINIMAP_WIDTH)
    ctx.fillStyle = MINIMAP_PLAYER_COLOR
    let markerCoords = [percentage[0] * MINIMAP_WIDTH - MINIMAP_UNIT_WIDTH / 2, percentage[1] * MINIMAP_WIDTH - MINIMAP_UNIT_WIDTH / 2]
    ctx.fillRect(window.innerWidth - (MINIMAP_COORDS[0] + MINIMAP_WIDTH - markerCoords[0]) >> 0, MINIMAP_COORDS[1] + markerCoords[1] >> 0, MINIMAP_UNIT_WIDTH, MINIMAP_UNIT_WIDTH)
  }
}
