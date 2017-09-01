import Bullet from './Bullet.js'

import { hypotenuse } from './helpers.js'

export default class BulletPlayer extends Bullet {
  constructor (id, coords, spriteManager, rotation, difference, speed) {
    super(id, coords, spriteManager, rotation)
    let scale = hypotenuse(difference) / speed
    this.velocity = [difference[0] / scale, difference[1] / scale]
  }
}
