import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { getBls } from 'lib/utils'

// As the herumi BLS script is being lazy loaded
// this special hook needs to be used when calling a BLS dependent function on mount
export const useBls = (props = {}) => {
  const { action, params }: { action?: (any) => void; params?: object } = props

  const dispatch = useDispatch()
  const [blsLoaded, setBlsLoaded] = useState(false)

  useEffect(() => {
    let interval

    const dispatchAction = async () => {
      // @ts-ignore
      if (window.bls) {
        await getBls()
        setBlsLoaded(true)
        action && dispatch(action(params))
        clearInterval(interval)
      }
    }

    interval = setInterval(dispatchAction, 300)
    dispatchAction()

    return () => clearInterval(interval)
  }, [dispatch, action, params])

  return { blsLoaded }
}

useBls.propTypes = {
  action: PropTypes.func,
  params: PropTypes.object,
}
