import { BLOCK_WIDTH, REAL_BLOCK_WIDTH, SCALE_FACTOR, BLOCK_OUTLINE_COLOR, BLOCK_COLOR, BLOCK_OUTLINE_WIDTH, FLOOR_COLOR, TREE_COLOR, TREE_OUTLINE, WIDTH, HEIGHT, DESTRUCTIBLE_BLOCKS, BLOCK_HEALTHS, BLOCK_DAMAGE_COLOR } from '../constants.js'
import { convertFromGrid } from '../helpers.js'

export default class Grid {
  constructor (grid, blockSprite, socket) {
    this.grid = grid
    this.width = grid.length
    this.height = grid[0].length
    this.health = this.generateHealth(grid)
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width * BLOCK_WIDTH
    this.canvas.height = this.height * BLOCK_WIDTH
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.ctx.webkitImageSmoothingEnabled = false
    this.ctx.mozImageSmoothingEnabled = false
    this.ctx.scale(SCALE_FACTOR, SCALE_FACTOR)
    this.blockSprite = blockSprite
    this.socket = socket
    this.generateSprite()
  }

  generateHealth (grid) {
    let health = {}
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (DESTRUCTIBLE_BLOCKS.includes(grid[x][y])) {
          health[[x, y]] = BLOCK_HEALTHS[grid[x][y]]
        }
      }
    }
    return health
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

    this.ctx.fillStyle = FLOOR_COLOR
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT)

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.drawBlock(x, y, false)
      }
    }
  }

  drawBlock (x, y, includeFloor = true) {
    let blockType = this.findType(x, y)
    if (blockType === 'block') {
      this.ctx.fillStyle = BLOCK_COLOR
      this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH)

      this.ctx.fillStyle = BLOCK_OUTLINE_COLOR
      if (this.findType(x - 1, y) === '') {
        this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, REAL_BLOCK_WIDTH)
      }
      if (this.findType(x + 1, y) === '') {
        this.ctx.fillRect(x * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, REAL_BLOCK_WIDTH)
      }
      if (this.grid[x][y - 1] === '') {
        this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH)
      }
      if (this.grid[x][y + 1] === '') {
        this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH)
      }

      this.ctx.fillStyle = FLOOR_COLOR
      if (this.findType(x - 1, y) === '') {
        if (this.grid[x][y - 1] === '') {
          this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
        }
        if (this.grid[x][y + 1] === '') {
          this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
        }
      }
      if (this.findType(x + 1, y) === '') {
        if (this.grid[x][y - 1] === '') {
          this.ctx.fillRect(x * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), y * REAL_BLOCK_WIDTH, BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
        }
        if (this.grid[x][y + 1] === '') {
          this.ctx.fillRect(x * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), y * REAL_BLOCK_WIDTH + (REAL_BLOCK_WIDTH - BLOCK_OUTLINE_WIDTH), BLOCK_OUTLINE_WIDTH, BLOCK_OUTLINE_WIDTH)
        }
      }
    } else if (blockType === 'tree') {
      this.ctx.fillStyle = TREE_OUTLINE
      this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH)
      this.ctx.fillStyle = TREE_COLOR
      this.ctx.fillRect(x * REAL_BLOCK_WIDTH + 1, y * REAL_BLOCK_WIDTH + 1, REAL_BLOCK_WIDTH - 2, REAL_BLOCK_WIDTH - 2)
    } else if (includeFloor) {
      this.ctx.fillStyle = FLOOR_COLOR
      this.ctx.fillRect(x * REAL_BLOCK_WIDTH, y * REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH, REAL_BLOCK_WIDTH)
    }
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc([0, 0])
    ctx.drawImage(this.canvas, x, y)
  }

  findType (x, y) {
    if (this.grid[x] !== undefined) {
      return this.grid[x][y]
    }
    return undefined
  }

  isSolid (x, y) {
    if (this.findType(x, y) === '') {
      return false
    }
    return true
  }

  takeDamage (x, y) {
    if (DESTRUCTIBLE_BLOCKS.includes(this.grid[x][y])) {
      this.health[[x, y]]--
      if (!this.health[[x, y]]) {
        this.socket.emit('gridChange', x, y, '')
        this.changeBlock(x, y, '')
        delete this.health[[x, y]]
      }
    }
  }

  drawDamage (ctx, coordsFunc) {
    ctx.fillStyle = BLOCK_DAMAGE_COLOR
    for (let coords in this.health) {
      let newCoords = coords.split(',')
      newCoords = [newCoords[0], newCoords[1]]
      let health = this.health[newCoords]
      let blockHealth = BLOCK_HEALTHS[this.grid[newCoords[0]][newCoords[1]]]
      if (health !== blockHealth) {
        let convertedCoords = coordsFunc(convertFromGrid(newCoords))
        ctx.fillRect(convertedCoords[0] + 1, convertedCoords[1] + 1, (blockHealth - health) / blockHealth * BLOCK_WIDTH >> 0, BLOCK_WIDTH)
      }
    }
  }

  changeBlock (x, y, newType) {
    this.grid[x][y] = newType
    this.drawBlock(x, y)
    this.drawBlock(x - 1, y)
    this.drawBlock(x + 1, y)
    this.drawBlock(x, y - 1)
    this.drawBlock(x, y + 1)
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
