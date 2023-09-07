export const configJson = {
  chainId: '0afc093ffb509f059c55478bc1a60351cef7b4e9c008a53a6cc8241ca8617dfe',
  signatureScheme: 'bls0chain',
  minConfirmation: 50,
  minSubmit: 50,
  confirmationChainLength: 3,
  blockWorker: 'https://demo.zus.network/dns',
  zboxHost: 'https://0box.demo.zus.network',
  zboxAppType: 'vult',
  defaultSharderConsensous: 3,
}

export const config = [
  configJson.chainId,
  configJson.blockWorker,
  configJson.signatureScheme,
  configJson.minConfirmation,
  configJson.minSubmit,
  configJson.confirmationChainLength,
  configJson.zboxHost,
  configJson.zboxAppType,
  configJson.defaultSharderConsensous,
]
