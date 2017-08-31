import { BULLET_BAR_GAP, BULLET_BAR_BULLET_OUTLINE, BULLET_BAR_BULLET_COLOR, SCALE_FACTOR } from './constants.js'
import Element from './Element.js'

export default class BulletBar extends Element {
  constructor (initialSize, index) {
    super(initialSize)
    this.index = index
  }

  setGun (gun) {
    this.ammo = gun.ammo
    this.bulletSprite = document.createElement('canvas')
    this.drawGap = (this.innerSize[this.index] - SCALE_FACTOR * 2 + BULLET_BAR_GAP) / gun.ammo
    if (this.index === 0) {
      this.bulletSprite.width = this.drawGap - BULLET_BAR_GAP
      this.bulletSprite.height = this.innerSize[1] - SCALE_FACTOR * 2
    } else {
      this.bulletSprite.width = this.innerSize[0] - SCALE_FACTOR * 2
      this.bulletSprite.height = this.drawGap - BULLET_BAR_GAP
    }

    let ctx = this.bulletSprite.getContext('2d')
    ctx.fillStyle = BULLET_BAR_BULLET_OUTLINE
    ctx.fillRect(0, 0, this.bulletSprite.width, this.bulletSprite.height)
    ctx.fillStyle = BULLET_BAR_BULLET_COLOR
    ctx.fillRect(SCALE_FACTOR, SCALE_FACTOR, this.bulletSprite.width - SCALE_FACTOR * 2, this.bulletSprite.height - SCALE_FACTOR * 2)
  }

  changeAmmo (newAmmo) {
    this.ammo = newAmmo
  }

  draw (ctx) {
    ctx.drawImage(this.sprite, this.coords[0], this.coords[1])
    if (this.index === 0) {
      for (let i = 0; i < this.ammo; i++) {
        ctx.drawImage(this.bulletSprite, this.coords[0] + SCALE_FACTOR * 2 + i * this.drawGap, this.coords[1] + SCALE_FACTOR * 2)
      }
    } else {
      for (let i = 0; i < this.ammo; i++) {
        ctx.drawImage(this.bulletSprite, this.coords[0] + SCALE_FACTOR * 2, this.coords[1] + SCALE_FACTOR * 2 + i * this.drawGap)
      }
    }
  }
}
