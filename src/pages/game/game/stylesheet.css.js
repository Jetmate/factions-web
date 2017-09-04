import { GUI_MARGIN, ELEMENT_OFFSET, ELEMENT_BACKGROUND_COLOR, ELEMENT_OUTLINE_COLOR, SCALE_FACTOR, BLOCK_COLOR, LEADERBOARD_SIZE } from './constants.js'

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
    'position': 'relative',
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
    'user-select': 'none'
  }
}
