export const networkConfig = {
  chainId: '0afc093ffb509f059c55478bc1a60351cef7b4e9c008a53a6cc8241ca8617dfe',
  signatureScheme: 'bls0chain',
  minConfirmation: 50,
  minSubmit: 50,
  confirmationChainLength: 3,
}

export const zcnContracts = {
  faucetSCAddress:
    '6dba10422e368813802877a85039d3985d96760ed844092319743fb3a76712d3',
  storageSCAddress:
    '6dba10422e368813802877a85039d3985d96760ed844092319743fb3a76712d7',
  minerSCAddress:
    '6dba10422e368813802877a85039d3985d96760ed844092319743fb3a76712d9',
  interestPoolSCAddress:
    'cf8d0df9bd8cc637a4ff4e792ffe3686da6220c45f0e1103baa609f3f1751ef4',
  dexMintAddress:
    '6dba10422e368813802877a85039d3985d96760ed844092319743fb3a76712e0',
}

export const zcnTxnRequestTypes = {
  SEND: 0, // A transaction to send tokens to another account, state is maintained by account
  DATA: 10, // A transaction to just store a piece of data on the block chain
  SMART_CONTRACT: 1000, // A smart contract transaction type
}
