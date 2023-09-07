import { createActionTypes } from 'lib'
import { Types } from 'store/api-utils'

export const CREATE_WALLET = 'CREATE_WALLET'
export const CLEAR_STORE = 'CLEAR_STORE'
export const GET_BALANCE = 'GET_BALANCE'

export const types: Types = createActionTypes([
  CREATE_WALLET,
  CLEAR_STORE,
  GET_BALANCE,
])

export type WalletState = {
  list: any[]
  activeWalletId: string
  balance: { usd: number; zcn: number }
}

export type WalletType = {
  id: string
  name: string
  mnemonic: string
  version: string
  creationDate: number
  keys: {
    publicEncryptionKey: string
    walletId: string
    privateKey: string
    publicKey: string
  }
}

export default types
