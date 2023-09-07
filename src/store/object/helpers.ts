export const addPropToObject = ({
  objectPayload,
  allocationId,
  lookupHash,
  state,
}) => {
  const allocationObject = { ...state.allocationsFilesMap[allocationId] }

  allocationObject[lookupHash] = {
    ...allocationObject[lookupHash],
    ...objectPayload,
  }

  return {
    ...state.allocationsFilesMap,
    [allocationId]: allocationObject,
  }
}

export const isAllocationDisabled = allocation => {
  const disabledAllocation =
    !allocation ||
    allocation?.canceled ||
    allocation?.finalized ||
    allocation?.expiration_date < new Date().getTime() / 1000

  return disabledAllocation
}
