import SpriteSheet from './SpriteSheet.js'
import SpriteManager from './SpriteManager.js'
import Player from './Player.js'
import Opponent from './Opponent.js'
import Bullet from './Bullet.js'
import Grid from './Grid.js'
import Gui from './Gui.js'
import HealthBar from './HealthBar.js'
import MiniMap from './MiniMap.js'
import BulletBar from './BulletBar.js'

import { rifle } from './guns.js'

import { convertFromGrid } from './helpers.js'
import { SCALE_FACTOR, CANVAS_WIDTH, CANVAS_HEIGHT, UPDATE_WAIT, KEY_RIGHT, KEY_LEFT, KEY_UP, KEY_DOWN, PLAYER_HEALTH, BLOCK_COLOR, HEALTH_BAR_SIZE, ELEMENT_OFFSET, MINIMAP_SIZE, BULLET_BAR_SIZE } from './constants.js'

function main (ctx, grid, player, opponents, bullets, gui) {
  player.execute(grid)
  player.moveBullets(grid, opponents)

  for (let id in bullets) {
    bullets[id].move()
  }

  ctx.fillStyle = BLOCK_COLOR
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  grid.draw(ctx, player.generateDisplayCoords)
  for (let id in bullets) {
    // console.log(id)
    // console.log(bullets[id])
    bullets[id].draw(ctx, player.generateDisplayCoords)
  }
  player.drawBullets(ctx)
  for (let id in opponents) {
    opponents[id].draw(ctx, player.generateDisplayCoords)
  }
  player.draw(ctx, grid)
  gui.drawElements(ctx)
  // ctx.fillStyle = 'yellow'
  // ctx.fillRect(player.fakeCoords[0], player.fakeCoords[1], player.spriteManager.size[0], player.spriteManager.size[1])
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
  const spriteSheetImage = new Image()
  spriteSheetImage.src = 'media/spritesheet.png'

  spriteSheetImage.onload = () => {
    const spriteSheet = new SpriteSheet(spriteSheetImage)
    const playerSprite = spriteSheet.getSprite(12, 8, true)
    const bulletStart = [10.5 * SCALE_FACTOR, 5 * SCALE_FACTOR]
    const bulletSprite = spriteSheet.getSprite(3, 4, true)
    const blockSprite = spriteSheet.getSprite(16, 16, true)

    let gui = new Gui()
    let healthBar = gui.addElement(new HealthBar(HEALTH_BAR_SIZE, 1), ELEMENT_OFFSET, 0)
    let bulletBar = gui.addElement(new BulletBar(BULLET_BAR_SIZE), ELEMENT_OFFSET, 0)
    let miniMap = gui.addElement(new MiniMap(MINIMAP_SIZE), ELEMENT_OFFSET, 1)
    console.log(bulletBar.coords)

    let player = new Player(
      convertFromGrid(JSON.parse(window.coords)),
      new SpriteManager(playerSprite),
      socket,
      bulletSprite,
      bulletStart,
      PLAYER_HEALTH,
      rifle,
      healthBar,
      miniMap,
      bulletBar
    )


    socket.emit('new', window.id, player.coords)


    let grid = new Grid(JSON.parse(window.grid), blockSprite)
    let opponents = {}
    let bullets = {}


    socket.on('newBullet', (id, coords, rotation, velocity) => {
      bullets[id] = new Bullet(id, rotation, coords, velocity, new SpriteManager(bulletSprite))
    })

    socket.on('bulletCrash', (id) => {
      delete bullets[id]
    })

    socket.on('bulletHit', (id, playerId) => {
      // console.log('HIT')
      delete bullets[id]
      if (playerId === window.id) {
        player.takeDamage()
      } else if (playerId in opponents) {
        opponents[playerId].takeDamage()
      }
    })

    socket.on('player', (id, coords, health) => {
      opponents[id] = new Opponent(coords, new SpriteManager(playerSprite), health)
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
      opponents[id] = new Opponent(coords, new SpriteManager(playerSprite), PLAYER_HEALTH)
      console.log('NEW PLAYER:', id)
      console.log('OPPONENTS', opponents)
      if (player.health > 0) {
        socket.emit('player', window.id, player.coords, player.health)
      }
    })


    socket.on('close', (id) => {
      console.log('CLOSE', id)
      delete opponents[id]
    })


    socket.on('playerChange', (id, type, value) => {
      // console.log('OPPONENTS', opponents)
      // console.log('ACTION:', id)
      // console.log('CHANGE', type, value)
      // console.log(opponents)
      if (id in opponents) {
        opponents[id].processChange(type, value)
      }
    })

    initInput(player)

    let updateTime = 0
    const update = (timestamp) => {
      if (timestamp - updateTime > UPDATE_WAIT) {
        main(ctx, grid, player, opponents, bullets, gui)
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

  document.onvisibilitychange = (event) => {
    console.log('changed')
  }

  document.addEventListener('visibilitychange', (event) => {
    if (document.hidden) {
      player.reset()
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
    canvas.oncontextmenu = (e) => {
      e.preventDefault()
    }
    // window.addEventListener('resize', (e) => {
    //   canvas.width = window.innerWidth
    //   canvas.height = window.innerHeight
    //   console.log(e)
    // })

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
