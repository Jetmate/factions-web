import { HEALTH_BAR2_OFFSET, HEALTH_BAR2_SIZE, PLAYER_HEALTH } from './constants.js'
import HealthBar from './HealthBar.js'

export default class Opponent {
  constructor (coords, spriteManager, health) {
    this.spriteManager = spriteManager
    this.coords = coords
    this.health = health
    this.initialHealth = PLAYER_HEALTH
    this.healthBar = new HealthBar(HEALTH_BAR2_SIZE, 0)
    this.healthBar.changeHealth(this.health / this.initialHealth)
  }

  processChange (changeType, value) {
    switch (changeType) {
      case 'coords': {
        this.coords = value
        break
      }
      case 'rotation': {
        this.spriteManager.rotate(value)
        break
      }
    }
  }

  takeDamage () {
    this.health--
    this.healthBar.changeHealth(this.health / this.initialHealth)
    console.log(this.health / this.initialHealth)
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc(this.coords)
    ctx.drawImage(this.spriteManager.currentSprite(), x, y)
    this.healthBar.draw(ctx, [x, y + HEALTH_BAR2_OFFSET])
  }
}
