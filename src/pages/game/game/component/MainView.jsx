import React from 'react'

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
// import Leaderboard from './Leaderboard.js'

import { rifle } from './guns.js'

import { convertFromGrid } from './helpers.js'
import { SCALE_FACTOR, CANVAS_WIDTH, CANVAS_HEIGHT, UPDATE_WAIT, KEY_RIGHT, KEY_LEFT, KEY_UP, KEY_DOWN, PLAYER_HEALTH, BLOCK_COLOR, HEALTH_BAR_SIZE, ELEMENT_OFFSET, MINIMAP_SIZE, BULLET_BAR_SIZE, LEADERBOARD_SIZE, FONT } from './constants.js'


export default class Component extends React.Component {
  render () {
    return (
      <canvas ref={this.initCanvas}>Looks like your browser does not support the JS canvas. yikes.</canvas>
    )
  }

  initCanvas (canvas) {
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    canvas.oncontextmenu = (e) => {
      e.preventDefault()
    }
    let ctx = canvas.getContext('2d')
    ctx.font = FONT
    init(ctx, this.props.socket)
  }
}


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
    let bulletBar = gui.addElement(new BulletBar(BULLET_BAR_SIZE, 1), ELEMENT_OFFSET, 0)
    let miniMap = gui.addElement(new MiniMap(MINIMAP_SIZE), ELEMENT_OFFSET, 0)
    // let leaderboard = gui.addElement(new Leaderboard(LEADERBOARD_SIZE), ELEMENT_OFFSET, 1)

    let player = new Player(
      ctx.canvas.style,
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

    initSocket(socket, player, opponents, bullets)
    initInput(player)


    let currentTime = 0
    const update = (timestamp) => {
      let frameTime = timestamp - currentTime

      if (frameTime >= UPDATE_WAIT) {
        currentTime = timestamp
        let accumulator = frameTime

        while (accumulator >= UPDATE_WAIT) {
          main(grid, player, opponents, bullets)
          accumulator -= UPDATE_WAIT
        }

        draw(ctx, grid, player, opponents, bullets)
      }
      window.requestAnimationFrame(update)
    }
    window.requestAnimationFrame(update)
  }
}

function initSocket(socket, player, opponents, bullets) {
  socket.on('newBullet', (id, coords, rotation, velocity) => {
    bullets[id] = new Bullet(id, coords, new SpriteManager(bulletSprite), rotation, velocity)
  })

  socket.on('bulletCrash', (id) => {
    delete bullets[id]
  })

  socket.on('bulletHit', (bulletId, playerId) => {
    delete bullets[bulletId]
    if (playerId === window.id) {
      player.takeDamage()
    } else if (playerId in opponents) {
      opponents[playerId].takeDamage()
    }
  })


  socket.on('newPlayer', (id, coords) => {
    opponents[id] = new Opponent(coords, new SpriteManager(playerSprite), PLAYER_HEALTH)

    // console.log('NEW PLAYER:', id)
    // console.log('OPPONENTS', opponents)

    if (player.health > 0) {
      socket.emit('player', window.id, player.coords, player.health)
    }
  })

  socket.on('player', (id, coords, health) => {
    opponents[id] = new Opponent(coords, new SpriteManager(playerSprite), health)

    // console.log('RECEIVED PLAYER:', id)
    // console.log('OPPONENTS', opponents)
  })

  socket.on('playerDeath', (playerId, killerId) => {
    if (playerId in opponents) {
      delete opponents[playerId]
    }

    // console.log('DEATH')
  })

  socket.on('playerChange', (id, type, value) => {
    if (id in opponents) {
      opponents[id].processChange(type, value)
    }
  })

  socket.on('close', (id) => {
    delete opponents[id]
  })
}

function initInput (player) {
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

function main (grid, player, opponents, bullets) {
  player.execute(grid)
  player.moveBullets(grid, opponents)
  for (let id in bullets) {
    bullets[id].move()
    // console.log(bullets[id].coords)
  }
}

function draw (ctx, grid, player, opponents, bullets) {
  ctx.fillStyle = BLOCK_COLOR
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  grid.draw(ctx, player.generateDisplayCoords)
  for (let id in bullets) {
    bullets[id].draw(ctx, player.generateDisplayCoords)
  }
  player.drawBullets(ctx)
  for (let id in opponents) {
    opponents[id].draw(ctx, player.generateDisplayCoords)
  }

  player.draw(ctx, grid)
}
