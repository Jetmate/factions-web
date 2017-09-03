import { BULLET_BAR_GAP, BULLET_BAR_BULLET_OUTLINE, BULLET_BAR_BULLET_COLOR, SCALE_FACTOR } from '../../constants.js'

export default class BulletBar {
  constructor (size, index) {
    this.size = size
    this.index = index
  }

  setAmmoCapacity (ammoCapacity) {
    this.ammo = ammoCapacity
    this.bulletSprite = document.createElement('canvas')
    this.drawGap = (this.size[this.index] - SCALE_FACTOR * 2 + BULLET_BAR_GAP) / ammoCapacity
    if (this.index === 0) {
      this.bulletSprite.width = this.drawGap - BULLET_BAR_GAP
      this.bulletSprite.height = this.size[1] - SCALE_FACTOR * 2
    } else {
      this.bulletSprite.width = this.size[0] - SCALE_FACTOR * 2
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

  draw (ctx, coords = [0, 0]) {
    if (this.index === 0) {
      for (let i = 0; i < this.ammo; i++) {
        ctx.drawImage(this.bulletSprite, coords[0] + SCALE_FACTOR + i * this.drawGap, coords[1] + SCALE_FACTOR)
      }
    } else {
      for (let i = 0; i < this.ammo; i++) {
        ctx.drawImage(this.bulletSprite, coords[0] + SCALE_FACTOR, coords[1] + SCALE_FACTOR + i * this.drawGap)
      }
    }
  }
}
