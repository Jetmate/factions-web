import { MINIMAP_PLAYER_COLOR, MINIMAP_MARKER_WIDTH, WIDTH, HEIGHT } from './constants.js'
import Element from './Element.js'

export default class MiniMap extends Element {
  changeMarkerCoords (coords) {
    let percentage = [coords[0] / WIDTH, coords[1] / HEIGHT]
    this.markerCoords = [percentage[0] * this.innerSize[0] - MINIMAP_MARKER_WIDTH / 2, percentage[1] * this.innerSize[1] - MINIMAP_MARKER_WIDTH / 2]
  }

  draw (ctx) {
    ctx.drawImage(this.sprite, this.coords[0], this.coords[1])
    ctx.fillStyle = MINIMAP_PLAYER_COLOR
    ctx.fillRect(this.coords[0] + this.markerCoords[0], this.coords[1] + this.markerCoords[1], MINIMAP_MARKER_WIDTH, MINIMAP_MARKER_WIDTH)
  }
}
