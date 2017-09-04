import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './redux/store.js'
import './normalize.css'
import './grid.css'
import './index.css'
import Setup from './pages/setup/index.jsx'
import Game from './pages/game/index.jsx'
import ExtraTab from './pages/extraTab/index.jsx'

let Component
switch (window.component) {
  case 'setup':
    Component = Setup
    break
  case 'game':
    Component = Game
    break
  case 'extraTab':
    Component = ExtraTab
    break
}

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('app')
)
