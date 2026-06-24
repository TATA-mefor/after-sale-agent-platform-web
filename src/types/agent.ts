import type { IntentType } from './ticket'

export enum AgentRunStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface AgentRunResponse {
  runId: string
  ticketId: string
  status: AgentRunStatus
  intent: IntentType
  plan: string
  finalSuggestion: string
  evidence: string[]
  toolCalls: string[]
  errorMessage: string | null
  startedAt: string
  finishedAt: string | null
}

export interface AgentRunStatusResponse {
  runId: string
  ticketId: string
  status: AgentRunStatus
  startedAt: string
  completedAt: string | null
  finalSummary: string
  failureSummary: string | null
  traceAvailable: boolean
  executionTreeAvailable: boolean
  traceUrl: string
  executionTreeUrl: string
}

/** Returns true if the status is terminal (polling should stop). */
export function isTerminal(status: AgentRunStatus): boolean {
  return [AgentRunStatus.SUCCEEDED, AgentRunStatus.FAILED, AgentRunStatus.CANCELLED].includes(status)
}

export function agentRunStatusTagType(status: AgentRunStatus): 'info' | 'warning' | 'success' | 'danger' {
  switch (status) {
    case AgentRunStatus.PENDING: return 'info'
    case AgentRunStatus.RUNNING: return 'warning'
    case AgentRunStatus.SUCCEEDED: return 'success'
    case AgentRunStatus.FAILED: return 'danger'
    case AgentRunStatus.CANCELLED: return 'danger'
    default: return 'info'
  }
}
