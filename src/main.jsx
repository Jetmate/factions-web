import React from 'react'
import ReactDOM from 'react-dom'

import './normalize.css'
import './index.css'
import Loading from './pages/loading/index.jsx'
import Game from './pages/game/index.jsx'
import ExtraTab from './pages/extraTab/index.jsx'

let Component
switch (window.component) {
  case 'loading':
    Component = Loading
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
