import { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { startPlay, stopPlay } from 'store/object'

export const usePlayer = props => {
  const dispatch = useDispatch()

  const play = el => dispatch(startPlay({ videoElement: el, ...props }))

  const stop = useCallback(
    el => {
      dispatch(stopPlay())

      if (el && el.pause) {
        el.pause()
        URL.revokeObjectURL(el.src)
      }
    },
    [dispatch]
  )

  // @ts-ignore
  useEffect(() => {
    return stop
  }, [stop])

  return { play, stop }
}

usePlayer.propTypes = {
  videoElement: PropTypes.element.isRequired,
  allocationId: PropTypes.string,
  remotePath: PropTypes.string,
  authTicket: PropTypes.string,
  lookupHash: PropTypes.string,
}
