import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { init, setWallet, showLogs } from '@zerochain/zus-sdk'

import { config } from 'constant/config'

import { selectActiveWallet } from 'store/wallet'
import { setWasmInitStatus } from 'store/zerochain'
import {
  clearSelectedFiles,
  clearFileOperations,
  clearAllDownloadLoadings,
} from 'store/object'

const AppWrapper = ({ children }) => {
  const wallet = useSelector(selectActiveWallet)
  const dispatch = useDispatch()

  const isMounted = useRef(false)

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(clearSelectedFiles(false))
      dispatch(clearFileOperations())
      dispatch(clearAllDownloadLoadings())

      dispatch(setWasmInitStatus(true))
      await init(config)
      process.env.NODE_ENV === 'development' && (await showLogs())
      dispatch(setWasmInitStatus(false))

      if (wallet.id) {
        await setWallet(
          wallet.id,
          wallet.keys.privateKey,
          wallet.keys.publicKey,
          wallet.mnemonic
        )
      }
    }

    if (isMounted.current) initializeApp()
    else isMounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return <>{children}</>
}

AppWrapper.propTypes = { children: PropTypes.any }

export default AppWrapper
