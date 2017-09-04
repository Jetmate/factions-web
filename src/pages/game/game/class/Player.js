import { findCenter, generateId, checkCollision, hypotenuse, findAllGridCoords, convertFromGrid } from '../helpers.js'
import { BLOCK_SIZE, PLAYER_SPEED, DIAGONAL_PLAYER_SPEED, CURSOR_AIMING, CURSOR_RELOADING } from '../constants.js'
import SpriteManager from './SpriteManagerRotation.js'
import { changeCoords, setAmmoCapacity, changeHealth, changeAmmo } from '../../../../redux/actions.js'

export default class Player {
  constructor (coords, spriteManager, reduxDispatch, socket, bulletSprite, bulletStart, health, currentGun) {
    this.spriteManager = spriteManager
    this.size = [this.spriteManager.canvas.width, this.spriteManager.canvas.height]
    document.body.style.cursor = CURSOR_AIMING
    this.coords = findCenter(BLOCK_SIZE, this.size, coords)
    this.fakeCoords = findCenter([window.innerWidth, window.innerHeight], this.size)
    window.addEventListener('resize', () => {
      this.fakeCoords = findCenter([window.innerWidth, window.innerHeight], this.size)
    })
    this.fakeCoords[0] = this.fakeCoords[0] >> 0
    this.fakeCoords[1] = this.fakeCoords[1] >> 0
    this.rotation = 0
    this.reset()
    this.socket = socket
    this.reduxDispatch = reduxDispatch
    this.bulletSprite = bulletSprite
    this.bullets = []
    this.bulletStartDiff = hypotenuse([bulletStart[0] - this.size[0] / 2, bulletStart[1] - this.size[1] / 2])
    this.health = this.initialHealth = health
    this.currentGun = currentGun
    this.ammo = currentGun.ammo

    reduxDispatch(changeCoords(this.coords))
    reduxDispatch(setAmmoCapacity(this.currentGun.ammo))
    reduxDispatch(changeHealth(this.health))
  }

  move (direction) {
    switch (direction) {
      case 'RIGHT': {
        this.movement[0] = 1
        this.directions['RIGHT'] = true
        break
      }
      case 'LEFT': {
        this.movement[0] = -1
        this.directions['LEFT'] = true
        break
      }
      case 'UP': {
        this.movement[1] = -1
        this.directions['UP'] = true
        break
      }
      case 'DOWN': {
        this.movement[1] = 1
        this.directions['DOWN'] = true
        break
      }
    }
  }

  unmove (direction) {
    switch (direction) {
      case 'RIGHT': {
        this.movement[0] = (this.directions['LEFT'] ? -1 : 0)
        this.directions['RIGHT'] = false
        break
      }
      case 'LEFT': {
        this.movement[0] = (this.directions['RIGHT'] ? 1 : 0)
        this.directions['LEFT'] = false
        break
      }
      case 'UP': {
        this.movement[1] = (this.directions['DOWN'] ? 1 : 0)
        this.directions['UP'] = false
        break
      }
      case 'DOWN': {
        this.movement[1] = (this.directions['UP'] ? -1 : 0)
        this.directions['DOWN'] = false
        break
      }
    }
  }

  reset () {
    this.movement = [0, 0]
    this.directions = {'RIGHT': false, 'LEFT': false, 'UP': false, 'DOWN': false}
  }

  rotate (cursorX, cursorY) {
    let cursorDiff = [cursorX - window.innerWidth / 2, cursorY - window.innerHeight / 2]
    this.rotation = Math.atan(cursorDiff[1] / cursorDiff[0]) + -1.5708

    if (cursorDiff[0] < 0) {
      this.rotation += 3.14159
    }
    this.spriteManager.rotate(this.rotation)
    this.socket.emit('playerChange', window.id, 'rotation', this.rotation)
  }

  draw (ctx, grid) {
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
        if (checkCollision(newCoords, this.size, coords, size)) {
          this.alignVelocity(coords, size, i)
        }
      }
    }
  }

  alignVelocity (coords, size, i) {
    if (this.velocity[i] > 0) {
      this.velocity[i] = coords[i] - (this.coords[i] + this.size[i])
    } else {
      this.velocity[i] = (coords[i] + size[i]) - this.coords[i]
    }
  }

  execute (grid) {
    if (!this.movement[0] && !this.movement[1]) {
      return
    } else if (this.movement[0] && this.movement[1]) {
      this.velocity = [this.movement[0] * DIAGONAL_PLAYER_SPEED, this.movement[1] * DIAGONAL_PLAYER_SPEED]
    } else {
      this.velocity = [this.movement[0] * PLAYER_SPEED, this.movement[1] * PLAYER_SPEED]
    }

    let allGridCoords = findAllGridCoords([this.coords[0] + this.velocity[0], this.coords[1] + this.velocity[1]], this.size)

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
        if (checkCollision(this.coords, this.size, collided[0], BLOCK_SIZE)) {
          this.alignVelocity(collided[0], BLOCK_SIZE, 0)
          this.coords[0] += this.velocity[0]
        }
      }

      this.socket.emit('playerChange', window.id, 'coords', this.coords)
      this.reduxDispatch(changeCoords(this.coords))
    }
  }

  shoot (cursorX, cursorY) {
    if (this.ammo && !this.reloading) {
      let bulletSpriteManager = new SpriteManager(this.bulletSprite)
      let offset = [
        Math.cos(this.rotation) * this.bulletStartDiff,
        Math.sin(this.rotation) * this.bulletStartDiff
      ]
      let difference = [
        (cursorX - this.bulletSprite.width / 2) - (window.innerWidth / 2 + offset[0]),
        (cursorY - this.bulletSprite.height / 2) - (window.innerHeight / 2 + offset[1])
      ]
      let center = [
        this.coords[0] + this.size[0] / 2,
        this.coords[1] + this.size[1] / 2
      ]
      let bullet = new this.currentGun.Bullet(
        [
          center[0] + offset[0] - bulletSpriteManager.canvas.width / 2,
          center[1] + offset[1] - bulletSpriteManager.canvas.height / 2
        ],
        bulletSpriteManager,
        generateId(),
        this.rotation,
        difference,
        this.currentGun.speed
      )
      this.bullets.push(bullet)
      this.ammo--
      this.reduxDispatch(changeAmmo(this.ammo))
      this.socket.emit('newBullet', bullet.coords, bullet.id, this.rotation, bullet.velocity)
    } else if (!this.reloading) {
      this.reload()
    }
  }

  reload () {
    this.reloading = true
    document.body.style.cursor = CURSOR_RELOADING[0]
    let cursorFrame = 0
    let interval = window.setInterval(() => {
      if (cursorFrame === CURSOR_RELOADING.length) {
        window.clearInterval(interval)
        this.ammo = this.currentGun.ammo
        this.reduxDispatch(changeAmmo(this.ammo))
        document.body.style.cursor = CURSOR_AIMING
        this.reloading = false
      } else {
        cursorFrame++
        document.body.style.cursor = CURSOR_RELOADING[cursorFrame]
      }
    }, this.currentGun.reloadTime / CURSOR_RELOADING.length)
  }

  moveBullets (grid, players) {
    let crashedBullets = []
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move()

      let allGridCoords = findAllGridCoords(this.bullets[i].coords, this.bullets[i].size)
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
          if (checkCollision(players[id].coords, players[id].size, this.bullets[i].coords, this.bullets[i].size)) {
            this.socket.emit('bulletHit', this.bullets[i].id, id)
            if (players[id].takeDamage()) {
              this.socket.emit('playerDeath', id, window.id)
            }
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
    this.reduxDispatch(changeHealth(this.health / this.initialHealth))
  }
}
