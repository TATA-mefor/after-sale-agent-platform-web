import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApprovalRequestResponse, ApprovalActionRequest } from '@/types/approval'
import type { TicketResponse } from '@/types/ticket'
import { fetchPendingApprovals, approveApproval, rejectApproval } from '@/api/approvals'
import { fetchTicket } from '@/api/tickets'

export interface EnrichedApproval extends ApprovalRequestResponse {
  userId?: string
  orderId?: string
  userMessage?: string
}

export const useApprovalStore = defineStore('approval', () => {
  const pending = ref<EnrichedApproval[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const pendingCount = computed(() => pending.value.length)

  async function loadPending() {
    loading.value = true
    error.value = null
    try {
      const approvals = await fetchPendingApprovals()
      // 并行获取每个审批对应的工单信息
      pending.value = await Promise.all(
        approvals.map(async (a) => {
          try {
            const ticket: TicketResponse = await fetchTicket(a.ticketId)
            return { ...a, userId: ticket.userId, orderId: ticket.orderId, userMessage: ticket.rawUserMessage }
          } catch {
            return { ...a }
          }
        })
      )
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function remove(approvalRequestId: string) {
    pending.value = pending.value.filter(r => r.approvalRequestId !== approvalRequestId)
  }

  async function approve(id: string, data: ApprovalActionRequest): Promise<boolean> {
    try {
      await approveApproval(id, data)
      remove(id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Approve failed'
      return false
    }
  }

  async function reject(id: string, data: ApprovalActionRequest): Promise<boolean> {
    try {
      await rejectApproval(id, data)
      remove(id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Reject failed'
      return false
    }
  }

  return { pending, loading, error, pendingCount, loadPending, remove, approve, reject }
})
