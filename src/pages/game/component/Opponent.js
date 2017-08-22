export default class Opponent {
  constructor (coords, spriteManager) {
    this.spriteManager = spriteManager
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
    ctx.drawImage(this.spriteManager.currentSprite(), x, y)
  }
}
