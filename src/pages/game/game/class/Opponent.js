import { HEALTH_BAR2_OFFSET, HEALTH_BAR2_SIZE, PLAYER_HEALTH } from './constants.js'
import HealthBar from './HealthBar.js'
import Thing from './Thing.js'

export default class Opponent extends Thing {
  constructor (coords, spriteManager, health) {
    super(coords, spriteManager)

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
    if (this.health === 0) {
      return true
    }
    this.healthBar.changeHealth(this.health / this.initialHealth)
  }

  draw (ctx, coordsFunc) {
    let [x, y] = coordsFunc(this.coords)
    ctx.drawImage(this.spriteManager.currentSprite(), x, y)
    this.healthBar.draw(ctx, [x, y + HEALTH_BAR2_OFFSET])
  }
}
