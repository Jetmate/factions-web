import { CANVAS_WIDTH } from './constants.js'

export default class Gui {
  grid = [0, 0]
  elements = []

  addElement (element, offset, side) {
    this.elements.push(element)
    element.coords = [
      side ? CANVAS_WIDTH - (element.size[0] + offset[0]) : offset[0],
      this.grid[side] + offset[1]
    ]
    this.grid[side] += offset[1] + element.size[1]
    return element
  }

  drawElements (ctx) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].draw(ctx)
    }
  }
}
