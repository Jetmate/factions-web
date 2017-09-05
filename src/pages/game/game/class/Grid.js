import { BLOCK_WIDTH, REAL_BLOCK_WIDTH, SCALE_FACTOR, BLOCK_OUTLINE_COLOR, BLOCK_COLOR, BLOCK_OUTLINE_WIDTH, FLOOR_COLOR } from '../constants.js'

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
    this.ctx.webkitImageSmoothingEnabled = false
    this.ctx.mozImageSmoothingEnabled = false
    this.ctx.scale(SCALE_FACTOR, SCALE_FACTOR)
    this.blockSprite = blockSprite
    this.generateSprite()
  }

  generateSprite () {
    // this.ctx.beginPath()
    // this.ctx.strokeStyle = GRID_COLOR
    // let begin, end
    // for (let x = 0; x <= this.width; x++) {
    //   begin = [x * REAL_BLOCK_WIDTH, 0]
    //   end = [x * REAL_BLOCK_WIDTH, this.canvas.height]
    //   // console.log('begin', begin, 'end', end)
    //   this.ctx.moveTo(begin[0], begin[1])
    //   this.ctx.lineTo(end[0], end[1])
    // }
    // for (let y = 0; y <= this.height; y++) {
    //   begin = [0, y * REAL_BLOCK_WIDTH]
    //   end = [this.canvas.width, y * REAL_BLOCK_WIDTH]
    //   this.ctx.moveTo(begin[0], begin[1])
    //   this.ctx.lineTo(end[0], end[1])
    // }
    // this.ctx.stroke()


    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.grid[x][y] === 'block') {
          this.ctx.fillStyle = BLOCK_COLOR
          this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH)

          this.ctx.fillStyle = BLOCK_OUTLINE_COLOR
          if (this.grid[x - 1] && this.grid[x - 1][y] === '') {
            this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, REAL_BLOCK_WIDTH)
          }
          if (this.grid[x + 1] && this.grid[x + 1][y] === '') {
            this.ctx.fillRect(x * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, REAL_BLOCK_WIDTH)
          }
          if (this.grid[x][y - 1] === '') {
            this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH)
          }
          if (this.grid[x][y + 1] === '') {
            this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH)
          }

          this.ctx.fillStyle = FLOOR_COLOR
          if (this.grid[x - 1] && this.grid[x - 1][y] === '') {
            if (this.grid[x][y - 1] === '') {
              this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
            }
            if (this.grid[x][y + 1] === '') {
              this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
            }
          }
          if (this.grid[x + 1] && this.grid[x + 1][y] === '') {
            if (this.grid[x][y - 1] === '') {
              this.ctx.fillRect(x * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
            }
            if (this.grid[x][y + 1] === '') {
              this.ctx.fillRect(x * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), y * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
            }
          }
        } else {
          this.ctx.fillStyle = FLOOR_COLOR
          this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH)
        }
      }
    }
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc([0, 0])
    ctx.drawImage(this.canvas, x, y)
  }

  isSolid (x, y) {
    if (this.grid[x] !== undefined && this.grid[x][y] === '') {
      return false
    }
    return true
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
