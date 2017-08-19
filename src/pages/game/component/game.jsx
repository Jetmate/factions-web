import React from 'react'

const opposite = (number) => {
  return Math.abs(number - 1)
}

class Component extends React.Component {
  GRID_WIDTH = 20
  GRID_HEIGHT = 20
  BLOCK_WIDTH = 20

  WIDTH = this.GRID_WIDTH * this.BLOCK_WIDTH
  HEIGHT = this.GRID_HEIGHT * this.BLOCK_WIDTH

  UPDATE_WAIT = 100

  GRID_COLOR = '#bdc3c7'
  COLORS = {PLAYER: '#c0392b', OPPONENT: '#16a085'}
  PLAYER_STARTING_COORDS = [[0, 0], [this.GRID_WIDTH - 1, this.GRID_HEIGHT - 1]]

  KEY_RIGHT = 39
  KEY_LEFT = 37
  KEY_UP = 38
  KEY_DOWN = 40

  render () {
    return (
      <canvas ref={this.init}>Looks like your browser does not support the JS canvas. yikes.</canvas>
    )
  }

  createGrid = () => {
    let grid = []
    for (let x = 0; x < this.GRID_WIDTH; x++) {
      grid[x] = []
      for (let y = 0; y < this.GRID_WIDTH; y++) {
        grid[x][y] = ''
      }
    }
    return grid
  }

  init = (canvas) => {
    canvas.width = this.WIDTH
    canvas.height = this.HEIGHT
    const ctx = canvas.getContext('2d')

    let updateTime = 0
    let player = new Player('PLAYER', this.PLAYER_STARTING_COORDS[window.playerIndex])
    let opponent = new Player('OPPONENT', this.PLAYER_STARTING_COORDS[opposite(window.playerIndex)])
    let grid = this.createGrid()
    player.move(grid)
    opponent.move(grid)
    this.draw(ctx, grid)

    this.initInput(ctx, grid, player)
    this.initOpponent(ctx, grid, opponent)

    this.update = (timestamp) => {
      if (timestamp - updateTime > this.UPDATE_WAIT) {
        console.log('BEFORE MAIN`')
        this.main(ctx, player, opponent, grid)
        updateTime = timestamp
        window.requestAnimationFrame(this.update)
      } else {
        window.requestAnimationFrame(this.update)
      }
    }
    window.requestAnimationFrame(this.update)
  }

  main = (ctx, player, opponent, grid) => {
    player.execute(grid, this.GRID_WIDTH, this.GRID_HEIGHT)
    opponent.execute(grid, this.GRID_WIDTH, this.GRID_HEIGHT)
    this.draw(ctx, grid)
  }

  draw = (ctx, grid) => {
    ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)
    this.drawOutline(ctx)
    this.drawContents(ctx, grid)
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

        case this.KEY_SHOOT_LEFT:
          action = 'SHOOT-LEFT'
          break
        case this.KEY_SHOOT_RIGHT:
          action = 'SHOOT-RIGHT'
          break
        case this.KEY_SHOOT_UP:
          action = 'SHOOT-UP'
          break
        case this.KEY_SHOOT_DOWN:
          action = 'SHOOT-DOWN'
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

        case this.KEY_SHOOT_LEFT:
          action = 'UNSHOOT-LEFT'
          break
        case this.KEY_SHOOT_RIGHT:
          action = 'UNSHOOT-RIGHT'
          break
        case this.KEY_SHOOT_UP:
          action = 'UNSHOOT-UP'
          break
        case this.KEY_SHOOT_DOWN:
          action = 'UNSHOOT-DOWN'
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

  drawOutline = (ctx) => {
    ctx.strokeStyle = this.GRID_COLOR
    for (let x = 0; x <= this.GRID_WIDTH; x++) {
      ctx.beginPath()
      ctx.moveTo(x * this.BLOCK_WIDTH, 0)
      ctx.lineTo(x * this.BLOCK_WIDTH, this.HEIGHT)
      ctx.stroke()
    }
    for (let y = 0; y <= this.GRID_HEIGHT; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * this.BLOCK_WIDTH)
      ctx.lineTo(this.WIDTH, y * this.BLOCK_WIDTH)
      ctx.stroke()
    }
  }

  drawContents = (ctx, grid) => {
    for (let x = 0; x < this.GRID_WIDTH; x++) {
      for (let y = 0; y < this.GRID_WIDTH; y++) {
        if (grid[x][y]) {
          ctx.fillStyle = this.COLORS[grid[x][y]]
          ctx.fillRect(x * this.BLOCK_WIDTH, y * this.BLOCK_WIDTH, this.BLOCK_WIDTH, this.BLOCK_WIDTH)
        }
      }
    }
  }
}


class Player {
  constructor (type, coords) {
    this.type = type
    this.coords = coords
    this.velocity = [0, 0]
  }

  setAction (action) {
    let actionType = action.split('-')[0]
    switch (actionType) {
      case 'MOVE': {
        switch (action) {
          case 'MOVE-RIGHT': {
            this.velocity[0] = 1
            break
          }
          case 'MOVE-LEFT': {
            this.velocity[0] = -1
            break
          }
          case 'MOVE-UP': {
            this.velocity[1] = -1
            break
          }
          case 'MOVE-DOWN': {
            this.velocity[1] = 1
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
      case 'SHOOT': {
        switch (action) {
          case 'SHOOT-RIGHT': {
            this.shooting[0] = true
            break
          }
          case 'SHOOT-LEFT': {
            this.velocity[1] = true
            break
          }
          case 'SHOOT-UP': {
            this.velocity[2] = true
            break
          }
          case 'SHOOT-DOWN': {
            this.velocity[3] = true
            break
          }
        }
        break
      }
      case 'UNSHOOT': {
        switch (action) {
          case 'UNSHOOT-LEFT': {
            this.shooting[0] = false
            break
          }
          case 'UNSHOOT-RIGHT': {
            this.shooting[1] = false
            break
          }
          case 'UNSHOOT-UP': {
            this.shooting[2] = false
            break
          }
          case 'UNSHOOT-DOWN': {
            this.shooting[3] = false
            break
          }
        }
        break
      }
    }
  }

  execute (grid) {
    if (this.velocity[0] || this.velocity[1]) {
      if (grid[this.coords[0] + this.velocity[0]] !== undefined) {
        let destination = grid[this.coords[0] + this.velocity[0]][this.coords[1] + this.velocity[1]]
        console.log(destination)
        if (destination !== undefined && destination !== 'OPPONENT') {
          this.move(grid)
        }
      }
    }
  }

  withinBounds (width, height) {
    console.log(this.coords, this.velocity, width, height)
    return (this.coords[0] + this.velocity[0] >= 0 && this.coords[0] + this.velocity[0] < width) &&
           (this.coords[1] + this.velocity[1] >= 0 && this.coords[1] + this.velocity[1] < height)
  }

  move(grid) {
    grid[this.coords[0]][this.coords[1]] = ''
    this.coords[0] += this.velocity[0]
    this.coords[1] += this.velocity[1]
    grid[this.coords[0]][this.coords[1]] = this.type
  }
}

export default Component
