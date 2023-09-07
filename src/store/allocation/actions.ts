// @ts-nocheck

import { getAllocation, listAllocations } from '@zerochain/zus-sdk'
import types from './types'

import { requestActionTypes, RequestActionTypes } from 'store/api-utils'
import { createAllocation } from '@zerochain/zus-sdk'

export const createAllocationFunc = () => async dispatch => {
  const actionType: RequestActionTypes = requestActionTypes(
    types.CREATE_ALLOCATION
  )
  dispatch({ type: actionType.request })

  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 30)

  //datashards, parityshards int, size, expiry int64,minReadPrice, maxReadPrice, minWritePrice, maxWritePrice int64, lock int64,preferredBlobberIds []string
  const config = {
    datashards: 4,
    parityshards: 2,
    size: 1073741824,
    minReadPrice: 0,
    maxReadPrice: 10000000000,
    minWritePrice: 0,
    maxWritePrice: 10000000000,
    lock: 10450000000,
  }

  try {
    const res = await createAllocation(config)
    const data = await JSON.parse(res?.transaction_output)

    dispatch({ type: actionType.success, payload: data })

    await dispatch(listAllocationsFunc())
  } catch (error) {
    process.env.NODE_ENV === 'development' && console.log(error, 'error')
    dispatch({ type: actionType.error })
  }
}

export const listAllocationsFunc = () => async dispatch => {
  const actionType: RequestActionTypes = requestActionTypes(
    types.LIST_ALLOCATIONS
  )
  dispatch({ type: actionType.request })

  try {
    const list = await listAllocations()
    dispatch({ type: actionType.success, payload: list || [] })
  } catch (error) {
    dispatch({ type: actionType.error })
  }
}

export const getAllocationInfo = props => async dispatch => {
  const actionTypes = requestActionTypes(types.GET_ALLOC_INFO)
  dispatch({ type: actionTypes.request })

  const { id } = props

  try {
    const data = await getAllocation(id)

    await dispatch({ type: actionTypes.success, payload: data })
    return { data }
  } catch (error) {
    await dispatch({
      type: actionTypes.error,
      payload: error,
      message: error?.message,
    })
    return { error }
  }
}
