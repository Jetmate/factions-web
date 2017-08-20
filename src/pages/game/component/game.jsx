import React from 'react'

import SpriteSheet from './SpriteSheet.js'

const GRID_WIDTH = window.GRID_WIDTH
const GRID_HEIGHT = window.GRID_HEIGHT
const BLOCK_WIDTH = 10
const WIDTH = BLOCK_WIDTH * 10
const HEIGHT = BLOCK_WIDTH * 10


function opposite (number) {
  return Math.abs(number - 1)
}

function convertToGrid (x, y) {
  return [(x / BLOCK_WIDTH) >> 0, (y / BLOCK_WIDTH) >> 0]
} 

function findAllGridCoords (coords, size) {
  let allCoords = []

  let firstCoords = convertToGrid(coords[0], coords[1])
  allCoords.push(firstCoords)

  let xCoords = convertToGrid(coords[0] + size[0], coords[1])
  if (xCoords[0] !== firstCoords[0]) {
    allCoords.push(xCoords)
  }

  let yCoords = convertToGrid(coords[0], coords[1] + size[1])
  if (yCoords[1] !== firstCoords[1]) {
    allCoords.push(yCoords)
  }

  if (xCoords[0] !== firstCoords[0] && yCoords[1] !== firstCoords[1]) {
    allCoords.push(convertToGrid(coords[0] + size[0], coords[1] + size[1]))
  }

  return allCoords
}

function convertFromGrid (x, y) {
  return [x * BLOCK_WIDTH, y * BLOCK_WIDTH]
}

function findCenter (size1, size2, coords) {
  if (coords) {
    return [
      (size1[0] / 2 - size2[0] / 2) + coords[0],
      (size1[1] / 2 - size2[1] / 2) + coords[1]
    ]  
  }
  return [
    size1[0] / 2 - size2[0] / 2,
    size1[1] / 2 - size2[1] / 2
  ]
}

function withinBounds (coords, grid) {
  for (let i = 0; i < coords.length; i++) {
    if (grid[coords[i][0]] === undefined || grid[coords[i][0]][coords[i][1]] === undefined) {
      return false
    }
  }
  return true
}


class Component extends React.Component {
  // UPDATE_WAIT = 33
  UPDATE_WAIT = 1000

  // ARROW KEYS
  // KEY_RIGHT = 39
  // KEY_LEFT = 37
  // KEY_UP = 38
  // KEY_DOWN = 40

  // WASD
  KEY_RIGHT = 68
  KEY_LEFT = 65
  KEY_UP = 87
  KEY_DOWN = 83

  render () {
    return (
      <canvas ref={this.init}>Looks like your browser does not support the JS canvas. yikes.</canvas>
    )
  }

  init = (canvas) => {
    canvas.width = WIDTH
    canvas.height = HEIGHT
    const ctx = canvas.getContext('2d')

    const spriteSheetImage = new Image()
    spriteSheetImage.src = 'media/spritesheet.png'
    
    spriteSheetImage.onload = () => {
      const spriteSheet = new SpriteSheet(spriteSheetImage)
      const playerSprite = spriteSheet.getSprite(12, 6, true)      
      let updateTime = 0
      let grid = JSON.parse(window.grid)
      let player = new Player(JSON.parse(window.coords), playerSprite, [playerSprite.width, playerSprite.height])
      let opponents = []

      this.initInput(ctx, grid, player)

      this.update = (timestamp) => {
        if (timestamp - updateTime > this.UPDATE_WAIT) {
          this.main(ctx, grid, player, opponents)
          updateTime = timestamp
          window.requestAnimationFrame(this.update)
        } else {
          window.requestAnimationFrame(this.update)
        }
      }
      window.requestAnimationFrame(this.update)
    }
  }

  main = (ctx, grid, player, opponents) => {
    player.execute(grid)
    p(player.coords)
    // opponent.execute(grid)
    
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    player.draw(ctx)
    // opponent.draw(player.generateDisplayCoords)
    // this.drawOutline()
    this.drawGrid(ctx, grid, player.generateDisplayCoords)
  }

  initInput = (ctx, grid, player) => {
    document.addEventListener('keydown', (event) => {
      let action
      switch (event.keyCode) {
        case this.KEY_LEFT:
          action = 'MOVE-LEFT'
          break
        case this.KEY_RIGHT:
          action = 'MOVE-RIGHT'
          break
        case this.KEY_UP:
          action = 'MOVE-UP'
          break
        case this.KEY_DOWN:
          action = 'MOVE-DOWN'
          break

        default:
          return
      }
      this.props.socket.emit('action', action)
      player.setAction(action)
    })

    document.addEventListener('keyup', (event) => {
      let action
      switch (event.keyCode) {
        case this.KEY_LEFT:
          action = 'UNMOVE-LEFT'
          break
        case this.KEY_RIGHT:
          action = 'UNMOVE-RIGHT'
          break
        case this.KEY_UP:
          action = 'UNMOVE-UP'
          break
        case this.KEY_DOWN:
          action = 'UNMOVE-DOWN'
          break

        default:
          return
      }
      this.props.socket.emit('action', action)
      player.setAction(action)
    })
  }

  initOpponent = (ctx, grid, opponent) => {
    this.props.socket.on('action', (action) => {
      opponent.setAction(action)
    })
  }

  // drawOutline = (ctx, coordsFunc) => {
  //   ctx.beginPath()
  //   ctx.strokeStyle = this.GRID_COLOR
  //   for (let x = 0; x <= GRID_WIDTH; x++) {
  //     ctx.moveTo(x * this.BLOCK_WIDTH, 0)
  //     ctx.lineTo(x * this.BLOCK_WIDTH, HEIGHT)
  //   }
  //   for (let y = 0; y <= GRID_HEIGHT; y++) {
  //     ctx.moveTo(0, y * this.BLOCK_WIDTH)
  //     ctx.lineTo(WIDTH, y * this.BLOCK_WIDTH)
  //   }
  //   ctx.stroke()
  // }

  drawGrid = (ctx, grid, coordsFunc) => {
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        if (grid[x][y]) {
          ctx.drawImage(this.sprites[grid[x][y]], coordsFunc(convertFromGrid(x, y)))
        }
      }
    }
  }
}


class Player {
  SPEED = 5 

  constructor (gridCoords, sprite, size) {
    this.sprite = sprite
    this.size = size
    this.coords = findCenter([BLOCK_WIDTH, BLOCK_WIDTH], size, gridCoords)
    this.fakeCoords = findCenter([WIDTH, HEIGHT], this.size)
    this.velocity = [0, 0]
  }

  setAction (action) {
    let actionType = action.split('-')[0]
    switch (actionType) {
      case 'MOVE': {
        switch (action) {
          case 'MOVE-RIGHT': {
            this.velocity[0] = this.SPEED
            break
          }
          case 'MOVE-LEFT': {
            this.velocity[0] = -this.SPEED
            break
          }
          case 'MOVE-UP': {
            this.velocity[1] = -this.SPEED
            break
          }
          case 'MOVE-DOWN': {
            this.velocity[1] = this.SPEED
            break
          }
        }
        break
      }
      case 'UNMOVE': {
        switch (action) {
          case 'UNMOVE-RIGHT':
          case 'UNMOVE-LEFT': {
            this.velocity[0] = 0
            break
          }
          case 'UNMOVE-UP':
          case 'UNMOVE-DOWN': {
            this.velocity[1] = 0
            break
          }
        }
        break
      }
    }
  }

  execute (grid) {
    if (this.velocity[0] || this.velocity[1]) {
      let newCoords = [this.coords[0] + this.velocity[0], this.coords[1] + this.velocity[1]]
      let gridCoords = findAllGridCoords(newCoords, this.size)
      if (withinBounds(gridCoords, grid)) {
        this.coords = newCoords
      }
    }
  }

  generateDisplayCoords (coords) {
    return [
      coords[0] + this.fakeCoords[0] - this.coords[0],
      coords[1] + this.fakeCoords[1] - this.coords[1]
    ]
  }

  draw (ctx, coordsFunc) {
    if (coordsFunc) {
      let [x, y] = coordsFunc(this.coords)
      ctx.drawImage(this.sprite, x, y)
      return
    }
    ctx.drawImage(this.sprite, this.fakeCoords[0], this.fakeCoords[1])
  }
}

export default Component
