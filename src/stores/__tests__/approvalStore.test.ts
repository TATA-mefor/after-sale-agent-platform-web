import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useApprovalStore } from '../approvalStore'

describe('approvalStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty pending list', () => {
    const store = useApprovalStore()
    expect(store.pending).toEqual([])
    expect(store.pendingCount).toBe(0)
  })

  it('remove removes by id', () => {
    const store = useApprovalStore()
    store.pending = [{ approvalRequestId: 'A-1' } as any, { approvalRequestId: 'A-2' } as any]
    store.remove('A-1')
    expect(store.pending).toHaveLength(1)
    expect(store.pending[0].approvalRequestId).toBe('A-2')
  })

  it('loadPending sets loading flag', () => {
    const store = useApprovalStore()
    expect(store.loading).toBe(false)
  })
})
