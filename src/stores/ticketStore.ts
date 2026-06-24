import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TicketResponse, TicketListParams, TicketStatus } from '@/types/ticket'
import type { PageResponse } from '@/types/api'
import { fetchTickets } from '@/api/tickets'

export const useTicketStore = defineStore('ticket', () => {
  const pageResponse = ref<PageResponse<TicketResponse> | null>(null)
  const filters = ref<TicketListParams>({ page: 0, size: 20, sort: 'createdAt,desc' })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const tickets = computed(() => pageResponse.value?.items ?? [])

  async function loadTickets() {
    loading.value = true
    error.value = null
    try {
      pageResponse.value = await fetchTickets(filters.value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    filters.value.page = page
    loadTickets()
  }

  function setFilters(partial: Partial<TicketListParams>) {
    filters.value = { ...filters.value, ...partial, page: 0 }
    loadTickets()
  }

  /** Fetch ticket count for a specific status. Returns totalElements. */
  async function fetchStatusCount(status: TicketStatus): Promise<number> {
    try {
      const page = await fetchTickets({ page: 0, size: 1, status })
      return page.totalElements
    } catch {
      return 0
    }
  }

  function reset() {
    pageResponse.value = null
    filters.value = { page: 0, size: 20, sort: 'createdAt,desc' }
    loading.value = false
    error.value = null
  }

  return { pageResponse, filters, loading, error, tickets, loadTickets, setPage, setFilters, fetchStatusCount, reset }
})
