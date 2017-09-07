import { SCALE_FACTOR, OPPONENT_HEALTH_BAR_OFFSET, OPPONENT_TEXT_OFFSET, OPPONENT_HEALTH_BAR_SIZE, PLAYER_HEALTH, OPPONENT_BACKGROUND_SIZE, OPPONENT_BACKGROUND_OFFSET, FONT } from '../constants.js'
import HealthBar from './gui/HealthBar.js'
import Thing from './Thing.js'
import Background from './gui/Background.js'
import { findCenter } from '../helpers.js'

export default class Opponent extends Thing {
  constructor (coords, spriteManager, id, health) {
    super(coords, spriteManager)

    this.health = health
    this.initialHealth = PLAYER_HEALTH
    this.healthBar = new HealthBar(OPPONENT_HEALTH_BAR_SIZE, 0)
    this.healthBar.changeHealth(this.health / this.initialHealth)
    this.background = new Background(OPPONENT_BACKGROUND_SIZE)
    let ctx = this.background.ctx
    ctx.font = FONT
    ctx.fillStyle= 'black'
    ctx.fillText(id, findCenter(OPPONENT_BACKGROUND_SIZE, [ctx.measureText(id).width, 0])[0] + SCALE_FACTOR, OPPONENT_TEXT_OFFSET)
    ctx.drawImage((new Background(OPPONENT_HEALTH_BAR_SIZE)).sprite, 0, OPPONENT_BACKGROUND_SIZE[1] -OPPONENT_HEALTH_BAR_SIZE[1])

    this.backgroundXOffset = findCenter(this.size, OPPONENT_BACKGROUND_SIZE)[0]
    this.healthBarXOffset = findCenter(this.size, OPPONENT_HEALTH_BAR_SIZE)[0] + SCALE_FACTOR
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
    ctx.drawImage(this.background.sprite, x + this.backgroundXOffset, y + OPPONENT_BACKGROUND_OFFSET)
    this.healthBar.draw(ctx, [x + this.healthBarXOffset, y + OPPONENT_HEALTH_BAR_OFFSET])
  }
}
