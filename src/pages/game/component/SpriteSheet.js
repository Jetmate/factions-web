class SpriteSheet {
  constructor (spriteImage) {
    const canvas = document.createElement('canvas')
    canvas.width = spriteImage.width
    canvas.height = spriteImage.height
    this.width = spriteImage.width
    this.height = spriteImage.height
    this.sheet = canvas.getContext('2d')
    this.sheet.drawImage(spriteImage, 0, 0)
    this.farthestY = 0
  }

  getRawSprite (x, w, h) {
    let imageData = this.sheet.getImageData(x, this.farthestY, w, h)
    let sprite = document.createElement('canvas')
    sprite.width = w
    sprite.height = h
    sprite.getContext('2d').putImageData(imageData, 0, 0)
    return sprite
  }

  getSprite (w, h, noArray) {
    if (w === undefined) {
      w = this.width
      h = this.height
    }

    let sprite = this.getRawSprite(0, w, h)
    this.farthestY += h

    if (noArray) {
      return sprite
    }
    return [sprite]
  }

  getSprites (sizes) {
    let sprites = {}
    let x = 0
    let max_h = 0
    
    for (let [w, h] of sizes) {
      sprites.push(this.get_raw_sprite(x, w, h))
      x += w
      if (h > max_h) {
        max_h = h
      }
    }

    this.farthest_y += max_h
    return sprites
  }

  getSimilarSprites (sizes, constant, index) {
    let sprites = {}
    let x = 0
    let max_h = 0
    
    for (let dimension of sizes) {
      let w, h
      if (constant === 'w') {
        w = constant
        h = dimension
      } else {
        h = constant
        w = dimension
      }

      sprites.push(this.get_raw_sprite(x, w, h))
      x += w
      if (h > max_h) {
        max_h = h
      }
    }

    this.farthest_y += max_h
    return sprites
  }

  getEqualSprites(w, h, constant) {
    let sprites = {}
    let x = 0
    for (let i = 0; i < constant; i++) {
      sprites.push(this.getRawSprite(x, w, h))
      x = x + w
    }

    this.farthest_y += h
    return sprites
  }
}

export default SpriteSheet
