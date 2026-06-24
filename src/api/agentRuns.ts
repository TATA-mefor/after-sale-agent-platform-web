import httpClient, { unwrap } from './client'
import type { ApiResponse } from '@/types/api'
import type { AgentRunStatusResponse } from '@/types/agent'
import type { ToolCallTraceResponse } from '@/types/trace'
import type { ExecutionTreeResponse } from '@/types/executionTree'

export async function fetchAgentRunStatus(runId: string): Promise<AgentRunStatusResponse> {
  const resp = await httpClient.get<ApiResponse<AgentRunStatusResponse>>(`/agent-runs/${runId}`)
  return unwrap(resp)
}

export async function fetchTraces(runId: string): Promise<ToolCallTraceResponse[]> {
  const resp = await httpClient.get<ApiResponse<ToolCallTraceResponse[]>>(`/agent-runs/${runId}/traces`)
  return unwrap(resp)
}

export async function fetchExecutionTree(runId: string): Promise<ExecutionTreeResponse> {
  const resp = await httpClient.get<ApiResponse<ExecutionTreeResponse>>(`/agent-runs/${runId}/execution-tree`)
  return unwrap(resp)
}
