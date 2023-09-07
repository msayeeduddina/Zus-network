import allTypes from './allTypes'

export const requestActionTypes = actionType => ({
  request: `${actionType}_REQUEST`,
  success: `${actionType}_SUCCESS`,
  error: `${actionType}_ERROR`,
})

export type RequestActionTypes = {
  request: string
  success: string
  error: string
}

export type Types = {
  [index: string]: string
}

export const errorTypes = Object.keys(allTypes).reduce((acc, type) => {
  const typeObj = allTypes[type]
  if (typeObj.includes('ERROR')) acc.push(typeObj)
  return acc
}, [])
