import { BULLET_BAR_GAP, BULLET_BAR_BULLET_OUTLINE, BULLET_BAR_BULLET_COLOR } from '../../constants.js'

export default class BulletBar {
  constructor (size, index) {
    this.size = size
    this.index = index
  }

  setAmmoCapacity (ammoCapacity) {
    this.ammo = ammoCapacity
    this.bulletSprite = document.createElement('canvas')
    this.drawGap = (this.size[this.index] + BULLET_BAR_GAP) / ammoCapacity
    if (this.index === 0) {
      this.bulletSprite.width = this.drawGap - BULLET_BAR_GAP
      this.bulletSprite.height = this.size[1]
    } else {
      this.bulletSprite.width = this.size[0]
      this.bulletSprite.height = this.drawGap - BULLET_BAR_GAP
    }

    let ctx = this.bulletSprite.getContext('2d')
    ctx.fillStyle = BULLET_BAR_BULLET_OUTLINE
    ctx.fillRect(0, 0, this.bulletSprite.width, this.bulletSprite.height)
    ctx.fillStyle = BULLET_BAR_BULLET_COLOR
    ctx.fillRect(0, 0, this.bulletSprite.width, this.bulletSprite.height)
  }

  changeAmmo (newAmmo) {
    this.ammo = newAmmo
  }

  draw (ctx, coords = [0, 0]) {
    if (this.index === 0) {
      for (let i = 0; i < this.ammo; i++) {
        ctx.drawImage(this.bulletSprite, coords[0] + i * this.drawGap, coords[1])
      }
    } else {
      for (let i = 0; i < this.ammo; i++) {
        ctx.drawImage(this.bulletSprite, coords[0], coords[1] + i * this.drawGap)
      }
    }
  }
}
