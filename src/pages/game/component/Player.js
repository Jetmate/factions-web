import { findCenter, withinBounds } from './helpers.js'
import { BLOCK_WIDTH, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js'

export default class Player {
  SPEED = 5

  constructor (coords, spriteManager) {
    this.spriteManager = spriteManager
    this.size = [spriteManager.canvas.width, spriteManager.canvas.height]
    this.coords = findCenter([BLOCK_WIDTH, BLOCK_WIDTH], this.size, coords)
    this.fakeCoords = findCenter([CANVAS_WIDTH, CANVAS_HEIGHT], this.size)
    this.fakeCenterCoords = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2] 
    p(CANVAS_WIDTH, CANVAS_HEIGHT, this.fakeCoords)
    this.velocity = [0, 0]
    this.directions = {'RIGHT': false, 'LEFT': false, 'UP': false, 'DOWN': false}
  }

  move (direction) {
    switch (direction) {
      case 'RIGHT': {
        this.velocity[0] = this.SPEED
        this.directions['RIGHT'] = true
        break
      }
      case 'LEFT': {
        this.velocity[0] = -this.SPEED
        this.directions['LEFT'] = true
        break
      }
      case 'UP': {
        this.velocity[1] = -this.SPEED
        this.directions['UP'] = true
        break
      }
      case 'DOWN': {
        this.velocity[1] = this.SPEED
        this.directions['DOWN'] = true
        break
      } 
    }
  }

  unmove (direction) {
    switch (direction) {
      case 'RIGHT': {
        this.velocity[0] = (this.directions['LEFT'] ? -this.SPEED : 0)
        this.directions['RIGHT'] = false
        break
      }
      case 'LEFT': {
        this.velocity[0] = (this.directions['RIGHT'] ? this.SPEED : 0)
        this.directions['LEFT'] = false
        break
      }
      case 'UP': {
        this.velocity[1] = (this.directions['DOWN'] ? this.SPEED : 0)
        this.directions['UP'] = false
        break
      }
      case 'DOWN': {
        this.velocity[1] = (this.directions['UP'] ? -this.SPEED : 0)
        this.directions['DOWN'] = false
        break
      } 
    }
  }

  rotate(cursorX, cursorY) {
    let cursorDiff = [cursorX - this.fakeCenterCoords[0], cursorY - this.fakeCenterCoords[1]]
    let rotation = Math.atan(cursorDiff[1] / cursorDiff[0]) + -1.5708

    if (cursorDiff[0] < 0) {
      rotation += 3.14159
    }
    this.spriteManager.rotate(rotation)
  }

  draw (ctx) {
    ctx.drawImage(this.spriteManager.currentSprite(), this.fakeCoords[0], this.fakeCoords[1])
  }

  generateDisplayCoords = (coords) => {
    return [
      coords[0] + this.fakeCoords[0] - this.coords[0],
      coords[1] + this.fakeCoords[1] - this.coords[1]
    ]
  }

    execute (grid, socket) {
      let oldCoords = this.coords.slice()
      for (let i = 0; i < 2; i++) {
        if (this.velocity[i]) {
          let newCoords = this.coords.slice()
        newCoords[i] += this.velocity[i]
        if (withinBounds(newCoords, this.size)) {
          this.coords[i] = newCoords[i]
        }
      }
    }

    if (this.coords[0] !== oldCoords[0] || this.coords[1] !== oldCoords[1]) {
      socket.emit('playerChange', window.id, 'coords', this.coords)
    }
  }
}
