export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum ToolRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ApprovalRequestResponse {
  approvalRequestId: string
  ticketId: string
  agentRunId: string
  subtaskId: string | null
  toolName: string
  requestedAction: string
  riskLevel: ToolRiskLevel
  status: ApprovalStatus
  reviewerId: string | null
  decisionReason: string | null
  requestedAt: string
  reviewedAt: string | null
}

export interface ApprovalActionRequest {
  reviewerId: string
  reason: string
}

export function riskLevelTagType(risk: ToolRiskLevel): 'success' | 'warning' | 'danger' | 'info' {
  switch (risk) {
    case ToolRiskLevel.LOW: return 'success'
    case ToolRiskLevel.MEDIUM: return 'warning'
    case ToolRiskLevel.HIGH: return 'danger'
    default: return 'info'
  }
}

export function approvalStatusTagType(status: ApprovalStatus): 'warning' | 'success' | 'danger' | 'info' {
  switch (status) {
    case ApprovalStatus.PENDING: return 'warning'
    case ApprovalStatus.APPROVED: return 'success'
    case ApprovalStatus.REJECTED: return 'danger'
    case ApprovalStatus.CANCELLED: return 'danger'
    default: return 'info'
  }
}
