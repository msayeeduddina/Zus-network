import { zcnTxnRequestTypes, zcnContracts } from 'lib/constants/zeroChain'

export const bytesToString = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  bytes = bytes?.toPrecision()

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  if (i < 0) return `${bytes} bytes`

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const getParentPath = path => {
  if (!path) {
    path = '/'
  }
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  const items = path.split('/')
  //remove last element
  items.pop()

  return '/' + items.join('/')
}

export const normalizedPath = path => path?.replace(/\/+/g, '/')

export const generateRandomString = (length = 5) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export function hexStringToByte(str) {
  if (!str) return new Uint8Array()

  const a = []
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16))
  }

  return new Uint8Array(a)
}

export const copyTextValue = value => {
  const textArea = document.createElement('textarea')
  textArea.value = value

  document.body.appendChild(textArea)
  textArea.select()

  document.execCommand('copy')
  textArea.remove()
}

export const splitFileExtention = fileName => {
  const split = fileName.split('.')
  const name = split.slice(0, split.length - 1).join('.')
  const extension = split[split.length - 1]

  return { name, extension }
}

export function safeParseJSON(str) {
  if (typeof str !== 'string')
    return { error: `Provided 'json' data is not a string` }

  try {
    const json = JSON.parse(str)

    return { json }
  } catch (error) {
    console.error(error)

    return { error }
  }
}


export const getTransactionAmount = txn => {
  const getTransactionOuput = txn => {
    if (txn.transaction_output) {
      const { error, json: transactionOutput } = safeParseJSON(
        txn.transaction_output
      )

      if (error) {
        return 0
      }

      return transactionOutput && transactionOutput.amount
        ? transactionOutput.amount
        : 0
    } else {
      return txn.value ? txn.value : txn.transaction_value
    }
  }

  if (txn.transaction_type === zcnTxnRequestTypes.SMART_CONTRACT) {
    const transactionType = JSON.parse(txn.transaction_data)
    if (txn.to_client_id === zcnContracts.dexMintAddress) {
      if (transactionType?.input?.amount) {
        return transactionType?.input?.amount
      } else {
        return getTransactionOuput(txn)
      }
    } else if (transactionType?.name === 'collect_reward') {
      return getTransactionOuput(txn)
    } else {
      return txn.value ? txn.value : txn.transaction_value
    }
  } else {
    return txn.value ? txn.value : txn.transaction_value
  }
}

export const formatUUIDAddress = (value = '', len = 16, flag = true) => {
  if (value.length <= len) return value
  if (!flag) {
    return value.substring(0, len).concat('...')
  } else {
    return value
      .substring(0, 8)
      .concat('...')
      .concat(value.substring(value.length - 8))
  }
}