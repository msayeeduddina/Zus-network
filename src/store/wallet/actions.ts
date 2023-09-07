// @ts-nocheck

import types, { WalletType } from './types'
import { selectActiveWallet } from './selectors'

import { createWallet, getBalanceWasm, setWallet } from '@zerochain/zus-sdk'
import { requestActionTypes, RequestActionTypes } from 'store/api-utils'

export const clearStore = () => ({
  type: 'CLEAR_STORE',
})

export const createWalletFunc = () => async dispatch => {
  const actionType: RequestActionTypes = requestActionTypes(types.CREATE_WALLET)
  dispatch({ type: actionType.request })

  const handleError = () => {
    dispatch({ type: actionType.error })
    return { error: 'Error creating wallet' }
  }

  try {
    const wallet: WalletType = await createWallet()
    if (wallet.id) {
      await setWallet(
        wallet.id,
        wallet.keys.privateKey,
        wallet.keys.publicKey,
        wallet.mnemonic
      )
      dispatch({ type: actionType.success, payload: wallet })
      return { data: wallet }
    } else handleError()
  } catch (error) {
    handleError()
  }
}

export const getBalanceFunc = () => async (dispatch, getState) => {
  const actionType: RequestActionTypes = requestActionTypes(types.GET_BALANCE)
  dispatch({ type: actionType.request })

  const wallet = selectActiveWallet(getState())

  try {
    const balance = await getBalanceWasm(wallet.id)
    dispatch({ type: actionType.success, payload: balance })
    return balance
  } catch (error) {
    dispatch({ type: actionType.error })
    return { error: 'Error getting balance' }
  }
}
