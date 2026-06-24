import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTicketStore } from '../ticketStore'

describe('ticketStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has initial filters with page 0, size 20', () => {
    const store = useTicketStore()
    expect(store.filters.page).toBe(0)
    expect(store.filters.size).toBe(20)
    expect(store.filters.sort).toBe('createdAt,desc')
  })

  it('setPage updates page', () => {
    const store = useTicketStore()
    store.setPage(3)
    expect(store.filters.page).toBe(3)
  })

  it('setFilters updates filters and resets page', () => {
    const store = useTicketStore()
    store.filters.page = 5
    store.setFilters({ status: 'CREATED' } as any)
    expect(store.filters.page).toBe(0)
    // status should be filtered
  })

  it('reset returns to initial state', () => {
    const store = useTicketStore()
    store.filters.page = 10
    store.reset()
    expect(store.filters.page).toBe(0)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })
})
