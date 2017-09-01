import { BLOCK_WIDTH, WIDTH, HEIGHT } from './constants.js'

export function opposite (number) {
  return Math.abs(number - 1)
}

export function convertToGrid (x, y) {
  return [(x / BLOCK_WIDTH) >> 0, (y / BLOCK_WIDTH) >> 0]
}

export function findAllGridCoords (coords, size) {
  let allCoords = []

  let firstCoords = convertToGrid(coords[0], coords[1])
  allCoords.push(firstCoords)

  let xCoords = convertToGrid(coords[0] + size[0], coords[1])
  if (xCoords[0] !== firstCoords[0]) {
    allCoords.push(xCoords)
  }

  let yCoords = convertToGrid(coords[0], coords[1] + size[1])
  if (yCoords[1] !== firstCoords[1]) {
    allCoords.push(yCoords)
  }

  if (xCoords[0] !== firstCoords[0] && yCoords[1] !== firstCoords[1]) {
    allCoords.push(convertToGrid(coords[0] + size[0], coords[1] + size[1]))
  }

  return allCoords
}

export function convertFromGrid (coords) {
  return [coords[0] * BLOCK_WIDTH, coords[1] * BLOCK_WIDTH]
}

export function findCenter (size1, size2, coords) {
  if (coords) {
    return [
      (size1[0] / 2 - size2[0] / 2) + coords[0],
      (size1[1] / 2 - size2[1] / 2) + coords[1]
    ]
  }
  return [
    size1[0] / 2 - size2[0] / 2,
    size1[1] / 2 - size2[1] / 2
  ]
}

export function withinBounds (coords, size) {
  return (
    coords[0] >= 0 && coords[0] + size[0] <= WIDTH &&
    coords[1] >= 0 && coords[1] + size[1] <= HEIGHT
  )
}

export function randRange (upper) {
  return Math.floor(Math.random() * upper)
}

export function randomItem (array) {
  return array[randRange(array.length)]
}

const CHAR_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export function generateId (length = 5) {
  let result = []
  for (let i = 0; i < length; i++) {
    result.push(randomItem(CHAR_POOL))
  }
  return result.join('')
}

// export function checkCollision (thing1, thing2) {
//   return (thing1.coords[0] < thing2.coords[0] + thing2.spriteManager.size[0]) &&
//          (thing2.coords[0] < thing1.coords[0] + thing1.spriteManager.size[0]) &&
//          (thing1.coords[1] < thing2.coords[1] + thing2.spriteManager.size[1]) &&
//          (thing2.coords[1] < thing1.coords[1] + thing1.spriteManager.size[1])
// }

export function checkCollision (coords1, size1, coords2, size2) {
  return (coords1[0] < coords2[0] + size2[0]) &&
         (coords2[0] < coords1[0] + size1[0]) &&
         (coords1[1] < coords2[1] + size2[1]) &&
         (coords2[1] < coords1[1] + size1[1])
}

export function hypotenuse (coords) {
  return Math.sqrt(coords[0] ** 2 + coords[1] ** 2)
}

export function initCanvas (canvas, size) {
  canvas.width = size[0]
  canvas.height = size[1]
  canvas.oncontextmenu = (e) => {
    e.preventDefault()
  }
  return canvas.getContext('2d')
}
