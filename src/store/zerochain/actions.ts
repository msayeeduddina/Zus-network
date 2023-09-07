import { getMinersAndSharders } from '@zerochain/zus-sdk'

import types from './types'

import { RequestActionTypes, requestActionTypes } from 'store/api-utils'

export const getNetwork = () => async dispatch => {
  const actionTypes: RequestActionTypes = requestActionTypes(types.DNS_NETWORK)

  const handleErr = error => {
    dispatch({ type: actionTypes.error })
    return { error }
  }

  try {
    const { error, data }: any = await getMinersAndSharders()

    if (error || !data) handleErr(error)
    else {
      dispatch({ type: actionTypes.success, payload: data })
      return { data }
    }
  } catch (error) {
    handleErr(error)
  }
}

export const setWasmInitStatus = status => ({
  type: types.SET_WASM_INIT_STATUS,
  payload: status,
})
