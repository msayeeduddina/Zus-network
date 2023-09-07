import { createActionTypes } from 'lib'
import { Types } from 'store/api-utils'

export const DNS_NETWORK = 'DNS_NETWORK'
export const SET_WASM_INIT_STATUS = 'SET_WASM_INIT_STATUS'

const types: Types = createActionTypes([DNS_NETWORK, SET_WASM_INIT_STATUS])
export default types
