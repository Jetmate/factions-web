import { CANVAS_WIDTH, GUI_PADDING } from '../../constants.js'

export default class Gui {
  grid = [GUI_PADDING[1], GUI_PADDING[1]]
  elements = []

  addElement (element, size, side) {
    this.elements.push(element)
    let style = {}
    element.coords = [
      side ? CANVAS_WIDTH - (element.size[0] + GUI_PADDING[0]) : GUI_PADDING[0],
      this.grid[side]
    ]
    this.grid[side] += offset + element.size[1]
    return element
  }

  drawElements (ctx) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].draw(ctx)
    }
  }

  getElements () {
    return Object.keys(this.elements).map((element) => {
      <element />
    })
  }
}
