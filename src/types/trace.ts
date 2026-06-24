export enum ToolCallStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  REQUIRES_APPROVAL = 'REQUIRES_APPROVAL',
}

export interface ToolCallTraceResponse {
  traceId: string
  runId: string
  toolName: string
  inputJson: string
  outputJson: string
  status: ToolCallStatus
  latencyMs: number
  errorMessage: string | null
  createdAt: string
}

export function toolCallStatusTagType(status: ToolCallStatus): 'success' | 'danger' | 'warning' | 'info' {
  switch (status) {
    case ToolCallStatus.SUCCEEDED: return 'success'
    case ToolCallStatus.FAILED: return 'danger'
    case ToolCallStatus.RUNNING: return 'warning'
    case ToolCallStatus.PENDING: return 'info'
    case ToolCallStatus.SKIPPED: return 'info'
    case ToolCallStatus.REQUIRES_APPROVAL: return 'warning'
    default: return 'info'
  }
}
