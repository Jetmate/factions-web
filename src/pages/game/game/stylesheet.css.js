import { GUI_MARGIN, ELEMENT_OFFSET, ELEMENT_BACKGROUND_COLOR, ELEMENT_OUTLINE_COLOR, SCALE_FACTOR, BLOCK_COLOR } from './constants.js'

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
    'float': 'right'
  }
}
