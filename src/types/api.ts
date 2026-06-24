/** Generic API response wrapper from backend. /api/health is the only unwrapped endpoint. */
export interface ApiResponse<T> {
  code: string       // "SUCCESS" | "NOT_FOUND" | "INVALID_REQUEST" | "CONFLICT"
  message: string
  data: T | null
}

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  sort: string
}
