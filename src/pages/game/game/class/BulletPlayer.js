import Bullet from './Bullet.js'

import { hypotenuse } from '../helpers.js'

export default class BulletPlayer extends Bullet {
  constructor (coords, spriteManager, id, rotation, difference, speed) {
    super(coords, spriteManager, id, rotation)
    let scale = hypotenuse(difference) / speed
    this.velocity = [difference[0] / scale, difference[1] / scale]
  }
}
