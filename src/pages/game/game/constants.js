export const
  GRID_WIDTH = window.GRID_WIDTH,
  GRID_HEIGHT = window.GRID_HEIGHT,
  SCALE_FACTOR = 3,
  REAL_BLOCK_WIDTH = 16,
  BLOCK_WIDTH = REAL_BLOCK_WIDTH * SCALE_FACTOR,
  BLOCK_SIZE = [BLOCK_WIDTH, BLOCK_WIDTH],
  WIDTH = GRID_WIDTH * BLOCK_WIDTH,
  HEIGHT = GRID_HEIGHT * BLOCK_WIDTH,
  CANVAS_WIDTH = window.innerWidth,
  CANVAS_HEIGHT = window.innerHeight,
  CENTER = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2],

  UPDATE_WAIT = 33,

  /// ARROW KEYS
  // KEY_RIGHT = 39,
  // KEY_LEFT = 37,
  // KEY_UP = 38,
  // KEY_DOWN = 40,

  /// WASD
  KEY_RIGHT = 68,
  KEY_LEFT = 65,
  KEY_UP = 87,
  KEY_DOWN = 83,

  GRID_COLOR = '#8e8e8e',
  ELEMENT_OUTLINE_COLOR = '#bababa',
  ELEMENT_BACKGROUND_COLOR = '#e0e0e0',
  ELEMENT_OFFSET = 25,
  GUI_PADDING = [50, 50],

  HEALTH_BAR_SIZE = [100, 300],
  HEALTH_BAR_COLOR = '#96858f',

  HEALTH_BAR2_SIZE = [15 * SCALE_FACTOR, 5 * SCALE_FACTOR],
  HEALTH_BAR2_OFFSET = -10 * SCALE_FACTOR,

  BULLET_SPEED = 40,
  PLAYER_SPEED = 5,
  PLAYER_HEALTH = 10,

  MINIMAP_SIZE = [100, 100],
  MINIMAP_PLAYER_COLOR = '#4a6782',
  MINIMAP_MARKER_WIDTH = 10,


  BLOCK_OUTLINE_WIDTH = 1,

  // BLOCK_COLOR = '#C0B283',
  // BLOCK_OUTLINE_COLOR = '#373737',
  // FLOOR_COLOR = '#dcd0c0',

  BLOCK_COLOR = '#6d7993',
  BLOCK_OUTLINE_COLOR = '#8A93A8',
  FLOOR_COLOR = '#efefef',

  BULLET_BAR_GAP = SCALE_FACTOR,
  BULLET_BAR_BULLET_OUTLINE = '#C0B283',
  BULLET_BAR_BULLET_COLOR = '#DCD0C0',
  BULLET_BAR_SIZE = [100, 300],

  CURSOR_AIMING = 'url(media/aiming.gif), auto',
  CURSOR_RELOADING = ['url(media/reloading1.gif), auto', 'url(media/reloading2.gif), auto', 'url(media/reloading3.gif), auto', 'url(media/reloading4.gif), auto'],

  FONT = '10px sans-serif',
  LEADERBOARD_ROW_HEIGHT = 10,
  LEADERBOARD_ROW_NUMBER = 10,
  LEADERBOARD_SIZE = [LEADERBOARD_ROW_HEIGHT * LEADERBOARD_ROW_NUMBER, 100]
