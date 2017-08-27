import { findCenter, withinBounds, generateId, checkCollision, hypotenuse, findAllGridCoords, convertFromGrid, opposite } from './helpers.js'
import { BLOCK_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, CENTER, BULLET_SPEED, PLAYER_SPEED } from './constants.js'
import Bullet from './Bullet.js'
import SpriteManager from './SpriteManager.js'

export default class Player {
  constructor (coords, spriteManager, socket, bulletSprite, bulletStart, healthBar, health) {
    this.spriteManager = spriteManager
    this.coords = findCenter(BLOCK_SIZE, this.spriteManager.size, coords)
    this.fakeCoords = findCenter([CANVAS_WIDTH, CANVAS_HEIGHT], this.spriteManager.size)
    this.fakeCoords[0] = this.fakeCoords[0] >> 0
    this.fakeCoords[1] = this.fakeCoords[1] >> 0
    this.movement = [0, 0]
    this.rotation = 0
    this.directions = {'RIGHT': false, 'LEFT': false, 'UP': false, 'DOWN': false}
    this.socket = socket
    this.bulletSprite = bulletSprite
    this.bullets = []
    this.bulletStartDiff = hypotenuse([bulletStart[0] - this.spriteManager.size[0] / 2, bulletStart[1] - this.spriteManager.size[1] / 2])
    this.healthBar = healthBar
    this.health = this.initialHealth = health
  }

  move (direction) {
    switch (direction) {
      case 'RIGHT': {
        this.movement[0] = PLAYER_SPEED
        this.directions['RIGHT'] = true
        break
      }
      case 'LEFT': {
        this.movement[0] = -PLAYER_SPEED
        this.directions['LEFT'] = true
        break
      }
      case 'UP': {
        this.movement[1] = -PLAYER_SPEED
        this.directions['UP'] = true
        break
      }
      case 'DOWN': {
        this.movement[1] = PLAYER_SPEED
        this.directions['DOWN'] = true
        break
      }
    }
  }

  unmove (direction) {
    switch (direction) {
      case 'RIGHT': {
        this.movement[0] = (this.directions['LEFT'] ? -PLAYER_SPEED : 0)
        this.directions['RIGHT'] = false
        break
      }
      case 'LEFT': {
        this.movement[0] = (this.directions['RIGHT'] ? PLAYER_SPEED : 0)
        this.directions['LEFT'] = false
        break
      }
      case 'UP': {
        this.movement[1] = (this.directions['DOWN'] ? PLAYER_SPEED : 0)
        this.directions['UP'] = false
        break
      }
      case 'DOWN': {
        this.movement[1] = (this.directions['UP'] ? -PLAYER_SPEED : 0)
        this.directions['DOWN'] = false
        break
      }
    }
  }

  rotate (cursorX, cursorY) {
    let cursorDiff = [cursorX - CENTER[0], cursorY - CENTER[1]]
    this.rotation = Math.atan(cursorDiff[1] / cursorDiff[0]) + -1.5708

    if (cursorDiff[0] < 0) {
      this.rotation += 3.14159
    }
    this.spriteManager.rotate(this.rotation)
    this.socket.emit('playerChange', window.id, 'rotation', this.rotation)
  }

  draw (ctx) {
    ctx.drawImage(this.spriteManager.currentSprite(), this.fakeCoords[0], this.fakeCoords[1])
  }

  generateDisplayCoords = (coords) => {
    return [
      coords[0] + this.fakeCoords[0] - this.coords[0] >> 0,
      coords[1] + this.fakeCoords[1] - this.coords[1] >> 0
    ]
  }

  processCollision (coords, size) {
    for (let i = 0; i < 2; i++) {
      if (this.velocity[i] !== 0) {
        let newCoords = this.coords.slice()
        newCoords[i] += this.velocity[i]
        if (checkCollision(newCoords, this.spriteManager.size, coords, size)) {
          this.alignVelocity(coords, size, i)
        }
      }
    }
  }

  alignVelocity (coords, size, i) {
    if (this.velocity[i] > 0) {
      this.velocity[i] = coords[i] - (this.coords[i] + this.spriteManager.size[i])
    } else {
      this.velocity[i] = (coords[i] + size[i]) - this.coords[i]
    }
  }

  execute (grid) {
    this.velocity = this.movement.slice()
    if (this.velocity[0] === 0 && this.velocity[1] === 0) {
      return
    }

    let allGridCoords = findAllGridCoords([this.coords[0] + this.velocity[0], this.coords[1] + this.velocity[1]], this.spriteManager.size)

    let collided = []
    for (let [x, y] of allGridCoords) {
      if (grid.grid[x][y] === 'block') {
        this.processCollision(convertFromGrid([x, y]), BLOCK_SIZE)
        collided.push(convertFromGrid([x, y]))
      }
    }

    if (!(this.velocity[0] === 0 && this.velocity[1] === 0)) {
      this.coords[0] += this.velocity[0]
      this.coords[1] += this.velocity[1]

      if (this.velocity[0] && this.velocity[1] && collided.length === 1) {
        if (checkCollision(this.coords, this.spriteManager.size, collided[0], BLOCK_SIZE)) {
          this.alignVelocity(collided[0], BLOCK_SIZE, 0)
          this.coords[0] += this.velocity[0]
        }
      }

      this.socket.emit('playerChange', window.id, 'coords', this.coords)
    }
  }

  shoot (cursorX, cursorY) {
    let bulletSpriteManager = new SpriteManager(this.bulletSprite)
    let offset = [
      Math.cos(this.rotation) * this.bulletStartDiff,
      Math.sin(this.rotation) * this.bulletStartDiff
    ]
    let difference = [
      (cursorX - bulletSpriteManager.sprite.width / 2) - (CENTER[0] + offset[0]),
      (cursorY - bulletSpriteManager.sprite.height / 2) - (CENTER[1] + offset[1])
    ]
    let scale = hypotenuse(difference) / BULLET_SPEED
    let center = [
      this.coords[0] + this.spriteManager.size[0] / 2,
      this.coords[1] + this.spriteManager.size[1] / 2
    ]
    let bullet = new Bullet(
      generateId(),
      this.rotation,
      [
        center[0] + offset[0] - bulletSpriteManager.size[0] / 2,
        center[1] + offset[1] - bulletSpriteManager.size[1] / 2
      ],
      [difference[0] / scale, difference[1] / scale],
      bulletSpriteManager
    )
    this.socket.emit('newBullet', bullet.id, bullet.coords, this.rotation, bullet.velocity)
    this.bullets.push(bullet)
  }

  moveBullets (grid, players) {
    let crashedBullets = []
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move()

      let allGridCoords = findAllGridCoords(this.bullets[i].coords, this.bullets[i].spriteManager.size)
      let crashed = false
      for (let [x, y] of allGridCoords) {
        if (grid.grid[x][y] === 'block') {

          this.socket.emit('bulletCrash', this.bullets[i].id)
          crashedBullets.push(i)
          crashed = true
          break
        }
      }

      if (!crashed) {
        for (let id in players) {
          if (checkCollision(players[id].coords, players[id].spriteManager.size, this.bullets[i].coords, this.bullets[i].spriteManager.size)) {

            this.socket.emit('bulletHit', this.bullets[i].id, id)
            crashedBullets.push(i)
            break
          }
        }
      }
    }

    for (let i = 0; i < crashedBullets.length; i++) {
      this.bullets.splice(crashedBullets[i], 1)
    }
  }

  drawBullets (ctx) {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(ctx, this.generateDisplayCoords)
    }
  }

  takeDamage () {
    this.health--
    if (this.health === 0) {
      this.socket.emit('playerDeath', window.id)
    }
    this.healthBar.changeHealth(this.health / this.initialHealth)
  }
}