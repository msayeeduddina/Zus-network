import { createActionTypes } from 'lib'
import { Types } from 'store/api-utils'

export const GET_LATEST_TXNS = 'GET_LATEST_TXNS'
export const GET_TXN_BY_HASH = 'GET_TXN_BY_HASH'

const types: Types = createActionTypes([GET_LATEST_TXNS, GET_TXN_BY_HASH])

export default types
