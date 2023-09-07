import { zcnContracts } from 'lib/constants/zeroChain'

export const sharderEndpoints = {
  GET_TRANSACTIONS: `/v1/screst/${zcnContracts.storageSCAddress}/transactions`,
  GET_TXN_BY_HASH: `/v1/screst/${zcnContracts.storageSCAddress}/transaction`,
}
