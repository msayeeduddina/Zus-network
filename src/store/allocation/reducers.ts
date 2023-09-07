import types from './types'

const initialState = {
  list: [],
  activeAllocationId: '',
}

export function allocationReducer(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_ALLOCATION_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
        activeAllocationId: action.payload.id,
      }

    case types.LIST_ALLOCATIONS_SUCCESS:
      return {
        ...state,
        list: action.payload,
        activeAllocationId:
          action.payload.length === 1
            ? action.payload[0].id
            : state.activeAllocationId,
      }

    default:
      return state
  }
}
