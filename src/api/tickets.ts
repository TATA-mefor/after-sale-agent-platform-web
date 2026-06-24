import httpClient, { unwrap } from './client'
import type { ApiResponse, PageResponse } from '@/types/api'
import type { TicketResponse, TicketCreateRequest, TicketListParams } from '@/types/ticket'
import type { AgentRunResponse } from '@/types/agent'

export async function fetchTickets(params: TicketListParams): Promise<PageResponse<TicketResponse>> {
  const resp = await httpClient.get<ApiResponse<PageResponse<TicketResponse>>>('/tickets', { params })
  return unwrap(resp)
}

export async function fetchTicket(ticketId: string): Promise<TicketResponse> {
  const resp = await httpClient.get<ApiResponse<TicketResponse>>(`/tickets/${ticketId}`)
  return unwrap(resp)
}

export async function createTicket(data: TicketCreateRequest): Promise<TicketResponse> {
  const resp = await httpClient.post<ApiResponse<TicketResponse>>('/tickets', data)
  return unwrap(resp)
}

export async function triggerAgentRun(ticketId: string): Promise<AgentRunResponse> {
  const resp = await httpClient.post<ApiResponse<AgentRunResponse>>(`/tickets/${ticketId}/agent-runs`)
  return unwrap(resp)
}

export async function deleteTicket(ticketId: string): Promise<void> {
  await httpClient.delete(`/tickets/${ticketId}`)
}
