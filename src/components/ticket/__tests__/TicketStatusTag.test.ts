import { describe, it, expect } from 'vitest'
import { ticketStatusTagType, TicketStatus } from '@/types/ticket'

describe('TicketStatusTag', () => {
  it('CREATED → info', () => expect(ticketStatusTagType(TicketStatus.CREATED)).toBe('info'))
  it('AGENT_RUNNING → warning', () => expect(ticketStatusTagType(TicketStatus.AGENT_RUNNING)).toBe('warning'))
  it('PROCESSING → warning', () => expect(ticketStatusTagType(TicketStatus.PROCESSING)).toBe('warning'))
  it('WAITING_USER_INFO → primary', () => expect(ticketStatusTagType(TicketStatus.WAITING_USER_INFO)).toBe('primary'))
  it('WAITING_HUMAN_APPROVAL → danger', () => expect(ticketStatusTagType(TicketStatus.WAITING_HUMAN_APPROVAL)).toBe('danger'))
  it('RESOLVED → success', () => expect(ticketStatusTagType(TicketStatus.RESOLVED)).toBe('success'))
  it('REJECTED → danger', () => expect(ticketStatusTagType(TicketStatus.REJECTED)).toBe('danger'))
  it('FAILED → danger', () => expect(ticketStatusTagType(TicketStatus.FAILED)).toBe('danger'))
  it('CLOSED → info', () => expect(ticketStatusTagType(TicketStatus.CLOSED)).toBe('info'))
  it('unknown status → info fallback', () => {
    expect(ticketStatusTagType('UNKNOWN_STATUS' as TicketStatus)).toBe('info')
  })
})
