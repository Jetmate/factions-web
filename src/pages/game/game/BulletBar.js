import { BULLET_BAR_GAP, BULLET_BAR_BULLET_OUTLINE, BULLET_BAR_BULLET_COLOR, SCALE_FACTOR } from './constants.js'
import Element from './Element.js'

export default class BulletBar extends Element {
  setGun (gun) {
    this.ammo = gun.ammo
    this.bulletSprite = document.createElement('canvas')
    this.drawWidth = (this.innerSize[0] - SCALE_FACTOR * 2 + BULLET_BAR_GAP) / gun.ammo
    this.bulletSprite.width = this.drawWidth - BULLET_BAR_GAP
    this.bulletSprite.height = this.innerSize[1] - SCALE_FACTOR * 2
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
    for (let i = 0; i < this.ammo; i++) {
      ctx.drawImage(this.bulletSprite, this.coords[0] + SCALE_FACTOR * 2 + i * this.drawWidth, this.coords[1] + SCALE_FACTOR * 2)
    }
  }
}
