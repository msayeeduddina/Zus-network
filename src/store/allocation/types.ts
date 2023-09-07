import { createActionTypes } from 'lib'
import { Types } from 'store/api-utils'

export const CREATE_ALLOCATION = 'CREATE_ALLOCATION'
export const LIST_ALLOCATIONS = 'LIST_ALLOCATIONS'

export const types: Types = createActionTypes([
  CREATE_ALLOCATION,
  LIST_ALLOCATIONS,
])

export type AllocationState = {
  list: any[]
  activeAllocationId: string
}

export default types
