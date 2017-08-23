export default class Bullet {
  SPEED = 6

  constructor (id, rotation, coords, spriteManager) {
    this.id = id
    this.rotation = rotation
    this.direction = rotation + 1.5708
    this.coords = coords
    this.spriteManager = spriteManager
    this.spriteManager.rotate(rotation)
  }

  move () {
    this.coords[0] += Math.cos(this.direction) * this.SPEED
    this.coords[1] += Math.sin(this.direction) * this.SPEED
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc(this.coords)
    ctx.drawImage(this.spriteManager.currentSprite(), x, y)
  }
}
