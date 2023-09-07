import sha3 from 'js-sha3'

import { getBls, hexStringToByte } from 'lib/utils'

export async function getTxnSignature(asset, privateKey) {
  const hexHash = sha3.sha3_256(asset)
  const bytehash = hexStringToByte(hexHash)

  const bls = await getBls()
  const sec = new bls.SecretKey()

  sec.deserializeHexStr(privateKey)
  const sig = sec.sign(bytehash)

  return sig.serializeToHexStr()
}
