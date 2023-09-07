import types from './types'

const initialState = {
  network: {},
  isWasmInitializing: false,
}

export function zerochainReducer(state = initialState, action) {
  switch (action.type) {
    case types.DNS_NETWORK_SUCCESS:
      return { ...state, network: action.payload }

    case types.SET_WASM_INIT_STATUS:
      return { ...state, isWasmInitializing: action.payload }

    default:
      return state
  }
}
