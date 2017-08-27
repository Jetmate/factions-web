import { BLOCK_WIDTH, SCALE_FACTOR } from './constants.js'

export default class Grid {
  constructor (grid, blockSprite) {
    this.grid = grid
    this.canvas = document.createElement('canvas')
    this.width = grid.length
    this.height = grid[0].length
    this.canvas.width = this.width * BLOCK_WIDTH
    this.canvas.height = this.height * BLOCK_WIDTH
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.ctx.scale(SCALE_FACTOR, SCALE_FACTOR)
    this.blockSprite = blockSprite
    this.generateSprite()
  }

  generateSprite () {
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'black'
    let begin, end
    for (let x = 0; x <= this.width; x++) {
      begin = [x * 16, 0]
      end = [x * 16, this.canvas.height]
      // console.log('begin', begin, 'end', end)
      this.ctx.moveTo(begin[0], begin[1])
      this.ctx.lineTo(end[0], end[1])
    }
    for (let y = 0; y <= this.height; y++) {
      begin = [0, y * 16]
      end = [this.canvas.width, y * 16]
      this.ctx.moveTo(begin[0], begin[1])
      this.ctx.lineTo(end[0], end[1])
    }
    this.ctx.stroke()

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.grid[x][y] === 'block') {
          this.ctx.drawImage(this.blockSprite, x * 16, y * 16)
        }
      }
    }
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc([0, 0])
    // console.log(x, y)
    ctx.drawImage(this.canvas, x, y)
  }
}


// function drawOutline (ctx, coordsFunc) {
//   ctx.beginPath()
//   ctx.strokeStyle = GRID_COLOR
//   let begin, end
//   for (let x = 0; x <= GRID_WIDTH; x++) {
//     begin = [x * BLOCK_WIDTH, 0])
//     end = [x * BLOCK_WIDTH, HEIGHT])
//     // console.log('begin', begin, 'end', end)
//     ctx.moveTo(begin[0], begin[1])
//     ctx.lineTo(end[0], end[1])
//   }
//   for (let y = 0; y <= GRID_HEIGHT; y++) {
//     begin = [0, y * BLOCK_WIDTH])
//     end = [WIDTH, y * BLOCK_WIDTH])
//     ctx.moveTo(begin[0], begin[1])
//     ctx.lineTo(end[0], end[1])
//   }
//   ctx.stroke()
// }
