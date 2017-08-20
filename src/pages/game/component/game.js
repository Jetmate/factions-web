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

  constructor (coords, sprite) {
    this.sprite = sprite
    this.size = [sprite.width, sprite.height]
    this.coords = findCenter([BLOCK_WIDTH, BLOCK_WIDTH], this.size, coords)
    this.fakeCoords = findCenter([CANVAS_WIDTH / 3, CANVAS_HEIGHT / 3], this.size)
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

  draw (ctx) {
    ctx.drawImage(this.sprite, this.fakeCoords[0], this.fakeCoords[1])
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



class Opponent {
  constructor (coords, sprite) {
    this.sprite = sprite
    this.coords = coords
  }

  processChange (changeType, value) {
    switch (changeType) {
      case 'coords': {
        this.coords = value
        break
      }
    }
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc(this.coords)
    ctx.drawImage(this.sprite, x, y)
  }
}



function main (ctx, grid, player, opponents, socket) {
  player.execute(grid, socket)
  
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawOutline(ctx, player.generateDisplayCoords)
  drawGrid(ctx, grid, player.generateDisplayCoords)
  for (let id in opponents) {
    opponents[id].draw(ctx, player.generateDisplayCoords)
  }
  player.draw(ctx)
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


let ctx, socket

document.addEventListener('finishCanvasInit', (event) => {
  p('FINISH CTX EVENT')
  if (socket) {
    p('START')
    init(ctx, socket)
  } else {
    document.addEventListener('finishSocketInit', (event) => {
      p('DELAYED START')
      init(ctx, socket)
    })
  }
})



function init (ctx, socket) {
  let grid = JSON.parse(window.grid)
  let opponents = []

  const spriteSheetImage = new Image()
  spriteSheetImage.src = 'media/spritesheet.png'
  
  spriteSheetImage.onload = () => {
    const spriteSheet = new SpriteSheet(spriteSheetImage, SCALE_FACTOR)
    const playerSprite = spriteSheet.getSprite(12, 6, true)      

    let player = new Player(convertFromGrid(JSON.parse(window.coords)), playerSprite)
    
    socket.emit('new', window.id, player.coords)

    socket.on('player', (id, coords) => {
      opponents[id] = new Opponent(coords, playerSprite)
      // console.log('OPPONENTS', opponents)
      // console.log('RECEIVED PLAYER:', id) 
    })


    socket.on('new', (id, coords) => {
      opponents[id] = new Opponent(coords, playerSprite)
      // console.log('OPPONENTS', opponents)
      // console.log('NEW PLAYER:', id)
      socket.emit('player', window.id, player.coords)
    })


    socket.on('close', (id) => {
      // console.log('CLOSE', id)
      delete opponents[id]
    })


    socket.on('playerChange', (id, type, value) => {
      // console.log('OPPONENTS', opponents)
      // console.log('ACTION:', id)
      // console.log('CHANGE', type, value)
      opponents[id].processChange(type, value)
    })

    initInput(player)

    let updateTime = 0
    const update = (timestamp) => {
      if (timestamp - updateTime > UPDATE_WAIT) {
        main(ctx, grid, player, opponents, socket)
        updateTime = timestamp
        window.requestAnimationFrame(update)
      } else {
        window.requestAnimationFrame(update)
      }
    }
    window.requestAnimationFrame(update)
  }
}

function initInput (player) {
  p('INITINPUT')
  document.addEventListener('keydown', (event) => {
    let action
    switch (event.keyCode) {
      case KEY_LEFT:
        player.move('LEFT')
        break
      case KEY_RIGHT:
        player.move('RIGHT')
        break
      case KEY_UP:
        player.move('UP')
        break
      case KEY_DOWN:
        player.move('DOWN')
        break

      default:
        return
    }
  })

  document.addEventListener('keyup', (event) => {
    let action
    switch (event.keyCode) {
      case KEY_LEFT:
        player.unmove('LEFT')
        break
      case KEY_RIGHT:
        player.unmove('RIGHT')
        break
      case KEY_UP:
        player.unmove('UP')
        break
      case KEY_DOWN:
        player.unmove('DOWN')
        break

      default:
        return
    }
  })
}


export function setCanvas (canvas) {
  p('INITCANVAS')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.scale(SCALE_FACTOR, SCALE_FACTOR)

  const event = new Event('finishCanvasInit')
  document.dispatchEvent(event)
}

export function setSocket (socket_) {
  p('INITSOCKET')
  socket = socket_
  const event = new Event('finishSocketInit')
  document.dispatchEvent(event)
}
