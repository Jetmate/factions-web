import Bullet from './Bullet.js'

export default class BulletOpponent extends Bullet {
  constructor (coords, spriteManager, id, rotation, velocity) {
    super(coords, spriteManager, id, rotation)
    this.velocity = velocity
  }
}
