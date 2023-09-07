export const getBls = async () => {
  // @ts-ignore
  const bls = window.bls

  if (!bls?.mod?.calledRun) await bls?.init(bls.BN254)

  return bls
}
