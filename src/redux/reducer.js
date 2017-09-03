export default function reducer (state = {}, action) {
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
