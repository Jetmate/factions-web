export default class Thing {
  constructor (coords, spriteManager) {
    this.coords = coords
    this.spriteManager = spriteManager
    this.size = [this.spriteManager.canvas.width, this.spriteManager.canvas.height]
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc(this.coords)
    ctx.drawImage(this.spriteManager.currentSprite(), x, y)
  }
}
