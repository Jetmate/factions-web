import SpriteSheet from './SpriteSheet.js'
import SpriteManager from './SpriteManager.js'
import Player from './Player.js'
import Opponent from './Opponent.js'
import Bullet from './Bullet.js'
import HealthBar from './HealthBar.js'

import { convertFromGrid } from './helpers.js'
import { SCALE_FACTOR, GRID_WIDTH, GRID_HEIGHT, BLOCK_WIDTH, WIDTH, HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, UPDATE_WAIT, KEY_RIGHT, KEY_LEFT, KEY_UP, KEY_DOWN, GRID_COLOR, HEALTH_BAR_COORDS, HEALTH_BAR_SIZE, HEALTH_BAR_COLOR } from './constants.js'

function main (ctx, grid, player, opponents, bullets) {
  player.execute(grid)
  player.moveBullets(opponents)

  for (let id in bullets) {
    bullets[id].move()
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  drawOutline(ctx, player.generateDisplayCoords)
  drawGrid(ctx, grid, player.generateDisplayCoords)
  for (let id in bullets) {
    // console.log(id)
    // console.log(bullets[id])
    bullets[id].draw(ctx, player.generateDisplayCoords)
  }
  for (let id in opponents) {
    opponents[id].draw(ctx, player.generateDisplayCoords)
  }
  player.draw(ctx)
  player.healthBar.draw(ctx)
  // ctx.fillStyle = 'yellow'
  // ctx.fillRect(player.fakeCoords[0], player.fakeCoords[1], player.spriteManager.size[0], player.spriteManager.size[1])
  player.drawBullets(ctx)
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

let ctx, socket

document.addEventListener('finishCanvasInit', (event) => {
  // console.log('FINISH CTX EVENT')
  if (socket) {
    // console.log('START')
    init(ctx, socket)
  } else {
    document.addEventListener('finishSocketInit', (event) => {
      // console.log('DELAYED START')
      init(ctx, socket)
    })
  }
})

function init (ctx, socket) {
  let grid = JSON.parse(window.grid)
  let opponents = []
  let bullets = {}

  const spriteSheetImage = new Image()
  spriteSheetImage.src = 'media/spritesheet.png'

  spriteSheetImage.onload = () => {
    const spriteSheet = new SpriteSheet(spriteSheetImage)
    const playerSprite = spriteSheet.getSprite(12, 8, true)
    const bulletSprite = spriteSheet.getSprite(3, 4, true)
    const bulletStart = [10.5 * SCALE_FACTOR, 5 * SCALE_FACTOR]
    let player = new Player(
      convertFromGrid(JSON.parse(window.coords)),
      new SpriteManager(playerSprite),
      socket,
      bulletSprite,
      bulletStart,
      new HealthBar(HEALTH_BAR_COORDS, HEALTH_BAR_SIZE, HEALTH_BAR_COLOR),
      10
    )

    socket.emit('new', window.id, player.coords)

    socket.on('newBullet', (id, coords, rotation, velocity) => {
      bullets[id] = new Bullet(id, rotation, coords, velocity, new SpriteManager(bulletSprite))
    })

    socket.on('bulletCrash', (id) => {
      delete bullets[id]
    })

    socket.on('bulletHit', (id, playerId) => {
      console.log('HIT')
      delete bullets[id]
      if (playerId === window.id) {
        player.takeDamage()
      }
    })

    socket.on('player', (id, coords) => {
      opponents[id] = new Opponent(coords, new SpriteManager(playerSprite))
      console.log('RECEIVED PLAYER:', id)
      console.log('OPPONENTS', opponents)
    })

    socket.on('playerDeath', (playerId) => {
      console.log('DEATH')
      if (playerId in opponents) {
        delete opponents[playerId]
      }
    })


    socket.on('new', (id, coords) => {
      opponents[id] = new Opponent(coords, new SpriteManager(playerSprite))
      console.log('NEW PLAYER:', id)
      console.log('OPPONENTS', opponents)
      socket.emit('player', window.id, player.coords)
    })


    socket.on('close', (id) => {
      console.log('CLOSE', id)
      delete opponents[id]
    })


    socket.on('playerChange', (id, type, value) => {
      // console.log('OPPONENTS', opponents)
      // console.log('ACTION:', id)
      // console.log('CHANGE', type, value)
      if (id in opponents) {
        opponents[id].processChange(type, value)
      }
    })

    initInput(player)

    let updateTime = 0
    const update = (timestamp) => {
      if (timestamp - updateTime > UPDATE_WAIT) {
        main(ctx, grid, player, opponents, bullets)
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
  // console.log('INITINPUT')
  document.addEventListener('keydown', (event) => {
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
    }
  })

  document.addEventListener('keyup', (event) => {
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
    }
  })

  document.addEventListener('mousemove', (event) => {
    player.rotate(event.clientX, event.clientY)
  })

  document.addEventListener('mousedown', (event) => {
    player.shoot(event.clientX, event.clientY)
  })
}


export function setCanvas (canvas) {
  if (canvas) {
    // console.log('INITCANVAS')
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    ctx = canvas.getContext('2d')

    const event = new Event('finishCanvasInit')
    document.dispatchEvent(event)
  }
}

export function setSocket (socket_) {
  if (socket_) {
    // console.log('INITSOCKET')
    socket = socket_

    const event = new Event('finishSocketInit')
    document.dispatchEvent(event)
  }
}
