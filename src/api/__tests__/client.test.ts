import { describe, it, expect, vi, beforeEach } from 'vitest'
import httpClient, { unwrap, isHealthResponse } from '../client'
import type { ApiResponse } from '@/types/api'

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('isHealthResponse', () => {
    it('returns true for health response shape', () => {
      expect(isHealthResponse({ status: 'UP', service: 'test' })).toBe(true)
    })

    it('returns false for ApiResponse shape', () => {
      expect(isHealthResponse({ code: 'SUCCESS', message: 'ok', data: {} })).toBe(false)
    })

    it('returns false for plain object', () => {
      expect(isHealthResponse({ foo: 'bar' })).toBe(false)
    })
  })

  describe('unwrap', () => {
    it('unwraps ApiResponse data field', () => {
      const resp = { data: { code: 'SUCCESS', message: 'ok', data: { ticketId: 'T-1' } } } as any
      expect(unwrap(resp)).toEqual({ ticketId: 'T-1' })
    })

    it('passes through non-ApiResponse body', () => {
      const resp = { data: { status: 'UP', service: 'test' } } as any
      expect(unwrap(resp)).toEqual({ status: 'UP', service: 'test' })
    })
  })

  describe('httpClient config', () => {
    it('has correct baseURL', () => {
      expect(httpClient.defaults.baseURL).toBe('/api')
    })

    it('has default Content-Type header', () => {
      expect(httpClient.defaults.headers['Content-Type']).toBe('application/json')
    })
  })
})
