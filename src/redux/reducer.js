const initialState = {
  coords: [0, 0],
  ammoCapacity: 0,
  health: 0,
  ammo: 0
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_COORDS':
      return {...state, coords: action.payload}
    case 'SET_AMMO_CAPACITY':
      return {...state, ammoCapacity: action.payload}
    case 'CHANGE_HEALTH':
      return {...state, health: action.payload}
    case 'CHANGE_AMMO':
      return {...state, ammo: action.payload}
  }
  return state
}
