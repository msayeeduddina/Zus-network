import { download, getNextSegment, play, stop } from '@zerochain/zus-sdk'

import types from '../types'

import { requestActionTypes } from 'store/api-utils'

import { selectActiveAllocationId } from 'store/allocation'
import { getMimeCodecs } from 'lib/utils/codec'

export const startPlay = props => async (dispatch, getState) => {
  const actionTypes = requestActionTypes(types.PLAY_VIDEO)
  dispatch({ type: actionTypes.request })

  const {
    videoElement,
    remotePath = '',
    authTicket = '',
    lookupHash = '',
    mimeType = '',
    id = '',
  } = props

  if (!videoElement) throw new Error('video element is required')

  const state = getState()
  const allocationId = selectActiveAllocationId(state)

  try {
    await play(allocationId, remotePath, authTicket, lookupHash, false)

    //first segment
    const buf = await getNextSegment()

    const { isFragmented, mimeCodecs } = getMimeCodecs({ mimeType, buf })

    if (isFragmented && MediaSource.isTypeSupported(mimeCodecs))
      return playChunks({ videoElement, buf, mimeCodecs })

    stop()
    // allocationID, remotePath, authTicket, lookupHash string, downloadThumbnailOnly
    const { url } = await download(
      allocationId,
      remotePath,
      authTicket,
      lookupHash,
      false,
      10,
      ''
    )

    const containerElement = document.getElementById(`container${lookupHash}`)
    videoElement.crossOrigin = 'anonymous'
    videoElement.src = url

    const promise = videoElement.play()
    if (promise !== undefined) {
      promise
        .catch(err => {
          // Auto-play was prevented
          // console.log(err, 'err from videoPlayer')
          while (videoElement.lastElementChild) {
            videoElement.removeChild(videoElement.lastElementChild)
          }
          videoElement.removeAttribute('src')

          const source = document.createElement('source')
          source.setAttribute('src', url)
          source.setAttribute('type', mimeType)
          videoElement.appendChild(source)

          videoElement.setAttribute('autoplay', true)
          videoElement.setAttribute('playsinline', true)
          videoElement.setAttribute('loop', true)
          videoElement.setAttribute('controls', true)
          // weird fix for safari
          setTimeout(
            () => (containerElement.innerHTML = videoElement.outerHTML),
            10
          )
        })
        .then(() => {
          // Auto-play started
        })
    }
    dispatch(removeVideoLoading(id))
  } catch (err) {
    dispatch(removeVideoLoading(id))
    videoElement.pause()
    dispatch({ type: actionTypes.error, payload: err })
  }
}

const playChunks = async ({ videoElement, buf, mimeCodecs }) => {
  let sourceBuffer

  const mediaSource = new MediaSource()

  videoElement.src = URL.createObjectURL(mediaSource)
  videoElement.crossOrigin = 'anonymous'

  const getNextSegment = async () => {
    try {
      const buffer: any = await getNextSegment()

      if (buffer?.length > 0) {
        sourceBuffer.appendBuffer(new Uint8Array(buffer))
      } else {
        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
          mediaSource.endOfStream()
        }
      }
    } catch (err) {
      getNextSegment()
    }
  }

  mediaSource.addEventListener('sourceopen', async () => {
    sourceBuffer = mediaSource.addSourceBuffer(mimeCodecs)
    sourceBuffer.mode = 'sequence'
    sourceBuffer.addEventListener('updateend', getNextSegment)

    sourceBuffer.appendBuffer(buf)
    videoElement.play()
  })
}

export const stopPlay = () => async (dispatch, getState) => {
  const actionTypes = requestActionTypes(types.PAUSE_VIDEO)
  dispatch({ type: actionTypes.request })

  const state = getState()

  try {
    const data = await stop()

    await dispatch({ type: actionTypes.success })

    return { data }
  } catch (error) {
    dispatch({
      type: actionTypes.error,
      message: 'Error pausing video, please try again in a few moments',
      payload: error,
    })

    return { error }
  }
}

export const addVideoLoading = fileId => ({
  type: types.ADD_VIDEO_LOADING,
  payload: fileId,
})

export const removeVideoLoading = fileId => ({
  type: types.REMOVE_VIDEO_LOADING,
  payload: fileId,
})

export const clearAllVideoLoadings = () => ({
  type: types.CLEAR_ALL_VIDEO_LOADINGS,
})
