export const tokenToZcn = (token: number = 0): number =>
  parseFloat((token / Math.pow(10, 10)).toString())

export const zcnToToken = (zcn = 0) => parseFloat((zcn * Math.pow(10, 10)).toString())