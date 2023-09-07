export const selectActiveAllocation = state => {
  const { list = [], activeAllocationId = '' } = state.allocation

  return list.find(allocation => allocation.id === activeAllocationId) || {}
}

export const selectActiveAllocationId = state =>
  state.allocation.activeAllocationId
