export enum TicketStatus {
  CREATED = 'CREATED',
  AGENT_RUNNING = 'AGENT_RUNNING',
  WAITING_USER_INFO = 'WAITING_USER_INFO',
  WAITING_HUMAN_APPROVAL = 'WAITING_HUMAN_APPROVAL',
  PROCESSING = 'PROCESSING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
  FAILED = 'FAILED',
}

export enum IntentType {
  MULTI_INTENT = 'MULTI_INTENT',
  REFUND_ONLY = 'REFUND_ONLY',
  RETURN_AND_REFUND = 'RETURN_AND_REFUND',
  EXCHANGE = 'EXCHANGE',
  REPAIR = 'REPAIR',
  LOGISTICS_ISSUE = 'LOGISTICS_ISSUE',
  GENERAL_CONSULTATION = 'GENERAL_CONSULTATION',
  UNKNOWN = 'UNKNOWN',
}

export interface TicketResponse {
  ticketId: string
  userId: string
  orderId: string
  rawUserMessage: string
  intentType: IntentType
  priority: string
  status: TicketStatus
  internalNote: string | null
  agentSuggestion: string | null
  createdAt: string
  updatedAt: string
}

export interface TicketCreateRequest {
  userId: string
  orderId: string
  message: string
}

export interface TicketListParams {
  page?: number
  size?: number
  sort?: string
  status?: TicketStatus
  userId?: string
  orderId?: string
  intentType?: IntentType
  createdFrom?: string
  createdTo?: string
}

/** Maps TicketStatus to Element Plus el-tag type for display. */
export function ticketStatusTagType(status: TicketStatus): 'info' | 'warning' | 'primary' | 'danger' | 'success' {
  switch (status) {
    case TicketStatus.CREATED: return 'info'
    case TicketStatus.AGENT_RUNNING: return 'warning'
    case TicketStatus.PROCESSING: return 'warning'
    case TicketStatus.WAITING_USER_INFO: return 'primary'
    case TicketStatus.WAITING_HUMAN_APPROVAL: return 'danger'
    case TicketStatus.RESOLVED: return 'success'
    case TicketStatus.REJECTED: return 'danger'
    case TicketStatus.FAILED: return 'danger'
    case TicketStatus.CLOSED: return 'info'
    default: return 'info'
  }
}
