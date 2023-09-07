import types from './types'

const initialState = {
  transactions: [],
}

export function transactionsReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case types.GET_LATEST_TXNS_SUCCESS:
      return { ...state, transactions: payload || [] }

    default:
      return state
  }
}
