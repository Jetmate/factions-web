import Thing from './Thing.js'

export default class Bullet extends Thing {
  constructor (coords, spriteManager, id, rotation) {
    super(coords, spriteManager)
    this.id = id
    this.spriteManager.rotate(rotation)
  }

  move () {
    this.coords[0] += this.velocity[0]
    this.coords[1] += this.velocity[1]
  }
}
