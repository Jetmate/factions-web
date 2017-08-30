import { hypotenuse } from './helpers.js'

export default class Bullet {
  constructor (id, rotation, coords, difference, spriteManager, speed) {
    this.id = id
    this.rotation = rotation
    this.direction = rotation + 1.5708
    this.spriteManager = spriteManager
    this.spriteManager.rotate(rotation)
    this.coords = coords
    let scale = hypotenuse(difference) / speed
    this.velocity = [difference[0] / scale, difference[1] / scale]
  }

  move () {
    this.coords[0] += this.velocity[0]
    this.coords[1] += this.velocity[1]
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc(this.coords)
    ctx.drawImage(this.spriteManager.currentSprite(), x, y)
    // ctx.fillStyle = 'red'
    // ctx.fillRect(CENTER[0] - 5, CENTER[1] - 5, 10, 10)
    // ctx.fillStyle = 'blue'
    // ctx.fillRect(CENTER[0] - 5 + this.offset[0], CENTER[1] - 5 + this.offset[1], 10, 10)
  }
}
