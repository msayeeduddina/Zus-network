export const createActionTypes = actions => {
  const actionTypes = {}

  actions.map(action => {
    actionTypes[`${action}_REQUEST`] = `${action}_REQUEST`
    actionTypes[`${action}_SUCCESS`] = `${action}_SUCCESS`
    actionTypes[`${action}_ERROR`] = `${action}_ERROR`
    actionTypes[action] = action
  })

  return actionTypes
}

export const wait = async delay =>
  new Promise(resolve => setTimeout(resolve, delay))

export * from './utils'
