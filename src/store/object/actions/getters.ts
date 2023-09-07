import { listObjects, multiDownload } from '@zerochain/zus-sdk'

import types from '../types'
import { isAllocationDisabled } from '../helpers'
import { setAllFiles } from './utils'

import {
  requestActionTypes,
  handleResponseDispatch,
  blobberEndpoints,
  getTxnSignature,
  basicReqWithDispatch,
  RequestActionTypes,
} from 'store/api-utils'
import { getAllocationInfo, selectActiveAllocation } from 'store/allocation'
import { selectActiveWallet } from 'store/wallet'

import { getRandomArrayElement, normalizedPath as nP } from 'lib/utils'

export const listObjectsFunc = path => async (dispatch, getState) => {
  const state = getState()

  const wallet = selectActiveWallet(state)
  const activeAllocation = selectActiveAllocation(state)
  const { id: allocationId } = activeAllocation
  const disabledAllocation = isAllocationDisabled(activeAllocation)

  const actionTypes = requestActionTypes(types.LIST_OBJECTS)
  dispatch({ type: actionTypes.request })

  /*
{ 
  "name":"/",
  "path":"/",
  "type":"d",
  "size":840039,
  "num_blocks":35,
  "lookup_hash":"d7e465694eedf101a5e928d9821491213c262f1db397bddc4b8e89dac4651b89",
  "encryption_key":"",
  "actual_size":0,
  "actual_num_blocks":0,
  "created_at":1660273336,
  "updated_at":1660346924,
  "list":[
    {
      "name":"2.png",
      "path":"/2.png",
      "type":"f",
      "size":810932,
      "hash":"7b366d254f9c77da6fd461e09daf3a95d3744cf6e112b68537bfd24600086c59",
      "mimetype":"image/png",
      "num_blocks":16,
      "lookup_hash":"51af4c85da6b690cc7e102a7dcd7104d3202a78bcc1a04219a2334d1207dc9d0",
      "encryption_key":"",
      "actual_size":405466,
      "actual_num_blocks":6,
      "created_at":1660346924,
      "updated_at":1660346924,
      "list":null
    }
  ]
}
*/

  const list =
    allocationId &&
    !disabledAllocation &&
    (await listObjects(allocationId, nP(path)))

  const response = {
    walletId: wallet.id,
    allocationId,
    data: { list, path },
    allocation: activeAllocation,
  }

  setTimeout(() => dispatch(setAllFiles()), 1000)

  return handleResponseDispatch({
    errMessage: 'Error fetching object list, please try again in a few moments',
    actionTypes,
    dispatch,
    data: { ...response },
  })
}

export const getFilesFromPath = props => async (dispatch, getState) => {
  const { payload, params } = props
  const { allocationInfo, allocationId } = payload
  const { keys, id } = selectActiveWallet(getState())

  const blobber = getRandomArrayElement(allocationInfo.blobbers)
  const url = blobber.url + blobberEndpoints.ALLOC_FILE_LIST + allocationId

  const signature = await getTxnSignature(allocationId, keys.privateKey)

  const headers = {
    'X-App-Client-ID': id,
    'X-App-Client-Key': keys.publicKey,
    'X-App-Client-Signature': signature,
  }

  const { error, data }: any = await basicReqWithDispatch({
    baseType: types.GET_PATH_FILES,
    assets: { allocationId },
    options: {
      method: 'GET',
      headers,
    },
    dispatch,
    params,
    url,
  })

  return { error, data }
}

export const listFiles = props => async (dispatch, getState) => {
  const { allocationId: allocId, path = '/' } = props || {}
  const state = getState()
  const { activeAllocationId } = state.allocation

  const allocationId = allocId || activeAllocationId

  const { error, data: allocationInfo } = await dispatch(
    getAllocationInfo({ id: allocationId })
  )

  if (error) return { error }

  const payload = { allocationId, allocationInfo }
  const params = { path }

  await dispatch(getFilesFromPath({ payload, params }))
}

export const handleMultiDownload = props => async (dispatch, getState) => {
  const actionTypes = requestActionTypes(types.MULTI_DOWNLOAD)
  dispatch({ type: actionTypes.request })

  const {
    allocationId = '',
    files = '',
    authTicket = '',
    callbackFuncName = '',
  } = props

  const state = getState()
  const { activeAllocationId } = state.allocation

  try {
    const data = await multiDownload(
      allocationId || activeAllocationId,
      files,
      authTicket,
      callbackFuncName
    )
    await dispatch({ type: actionTypes.success })

    return data
  } catch (error) {
    dispatch({
      type: actionTypes.error,
      message: 'Error getting files, please try again in a few moments',
      payload: error,
    })
  }
}
