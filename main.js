'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
// import compression from 'compression'

// import http from 'http'


var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _hbs = require('hbs');

var _hbs2 = _interopRequireDefault(_hbs);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var p = function p() {
  for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }

  items.forEach(function (item) {
    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && item !== null) {
      for (var key in item) {
        if (item.hasOwnProperty(key)) {
          console.log(key + ': ' + item[key]);
        }
      }
    } else if (typeof item === 'undefined') {
      console.log('UNDEFINED');
    } else {
      console.log(item);
    }
  });
};

var randRange = function randRange(upper) {
  return Math.floor(Math.random() * upper);
};

var randomItem = function randomItem(array) {
  return array[randRange(array.length)];
};

var CHAR_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var randomString = function randomString() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

  var result = [];
  for (var i = 0; i < length; i++) {
    result.push(randomItem(CHAR_POOL));
  }
  return result.join('');
};

var app = (0, _express2.default)();
var server = app.listen(3000);
var io = (0, _socket2.default)(server);
var loading = io.of('/loading');

app.set('view engine', 'html');
app.engine('html', _hbs2.default.__express);
app.set('views', __dirname + '/www');

var queue = [];
var pairs = {};

app.use((0, _helmet2.default)());
// app.use(compression())
app.use((0, _expressSession2.default)({ secret: 'KV8t4Bhvq4FAIwj7' }));

app.get('/', function (req, res, next) {
  p('LOADING');
  p('QUEUE', queue, 'PAIRS', pairs);

  if (!('id' in req.session)) {
    req.session.id = randomString();
    p('NEW ID: ' + req.session.id);
  }
  if (~queue.indexOf(req.session.id)) {
    res.render('index.html', { component: 'extraTab' });
  } else {
    req.session.opponent = '';
    if (queue.length) {
      req.session.opponent = queue.pop(0);
      loading.emit('found', req.session.opponent);
      p('HERE ' + req.session.opponent + ', ID: ' + req.session.id);
      pairs[req.session.opponent] = req.session.id;
      res.redirect('/game');
    } else {
      p('NO ONE: ID: ' + req.session.id);
      queue.push(req.session.id);
      res.render('index.html', { component: 'loading', id: req.session.id });
    }
  }
});

app.get('/game', function (req, res, next) {
  p('GAME');
  p('QUEUE', queue, 'PAIRS', pairs);
  if (!req.session.opponent && !(req.session.id in pairs)) {
    res.redirect('/');
  } else {
    var opponent = void 0,
        playerIndex = void 0;
    if (!req.session.opponent) {
      opponent = pairs[req.session.id];
      delete pairs[req.session.id];
      playerIndex = 1;
      p('NO OPPONENT: ID: ' + req.session.id + ', OPPONENT: ' + opponent);
    } else {
      opponent = req.session.opponent;
      delete req.session.opponent;
      playerIndex = 0;
    }
    res.render('index.html', { component: 'game', playerIndex: playerIndex, id: req.session.id, opponent: opponent });
  }
});

app.use(_express2.default.static('www'));

p('RUNNING ON http://127.0.0.1:3000/');

loading.on('connection', function (socket) {
  socket.on('close', function (id) {
    // p('FIRST QUEUE', queue)
    if (~queue.indexOf(id)) {
      queue.splice(queue.indexOf(id), 1);
    }
    // p('NOW', queue)
  });
});

var getRoom = function getRoom(socket) {
  return Object.keys(socket.rooms)[1];
};

io.on('connection', function (socket) {
  socket.on('ready', function (roomId) {
    socket.join(roomId);
  });

  socket.on('action', function (data) {
    socket.broadcast.to(getRoom(socket)).emit('action', data);
  });

  socket.on('close', function (id) {
    socket.broadcast.to(getRoom(socket)).emit('close', id);
  });
});