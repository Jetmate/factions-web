import helmet from 'helmet'
// import compression from 'compression'
import express from 'express'
// import http from 'http'
import socketio from 'socket.io'
import handlebars from 'hbs'
import session from 'express-session'
import bodyParser from 'body-parser'

function p (...items) {
  (items).forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          console.log(`${key}: ${item[key]}`)
        }
      }
    } else if (typeof item === 'undefined') {
      console.log('UNDEFINED')
    } else {
      console.log(item)
    }
  })
}

function randRange (upper) {
  return Math.floor(Math.random() * upper)
}

function randomCoords () {
  return [randRange(GRID_WIDTH), randRange(GRID_HEIGHT)]
}

function createGrid () {
  let grid = []
  for (let x = 0; x < GRID_WIDTH; x++) {
    grid[x] = []
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[x][y] = ''
    }
  }
  return grid
}

// const randomItem = (array) => {
//   return array[randRange(array.length)]
// }

// const CHAR_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
// const randomString = (length=16) => {
//   let result = []
//   for (let i = 0; i < length; i++) {
//     result.push(randomItem(CHAR_POOL))
//   }
//   return result.join('')
// }



const GRID_WIDTH = 20
const GRID_HEIGHT = 20
let grid = createGrid()

const app = express()
const server = app.listen(3000)
const io = socketio(server)

app.set('view engine', 'html')
app.engine('html', handlebars.__express)
app.set('views', __dirname + '/www')


app.use(helmet())
// app.use(compression())
app.use(session({ secret: 'KV8t4Bhvq4FAIwj7'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res, next) => {
  // if ('id' in req.session) {
  //   res.render('index.html', {component: 'extraTab'})
  // } else {
    res.render('index.html', {component: 'setup'})
  // }
})

app.get('/game', (req, res, next) => { 
  req.session.name = 'man'//req.body.id
  res.render('index.html', {
    component: 'game', 
    id: 'man', 
    coords: JSON.stringify(randomCoords()), 
    grid: JSON.stringify(grid),
    GRID_WIDTH: GRID_WIDTH,
    GRID_HEIGHT: GRID_HEIGHT
  })
})

app.use(express.static('www'))

p('RUNNING ON http://127.0.0.1:3000/')



io.on('connection', (socket) => {
  socket.on('action', (data) => {
    socket.broadcast.emit('action', data)
  })
})
