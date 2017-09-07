function randRange (upper) {
  return Math.floor(Math.random() * upper)
}

class Grid {
  constructor (width, height, fillPercent, smoothRate, smoothCount, treePercent) {
    this.FILL_PERCENT = fillPercent
    this.TREE_PERCENT = treePercent
    this.SMOOTH_RATE = smoothRate
    this.SMOOTH_COUNT = smoothCount
    this.width = width
    this.height = height
    this.grid = this.generateGrid()

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width * BLOCK_WIDTH
    this.canvas.height = this.height * BLOCK_WIDTH
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.generateSprite()
  }

  generateSprite () {
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'black'
    let begin, end
    for (let x = 0; x <= this.width; x++) {
      begin = [x * BLOCK_WIDTH, 0]
      end = [x * BLOCK_WIDTH, this.canvas.height]
      this.ctx.moveTo(begin[0], begin[1])
      this.ctx.lineTo(end[0], end[1])
    }
    for (let y = 0; y <= this.height; y++) {
      begin = [0, y * BLOCK_WIDTH]
      end = [this.canvas.width, y * BLOCK_WIDTH]
      this.ctx.moveTo(begin[0], begin[1])
      this.ctx.lineTo(end[0], end[1])
    }
    this.ctx.stroke()
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        switch (this.grid[x][y]) {
          case 'block':
            this.ctx.fillStyle = 'black'
            break
          case 'tree':
            this.ctx.fillStyle = 'green'
            break
          default:
            continue
        }
        this.ctx.fillRect(x * BLOCK_WIDTH, y * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH)
      }
    }
  }

  draw (ctx, x, y) {
    ctx.drawImage(this.canvas, x, y)
  }

  generateGrid () {
    let grid = this.createGrid()
    this.populateGrid(grid, this.FILL_PERCENT, 'block')
    for (let i = 0; i < this.SMOOTH_COUNT; i++) {
      grid = this.smoothGrid(grid)
    }
    this.outlineGrid(grid)
    this.growTrees(grid)
    return grid
  }

  createGrid () {
    let grid = []

    for (let x = 0; x < this.width; x++) {
      grid[x] = []
      for (let y = 0; y < this.height; y++) {
        grid[x][y] = ''
      }
    }

    return grid
  }

  populateGrid (grid, chance, type) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (Math.random() < chance) {
          grid[x][y] = type
        }
      }
    }
  }


  growTrees (grid) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!grid[x][y] && Math.random() < this.TREE_PERCENT) {
          grid[x][y] = 'tree'
        }
      }
    }
  }


  outlineGrid (grid) {
    for (let x = 0; x < this.width; x++) {
      for (let y of [0, this.height - 1]) {
        grid[x][y] = 'block'
      }
    }

    for (let y = 0; y < this.height; y++) {
      for (let x of [0, this.width - 1]) {
        grid[x][y] = 'block'
      }
    }
  }


  smoothGrid (oldGrid) {
    let grid = this.createGrid()

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let surroundingCount = this.getSurroundingTiles(oldGrid, x, y)
        if (surroundingCount >= this.SMOOTH_RATE) {
          grid[x][y] = 'block'
        }
      }
    }

    return grid
  }

  getSurroundingTiles (grid, tileX, tileY) {
    let count = 0

    for (let x = tileX - 1; x <= tileX + 1; x++) {
      for (let y = tileY - 1; y <= tileY + 1; y++) {
        if (!(x === tileX && y === tileY)) {
          if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            if (grid[x][y] === 'block') {
              count++
            }
          }
        }
      }
    }
    // for (let offset of [[-1, 0], [0, 1], [0, -1], [1, 0]]) {
    //   if (offset[0] + tileX >= 0 && offset[0] + tileX < this.width && offset[1] + tileY >= 0 && offset[1] + tileY < this.height) {
    //     if (grid[offset[0] + tileX][offset[1] + tileY] === 'block') {
    //       count++
    //     }
    //   }
    // }

    return count
  }

  randomCoords () {
    return [randRange(this.width), randRange(this.height)]
  }
}


const BLOCK_WIDTH = 5
let grids = []


// const GRID_WIDTH = 50
// for (let fillPercent = 5; fillPercent < 50; fillPercent += 2) {
//   for (let smoothRate = 1; smoothRate < 5; smoothRate++) {
//     for (let smoothCount = 1; smoothCount < 8; smoothCount++) {
//       grids.push(new Grid(GRID_WIDTH, GRID_WIDTH, fillPercent, smoothRate, smoothCount))
//     }
//   }
// }

// const GRID_WIDTH = 100
// for (let [fillPercent, smoothRate, smoothCount] of [
//   [20, 3, 4],
//   [30, 4, 8],
//   [40, 4, 4],
//   [13, 3, 4],
//   [15, 3, 4],
//   [15, 3, 8],
//   [17, 3, 5],
//   [37, 4, 8],
//   [35, 4, 5],
//   [35, 4, 8],
//   [31, 4, 5],
//   [49, 5, 4],
//   [14, 3, 5],
//   [16, 3, 4],
//   [14, 3, 8],
//   [15, 3, 8],
//   [16, 3, 8],
//   [17, 3, 5],
//   [20, 3, 5],
//   [20, 3, 7],
//   [10, 3, 6],
//   [12, 3, 4],
//   [29, 4, 5],
//   [31, 4, 4],
//   [31, 4, 6]
// ]) {
//   grids.push(new Grid(GRID_WIDTH, GRID_WIDTH, fillPercent, smoothRate, smoothCount))
// }

// const GRID_WIDTH = 500
// for (let [fillPercent, smoothRate, smoothCount] of [
//   [14, 3, 8],
//   [20, 3, 4],
//   [17, 3, 5],
//   [35, 4, 8],
//   [49, 5, 4],
//   [30, 4, 8],
//   [31, 4, 5],
//   [14, 3, 5]
// ]) {
//   grids.push(new Grid(GRID_WIDTH, GRID_WIDTH, fillPercent, smoothRate, smoothCount))
// }

// const GRID_WIDTH = 120
// for (let [fillPercent, smoothRate, smoothCount] of [
//   [49, 5, 4],
//   [14, 3, 5],
//   [20, 3, 4]
// ]) {
//   for (let i1 = -1; i1 <= 1; i1++) {
//     for (let i2 = -1; i2 <= 1; i2++) {
//       for (let i3 = -1; i3 <= 1; i3++) {
//         grids.push(new Grid(GRID_WIDTH, GRID_WIDTH, fillPercent + i1, smoothRate + i2, smoothCount + i3))
//       }
//     }
//   }
// }

  // const GRID_WIDTH = 120
  // for (let [fillPercent, smoothRate, smoothCount] of [
  //   [9, 3, 1],
  //   [19, 4, 2],
  //   [25, 4, 3]
  // ]) {
  //   for (let i1 = -1; i1 <= 1; i1++) {
  //     for (let i2 = -1; i2 <= 1; i2++) {
  //       for (let i3 = -1; i3 <= 1; i3++) {
  //         grids.push(new Grid(GRID_WIDTH, GRID_WIDTH, fillPercent + i1, smoothRate + i2, smoothCount + i3))
  //       }
  //     }
  //   }
  // }

// let grids = []
// for (let fillPercent = 5; fillPercent < 50; fillPercent += 1) {
//   for (let smoothRate of [3, 4, 5]) {
//     for (let smoothCount of [3, 4, 5, 8]) {
//       grids.push(new Grid(GRID_WIDTH, GRID_WIDTH, fillPercent, smoothRate, smoothCount))
//     }
//   }
// }


const GRID_WIDTH = 50
for (let [fillPercent, smoothRate, smoothCount] of [
  [.24, 4, 3],
  [.49, 5, 4],
  [.15, 3, 5],
  [.20, 3, 4]
]) {
  for (let i1 = .0001; i1 <= .01; i1 += .0002) {
    grids.push(new Grid(GRID_WIDTH, GRID_WIDTH, fillPercent, smoothRate, smoothCount, i1))
  }
}


const GRID_GAP = 20
const TOTAL_WIDTH = GRID_WIDTH * BLOCK_WIDTH + GRID_GAP
const ROW_COUNT = Math.floor(window.innerWidth / TOTAL_WIDTH)



const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = grids.length / ROW_COUNT * TOTAL_WIDTH
const ctx = canvas.getContext('2d')
// ctx.scale(10, 10)
ctx.imageSmoothingEnabled = false
ctx.font = '10px sans-serif'

let currentIndex = 0
let y = 0
let end = false
while (true) {
  for (let x = 0; x < ROW_COUNT; x++) {
    ctx.fillText(
      `${grids[currentIndex].FILL_PERCENT} ${grids[currentIndex].SMOOTH_RATE} ${grids[currentIndex].SMOOTH_COUNT} ${grids[currentIndex].TREE_PERCENT}`,
      x * TOTAL_WIDTH,
      y * TOTAL_WIDTH + GRID_GAP * 2
    )
    grids[currentIndex].draw(ctx, x * TOTAL_WIDTH, y * TOTAL_WIDTH + GRID_GAP * 2)
    currentIndex++
    // console.log(currentIndex, grids.length)
    if (currentIndex === grids.length) {
      end = true
      break
    }
  }
  if (end) {
    break
  }
  y++
}
