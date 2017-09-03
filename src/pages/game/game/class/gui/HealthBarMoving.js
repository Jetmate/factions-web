import { SCALE_FACTOR } from '../../constants.js'
import HealthBar from './HealthBar.js'
import Background from './Background.js'

export default class HealthBarMoving extends HealthBar {
  background = new Background(this.size)

  draw (ctx, coords) {
    ctx.drawImage(this.background.sprite, coords[0] - SCALE_FACTOR, coords[1] - SCALE_FACTOR)
    super.draw(ctx, coords)
  }
}
