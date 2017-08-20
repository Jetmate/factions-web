import React from 'react'
import ReactDOM from 'react-dom'

import './normalize.css'
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
  <Component />,
  document.getElementById('app')
)
