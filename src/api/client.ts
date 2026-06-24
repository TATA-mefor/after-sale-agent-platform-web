import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/api'

const httpClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_API_KEY
      ? { 'X-API-Key': import.meta.env.VITE_API_KEY }
      : {}),
  },
})

// Response interceptor: check ApiResponse.code + global error toast
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data
    // /api/health returns unwrapped { status, service } — no code field
    if (body && typeof body === 'object' && 'code' in body && body.code !== 'SUCCESS') {
      const msg = body.message || 'Request failed'
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    }
    return response
  },
  (error) => {
    let msg: string
    if (error.response) {
      const body = error.response.data as ApiResponse<unknown>
      msg = body?.message || `HTTP ${error.response.status}`
    } else {
      msg = 'Network error: no response from server'
    }
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  },
)

/** Unwrap ApiResponse<T> data field. Skips unwrap for /api/health which has no ApiResponse wrapper. */
export function unwrap<T>(response: AxiosResponse<ApiResponse<T>> | AxiosResponse<T>): T {
  const body = response.data
  if (body && typeof body === 'object' && 'code' in body && 'data' in body) {
    return (body as ApiResponse<T>).data as T
  }
  return body as T
}

export function isHealthResponse(body: unknown): body is { status: string; service: string } {
  return typeof body === 'object' && body !== null && 'status' in body && 'service' in body && !('code' in body)
}

export default httpClient
