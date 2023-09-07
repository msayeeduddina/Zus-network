import { download, multiOperation, multiUpload } from '@zerochain/zus-sdk'

import types from '../types'

import {
  getNewFile,
  getParentPath,
  getPercentage,
  openSaveFileDialog,
  readChunk,
} from 'lib/utils'

import { requestActionTypes } from 'store/api-utils'
import { listObjectsFunc } from './getters'
import { listAllocationsFunc, selectActiveAllocation } from 'store/allocation'

const shouldShowLogs = process.env.NODE_ENV === 'development'

export const multiUploadFunc = options => async dispatch => {
  const actionTypes = requestActionTypes(types.UPLOAD_OBJECT)
  dispatch({ type: actionTypes.request })

  try {
    const res = await multiUpload(options)
    if (res.error) throw new Error(res.error)

    await dispatch(listObjectsFunc('/'))
    setTimeout(() => dispatch(listAllocationsFunc()), 2000)
    dispatch({ type: actionTypes.success })

    return res
  } catch (error) {
    shouldShowLogs && console.log('uploadObject err:', error)
    if (typeof error === 'string' && error.includes('Max size reached')) {
      dispatch({
        type: actionTypes.error,
        message: "You don't have enough space to upload files",
      })

      return { error: "You don't have enough space to upload files" }
    }

    dispatch({
      type: actionTypes.error,
      message: 'Error uploading file, please try again in a few moments',
      payload: error,
    })

    return { error }
  }
}

const g = global || window || self
const bridge = g.__zcn_wasm__

export const bulkUpload = options => async dispatch => {
  const start = bridge.glob.index
  const opts = options.map(obj => {
    const i = bridge.glob.index
    bridge.glob.index++
    const readChunkFuncName = '__zcn_upload_reader_' + i.toString()
    const callbackFuncName = '__zcn_upload_callback_' + i.toString()
    g[readChunkFuncName] = async (offset, chunkSize) => {
      shouldShowLogs &&
        console.log(
          'bulk_upload: read chunk remotePath:' +
            obj.remotePath +
            ' offset:' +
            offset +
            ' chunkSize:' +
            chunkSize
        )

      const chunk = await readChunk(offset, chunkSize, obj.file)
      // @ts-ignore
      return chunk.buffer
    }

    if (obj.callback) {
      g[callbackFuncName] = async (totalBytes, completedBytes, error) =>
        obj.callback(totalBytes, completedBytes, error)
    }

    return {
      allocationId: obj.allocationId,
      remotePath: obj.remotePath,
      readChunkFuncName: readChunkFuncName,
      fileSize: obj.file.size,
      thumbnailBytes: Array.from(obj?.thumbnailBytes || []).toString(),
      encrypt: obj.encrypt,
      webstreaming: obj.webstreaming,
      isUpdate: obj.isUpdate,
      isRepair: obj.isRepair,
      numBlocks: obj.numBlocks,
      callbackFuncName: callbackFuncName,
    }
  })

  const end = bridge.glob.index

  const result = await dispatch(multiUploadFunc(JSON.stringify(opts)))
  for (let i = start; i < end; i++) {
    g['__zcn_upload_reader_' + i.toString()] = null
    g['__zcn_upload_callback_' + i.toString()] = null
  }
  return result
}

export const uploadObjects = e => async (dispatch, getState) => {
  const { files = [] } = e.target
  if (!files.length) return

  // const uploadProgress = (totalBytes, completedBytes, error) => {
  //   if (error) return console.log(error, 'error')

  //   const progress = getPercentage(completedBytes, totalBytes)
  //   dispatch({
  //     type: types.SET_UPLOAD_PROGRESS,
  //     payload: { progress, lookupHash },
  //   })
  // }

  const state = getState()
  const { allFiles = [] } = state.object

  const allocation = selectActiveAllocation(state)
  if (!allocation.id) return { error: 'Allocation Id required' }

  const commonOps = {
    allocationId: allocation.id,
    thumbnailBytes: [].toString(),
    encrypt: false,
    webstreaming: true,
    isUpdate: false,
    isRepair: false,
    numBlocks: 100,
    callback: () => {},
  }

  const options = []
  for (let i = 0; i < files.length; i++) {
    const file = getNewFile(files[i], allFiles)

    // const thumbnailBytes = await getThumbnailBytes(file)

    options.push({
      ...commonOps,
      file,
      remotePath: `/${file.name}`,
      thumbnailBytes: '', // Array.from(thumbnailBytes || []).toString(),
    })
  }

  await dispatch(bulkUpload(options))
}

export const downloadObject = props => async (dispatch, getState) => {
  const actionTypes = requestActionTypes(types.DOWNLOAD_OBJECT)
  dispatch({ type: actionTypes.request })

  const {
    path = '',
    fileName = '',
    lookupHash,
    getDetails,
    isFinal = true,
  } = props

  const { activeAllocationId } = getState().allocation

  const callbackFuncName = 'downloadProgress'

  try {
    window[callbackFuncName] = (totalBytes, completedBytes, error) => {
      if (error) return console.log(error, 'error')

      const progress = getPercentage(completedBytes, totalBytes)
      dispatch({
        type: types.SET_DOWNLOAD_PROGRESS,
        payload: { progress, lookupHash },
      })
    }

    const file = await download(
      activeAllocationId,
      path,
      '',
      '',
      false,
      100,
      callbackFuncName,
      isFinal
    )

    await dispatch({ type: actionTypes.success })
    const downloadData = file.fileName === '.' ? { ...file, fileName } : file
    !getDetails && openSaveFileDialog(downloadData)

    return { data: downloadData }
  } catch (error) {
    shouldShowLogs && console.log(error, 'error')
    dispatch({
      type: actionTypes.error,
      message: 'Error downloading file, please try again in a few moments',
      payload: error,
    })

    return { error }
  }
}

export const handleMultiOperation = options => async (dispatch, getState) => {
  const actionTypes = requestActionTypes(types.MULTI_OPERATION)
  dispatch({ type: actionTypes.request })

  const { activeAllocationId } = getState().allocation

  try {
    const res = await multiOperation(activeAllocationId, options)
    if (res?.error) throw new Error(res.error)

    setTimeout(() => dispatch(listAllocationsFunc()), 2000)
    dispatch(listObjectsFunc(getParentPath(JSON.parse(options)[0]?.remotePath)))
    dispatch({ type: actionTypes.success })

    return res
  } catch (error) {
    shouldShowLogs && console.log('multiOperation err:', error)

    dispatch({
      type: actionTypes.error,
      message: 'Error with multiOperation, please try again in a few moments',
      payload: error,
    })

    return { error }
  }
}
