import { MINIMAP_PLAYER_COLOR, MINIMAP_MARKER_WIDTH, WIDTH, HEIGHT } from '../../constants.js'

export default class MiniMap {
  constructor (size) {
    this.size = size
  }

  changeMarkerCoords (coords) {
    let percentage = [coords[0] / WIDTH, coords[1] / HEIGHT]
    this.markerCoords = [percentage[0] * this.size[0] - MINIMAP_MARKER_WIDTH / 2, percentage[1] * this.size[1] - MINIMAP_MARKER_WIDTH / 2]
  }

  draw (ctx) {
    ctx.fillStyle = MINIMAP_PLAYER_COLOR
    ctx.fillRect(this.markerCoords[0], this.markerCoords[1], MINIMAP_MARKER_WIDTH, MINIMAP_MARKER_WIDTH)
  }
}
