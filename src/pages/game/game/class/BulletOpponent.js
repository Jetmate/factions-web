import Bullet from './Bullet.js'

export default class BulletOpponent extends Bullet {
  constructor (id, coords, spriteManager, rotation, velocity) {
    super(id, coords, spriteManager, rotation)
    this.velocity = velocity
  }
}
