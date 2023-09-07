import types from './types'

import { sharderEndpoints, basicReqWithDispatch } from 'store/api-utils'
import { getRandomArrayElement } from 'lib/utils'

export const getLatestTxns = params => async (dispatch, getState) => {
  const { sharders } = getState().zerochain.network
  if (!(sharders && sharders?.length))
    return { error: 'Unable to get sharders' }
  const url = getRandomArrayElement(sharders)

  const { error, data }: any = await basicReqWithDispatch({
    url: url + sharderEndpoints.GET_TRANSACTIONS,
    baseType: types.GET_LATEST_TXNS,
    params,
    options: { method: 'GET' },
    dispatch,
  })
  return { error, data }
}

export const getTxnByHash = hash => async (dispatch, getState) => {
  const { sharders } = getState().zerochain.network
  if (!(sharders && sharders?.length))
    return { error: 'Unable to get sharders' }

  const url = getRandomArrayElement(sharders)

  const { error, data }: any = await basicReqWithDispatch({
    url: url + sharderEndpoints.GET_TXN_BY_HASH,
    baseType: types.GET_TXN_BY_HASH,
    params: { transaction_hash: hash },
    dispatch,
  })

  return { error, data }
}
