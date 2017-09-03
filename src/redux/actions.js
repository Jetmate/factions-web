export function changeCoords (coords) {
  return {
    type: 'CHANGE_COORDS',
    payload: coords
  }
}

export function setAmmoCapacity (ammoCapacity) {
  return {
    type: 'SET_AMMO_CAPACITY',
    payload: ammoCapacity
  }
}

export function changeHealth (health) {
  return {
    type: 'CHANGE_HEALTH',
    payload: health
  }
}

export function changeAmmo (ammo) {
  return {
    type: 'CHANGE_AMMO',
    payload: ammo
  }
}
