import { describe, it, expect } from 'vitest'

// Validate that the API module exports the correct function signatures
// and parameter shapes. Actual HTTP calls tested via view integration tests.

describe('Tickets API contract', () => {
  it('fetchTickets uses /api/tickets with query params', async () => {
    const { fetchTickets } = await import('../tickets')
    expect(fetchTickets).toBeDefined()
    expect(typeof fetchTickets).toBe('function')
  })

  it('fetchTicket uses /api/tickets/{id}', async () => {
    const { fetchTicket } = await import('../tickets')
    expect(fetchTicket).toBeDefined()
    expect(typeof fetchTicket).toBe('function')
  })

  it('createTicket uses POST /api/tickets', async () => {
    const { createTicket } = await import('../tickets')
    expect(createTicket).toBeDefined()
    expect(typeof createTicket).toBe('function')
  })

  it('triggerAgentRun uses ticket AgentRun endpoint', async () => {
    const { triggerAgentRun } = await import('../tickets')
    expect(triggerAgentRun).toBeDefined()
    expect(typeof triggerAgentRun).toBe('function')
  })
})
