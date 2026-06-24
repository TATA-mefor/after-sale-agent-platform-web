import httpClient, { unwrap } from './client'
import type { ApiResponse } from '@/types/api'
import type { ApprovalRequestResponse, ApprovalActionRequest } from '@/types/approval'

export async function fetchPendingApprovals(): Promise<ApprovalRequestResponse[]> {
  const resp = await httpClient.get<ApiResponse<ApprovalRequestResponse[]>>('/approval-requests/pending')
  return unwrap(resp)
}

export async function fetchApproval(id: string): Promise<ApprovalRequestResponse> {
  const resp = await httpClient.get<ApiResponse<ApprovalRequestResponse>>(`/approval-requests/${id}`)
  return unwrap(resp)
}

export async function approveApproval(id: string, data: ApprovalActionRequest): Promise<ApprovalRequestResponse> {
  const resp = await httpClient.post<ApiResponse<ApprovalRequestResponse>>(`/approval-requests/${id}/approve`, data)
  return unwrap(resp)
}

export async function rejectApproval(id: string, data: ApprovalActionRequest): Promise<ApprovalRequestResponse> {
  const resp = await httpClient.post<ApiResponse<ApprovalRequestResponse>>(`/approval-requests/${id}/reject`, data)
  return unwrap(resp)
}
