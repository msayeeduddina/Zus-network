import types from '../types'
import { selectFiles } from '../selectors'

export const setAllFiles = () => async (dispatch, getState) => {
  const files = selectFiles(getState())

  dispatch({ type: types.SET_ALL_FILES, payload: files })
}

export const addTempImageUrl = (id, url) => async (dispatch, getState) => {
  const { tempImageUrls = {} } = getState().object || {}

  dispatch({
    type: types.ADD_TEMP_IMAGE_URL,
    payload: { ...tempImageUrls, [id]: url },
  })
}

export const removeTempImageUrl = id => async (dispatch, getState) => {
  const { tempImageUrls = {} } = getState().object || {}

  delete tempImageUrls[id]

  dispatch({
    type: types.REMOVE_TEMP_IMAGE_URL,
    payload: tempImageUrls,
  })
}

export const clearTempImageUrls = () => async dispatch =>
  dispatch({ type: types.CLEAR_ALL_TEMP_IMAGE_URLS })

export const setMultiSelection = isEnabled => async (dispatch, getState) => {
  const { multiSelect } = getState().object || {}

  dispatch({
    type: types.SET_MULTI_SELECTION,
    payload: { ...multiSelect, multiSelectionEnabled: isEnabled },
  })
}

export const addSelectedFiles = id => async (dispatch, getState) => {
  const { multiSelect } = getState().object || {}
  const { selectedFiles } = multiSelect

  dispatch({
    type: types.ADD_TO_MULTI_SELECTION,
    payload: {
      ...multiSelect,
      selectedFiles:
        id === undefined || selectedFiles.includes(id)
          ? selectedFiles
          : [...selectedFiles, id],
    },
  })
}

export const removeSelectedFiles = id => async (dispatch, getState) => {
  const { multiSelect } = getState().object || {}

  dispatch({
    type: types.REMOVE_FROM_MULTI_SELECTION,
    payload: {
      ...multiSelect,
      selectedFiles: multiSelect.selectedFiles.filter(f => f !== id),
    },
  })
}

export const clearSelectedFiles = selection => async dispatch =>
  dispatch({
    type: types.CLEAR_MULTI_SELECTION_LIST,
    payload: { multiSelectionEnabled: selection, selectedFiles: [] },
  })

export const addFileOperation = fileOp => async (dispatch, getState) => {
  const { filesOps = [] } = getState().object || {}
  const newFilesOps = filesOps.filter(op => op.fileId !== fileOp.fileId)

  dispatch({
    type: types.ADD_FILE_OPERATION,
    payload: [...newFilesOps, fileOp],
  })
}

export const updateFileOperation = bulkOp => async (dispatch, getState) => {
  const { filesOps = [] } = getState().object || {}
  const newFilesOps = filesOps.filter(op => op.fileId !== bulkOp.fileId)

  dispatch({
    type: types.ADD_FILE_OPERATION,
    payload: [bulkOp, ...newFilesOps],
  })
}

export const removeFileOperation = fileId => async (dispatch, getState) => {
  const { object = {} } = getState() || {}
  const filesOps = object.filesOps?.filter(
    fileOp => (fileOp.fileId || fileOp.id) !== fileId
  )

  dispatch({ type: types.REMOVE_FILE_OPERATION, payload: filesOps })
}

export const clearFileOperations = () => async dispatch =>
  dispatch({ type: types.CLEAR_FILE_OPERATIONS })

export const addDownloadLoading = props => async (dispatch, getState) => {
  const { fileId, progress, isDownloading } = props || {}

  const { downloadLoadings = [] } = getState().object || {}

  const newDownloadLoadings = downloadLoadings.filter(
    loading => loading.fileId !== fileId
  )

  const payload = [...newDownloadLoadings, { fileId, progress, isDownloading }]

  dispatch({ type: types.ADD_DOWNLOAD_LOADING, payload })
}

export const removeDownloadLoading = fileId => async (dispatch, getState) => {
  const { downloadLoadings = [] } = getState().object || {}

  const newDownloadLoadings = downloadLoadings.filter(
    loading => loading.fileId !== fileId
  )

  dispatch({
    type: types.REMOVE_DOWNLOAD_LOADING,
    payload: newDownloadLoadings,
  })
}

export const clearAllDownloadLoadings = () => ({
  type: types.CLEAR_ALL_DOWNLOAD_LOADINGS,
})
