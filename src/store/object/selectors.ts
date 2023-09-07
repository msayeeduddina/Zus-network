import { normalizedPath as nP } from 'lib'

export const selectFiles = (state, walletId?, allocationId?) => {
  const { wallets } = state.object
  const { activeAllocationId } = state.allocation
  const { activeWalletId } = state.wallet
  const wallet = wallets[walletId] || wallets[activeWalletId]
  const allocId = allocationId || activeAllocationId
  const files = (allocId && wallet && wallet[allocId]) || []

  return files
}

export const getPathUrl =
  ({
    path,
    baseURL = '/',
    walletId,
    allocationId,
  }: { [index: string]: string } = {}) =>
  state => {
    const files = selectFiles(state, walletId, allocationId)
    const fileLookupHash =
      files.find(it => it.path === nP(path))?.lookup_hash || ''

    return fileLookupHash ? `${baseURL}?folder=${fileLookupHash}` : baseURL
  }

export const selectMultiFiles = state => {
  const { multiSelectionEnabled } = state.object.multiSelect
  return multiSelectionEnabled
}

export const selectMultiFilesList = state => {
  const { multiSelectionEnabled, selectedFiles = [] } = state.object.multiSelect
  return multiSelectionEnabled ? selectedFiles : []
}
