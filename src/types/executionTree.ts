import type { AgentRunStatus } from './agent'
import type { ToolCallStatus } from './trace'
import type { ApprovalStatus } from './approval'

export interface ExecutionTreeToolCallNode {
  traceId: string
  toolName: string
  status: ToolCallStatus
  latencyMs: number
  inputJson: string
  outputJson: string
  errorMessage: string | null
  createdAt: string
}

export interface ExecutionTreePolicyEvidenceNode {
  evidenceId: string
  policyId: string
  documentId: string
  chunkId: string
  documentTitle: string
  category: string
  productType: string
  snippet: string
  score: number | null
  retrievalMode: string
  source: string
  subtaskId: string
  toolCallId: string
}

export interface ExecutionTreeApprovalNode {
  approvalRequestId: string
  status: ApprovalStatus
  reason: string
  decisionReason: string | null
  createdAt: string
  decidedAt: string | null
}

export interface ExecutionTreeSubtaskNode {
  subtaskId: string
  type: string
  target: string
  priority: number
  riskLevel: string
  status: string
  summary: string
  toolCalls: ExecutionTreeToolCallNode[]
  policyEvidence: ExecutionTreePolicyEvidenceNode[]
  approvalRequests: ExecutionTreeApprovalNode[]
}

export interface ExecutionTreeResponse {
  runId: string
  ticketId: string
  agentRunStatus: AgentRunStatus
  finalSuggestion: string
  rootSummary: string
  subtasks: ExecutionTreeSubtaskNode[]
  toolCalls: ExecutionTreeToolCallNode[]
  policyEvidence: ExecutionTreePolicyEvidenceNode[]
  approvalRequests: ExecutionTreeApprovalNode[]
  errors: string[]
  createdAt: string
  finishedAt: string | null
}
