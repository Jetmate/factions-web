import SpriteSheet from './SpriteSheet.js'



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

function convertFromGrid (coords) {
  return [coords[0] * BLOCK_WIDTH, coords[1] * BLOCK_WIDTH]
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

function withinBounds (coords, size) {
  return (
    coords[0] >= 0 && coords[0] + size[0] <= WIDTH &&
    coords[1] >= 0 && coords[1] + size[1] <= HEIGHT
  )
}



class Player {
  SPEED = 5

  constructor (coords, sprite, size) {
    this.sprite = sprite
    this.size = [sprite.width, sprite.height]
    this.coords = findCenter([BLOCK_WIDTH, BLOCK_WIDTH], this.size, coords)
    this.fakeCoords = findCenter([CANVAS_WIDTH / 3, CANVAS_HEIGHT / 3], this.size)
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
    for (let i = 0; i < 2; i++) {
      if (this.velocity[i]) {
        let newCoords = this.coords.slice()
        newCoords[i] += this.velocity[i]
        if (withinBounds(newCoords, this.size)) {
          this.coords[i] = newCoords[i]
        }
        // let gridCoords = findAllGridCoords(newCoords, this.size)
      }
    }
  }

  generateDisplayCoords = (coords) => {
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



function main (ctx, grid, player, opponents) {
  player.execute(grid)

  for (let id in opponents) {
    opponents[id].execute(grid) 
  }
  
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawOutline(ctx, player.generateDisplayCoords)
  drawGrid(ctx, grid, player.generateDisplayCoords)
  player.draw(ctx)
  for (let id in opponents) {
    opponents[id].draw(ctx, player.generateDisplayCoords)
  }
}

function drawOutline (ctx, coordsFunc) {
  ctx.beginPath()
  ctx.strokeStyle = GRID_COLOR
  let begin, end
  for (let x = 0; x <= GRID_WIDTH; x++) {
    begin = coordsFunc([x * BLOCK_WIDTH, 0])
    end = coordsFunc([x * BLOCK_WIDTH, HEIGHT])
    // console.log('begin', begin, 'end', end)
    ctx.moveTo(begin[0], begin[1])
    ctx.lineTo(end[0], end[1])
  }
  for (let y = 0; y <= GRID_HEIGHT; y++) {
    begin = coordsFunc([0, y * BLOCK_WIDTH])
    end = coordsFunc([WIDTH, y * BLOCK_WIDTH])
    ctx.moveTo(begin[0], begin[1])
    ctx.lineTo(end[0], end[1])
  }
  ctx.stroke()
}

function drawGrid (ctx, grid, coordsFunc) {
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (grid[x][y]) {
        // ctx.drawImage(this.sprites[grid[x][y]], coordsFunc(convertFromGrid([x, y])))
      }
    }
  }
}



const GRID_WIDTH = window.GRID_WIDTH,
      GRID_HEIGHT = window.GRID_HEIGHT,
      SCALE_FACTOR = 3,
      BLOCK_WIDTH = 16 ,
      WIDTH = GRID_WIDTH * BLOCK_WIDTH,
      HEIGHT = GRID_HEIGHT * BLOCK_WIDTH,
      CANVAS_WIDTH = window.innerWidth,
      CANVAS_HEIGHT = window.innerHeight,

      UPDATE_WAIT = 33,

      ///// ARROW KEYS
      // KEY_RIGHT = 39,
      // KEY_LEFT = 37,
      // KEY_UP = 38,
      // KEY_DOWN = 40,

      ///// WASD
      KEY_RIGHT = 68,
      KEY_LEFT = 65,
      KEY_UP = 87,
      KEY_DOWN = 83,

      GRID_COLOR = '#8e8e8e'


let grid, opponents, player, ctx, update

document.addEventListener('finishSocketInit', (event) => {
  p('FINISH SOCKET EVENT')
  if (update !== undefined) {
    p('START')
    window.requestAnimationFrame(update)
  } else {
    document.addEventListener('finishCanvasInit', (event) => {
      p('DELAYED START')
      window.requestAnimationFrame(update)
    })
  }
})



export function initSocket (socket) {
  p('INITSOCKET')
  initPlayer((playerSprite) => {
    initInput(socket)

    socket.emit('new', window.id, player.coords)

    socket.on('player', (id, coords) => {
      opponents[id] = new Player(coords, playerSprite)
      // console.log('OPPONENTS', opponents)
      // console.log('RECEIVED PLAYER:', id) 
    })


    socket.on('new', (id, coords) => {
      opponents[id] = new Player(coords, playerSprite)
      // console.log('OPPONENTS', opponents)
      // console.log('NEW PLAYER:', id)
      socket.emit('player', window.id, player.coords)
    })


    socket.on('close', (id) => {
      // console.log('CLOSE', id)
      delete opponents[id]
    })


    socket.on('action', (id, action) => {
      // console.log('OPPONENTS', opponents)
      // console.log('ACTION:', id)
      opponents[id].setAction(action)
    })


    const event = new Event('finishSocketInit')
    document.dispatchEvent(event)
  })
}

function initPlayer(callback) {
  p('INITPLAYER')
  grid = JSON.parse(window.grid)
  opponents = []

  const spriteSheetImage = new Image()
  spriteSheetImage.src = 'media/spritesheet.png'
  
  spriteSheetImage.onload = () => {
    const spriteSheet = new SpriteSheet(spriteSheetImage, SCALE_FACTOR)
    const playerSprite = spriteSheet.getSprite(12, 6, true)      

    player = new Player(convertFromGrid(JSON.parse(window.coords)), playerSprite)

    callback(playerSprite)
  }
}

function initInput (socket) {
  p('INITINPUT')
  document.addEventListener('keydown', (event) => {
    let action
    switch (event.keyCode) {
      case KEY_LEFT:
        action = 'MOVE-LEFT'
        break
      case KEY_RIGHT:
        action = 'MOVE-RIGHT'
        break
      case KEY_UP:
        action = 'MOVE-UP'
        break
      case KEY_DOWN:
        action = 'MOVE-DOWN'
        break

      default:
        return
    }
    socket.emit('action', window.id, action)
    player.setAction(action)
  })

  document.addEventListener('keyup', (event) => {
    let action
    switch (event.keyCode) {
      case KEY_LEFT:
        action = 'UNMOVE-LEFT'
        break
      case KEY_RIGHT:
        action = 'UNMOVE-RIGHT'
        break
      case KEY_UP:
        action = 'UNMOVE-UP'
        break
      case KEY_DOWN:
        action = 'UNMOVE-DOWN'
        break

      default:
        return
    }
    socket.emit('action', window.id, action)
    player.setAction(action)
  })
}


export function initCanvas (canvas) {
  p('INITCANVAS')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.scale(SCALE_FACTOR, SCALE_FACTOR)

  initLoop()
}
  
function initLoop () {
  p('INITLOOP')
  let updateTime = 0
  update = (timestamp) => {
    if (timestamp - updateTime > UPDATE_WAIT) {
      main(ctx, grid, player, opponents)
      updateTime = timestamp
      window.requestAnimationFrame(update)
    } else {
      window.requestAnimationFrame(update)
    }
  }

  const event = new Event('finishCanvasInit')
  document.dispatchEvent(event)
}
