import { GUI_MARGIN, ELEMENT_OFFSET, ELEMENT_BACKGROUND_COLOR, ELEMENT_OUTLINE_COLOR, SCALE_FACTOR, BLOCK_COLOR, LEADERBOARD_SIZE, LEADERBOARD_ROW_PADDING, LEADERBOARD_PADDING, LEADERBOARD_ROW_HEIGHT } from './constants.js'

export default {
  '.game': {
    'position': 'absolute',
    'top': 0,
    'z-index': -1,
    'background-color': BLOCK_COLOR
  },

  '.gui': {
    'margin': GUI_MARGIN
  },

  '.gui > *': {
    'margin-bottom': ELEMENT_OFFSET,
    'background-color': ELEMENT_BACKGROUND_COLOR,
    'border': `${SCALE_FACTOR}px solid ${ELEMENT_OUTLINE_COLOR}`,
    'display': 'block'
  },

  '.right': {
    'float': 'right',
    'clear': 'both'
  },

  '.leaderboard': {
    'margin': 0,
    'margin-bottom': ELEMENT_OFFSET,
    'list-style': 'none',
    'width': LEADERBOARD_SIZE[0],
    'height': LEADERBOARD_SIZE[1],
    'user-select': 'none',
    'padding': LEADERBOARD_PADDING
  },

  '.leaderboard :global .row': {
    'margin-bottom': LEADERBOARD_ROW_PADDING,
    'height': LEADERBOARD_ROW_HEIGHT
  },

  '.currentPlayer': {
    'background-color': ELEMENT_OUTLINE_COLOR,
    'padding': `${SCALE_FACTOR}px 0`
  }
}
