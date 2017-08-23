export default class Bullet {
  SPEED = 20

  constructor (id, rotation, coords, spriteManager) {
    this.id = id
    this.rotation = rotation
    this.direction = rotation + 1.5708
    this.spriteManager = spriteManager
    this.spriteManager.rotate(rotation)
    this.coords = coords
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
