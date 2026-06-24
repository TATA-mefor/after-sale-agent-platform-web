import { describe, it, expect } from 'vitest'
import { isTerminal, AgentRunStatus } from '@/types/agent'

describe('AgentRuns API contract', () => {
  it('fetchAgentRunStatus exists', async () => {
    const { fetchAgentRunStatus } = await import('../agentRuns')
    expect(fetchAgentRunStatus).toBeDefined()
  })

  it('fetchTraces exists', async () => {
    const { fetchTraces } = await import('../agentRuns')
    expect(fetchTraces).toBeDefined()
  })

  it('fetchExecutionTree exists', async () => {
    const { fetchExecutionTree } = await import('../agentRuns')
    expect(fetchExecutionTree).toBeDefined()
  })
})

describe('isTerminal', () => {
  it('returns true for SUCCEEDED', () => expect(isTerminal(AgentRunStatus.SUCCEEDED)).toBe(true))
  it('returns true for FAILED', () => expect(isTerminal(AgentRunStatus.FAILED)).toBe(true))
  it('returns true for CANCELLED', () => expect(isTerminal(AgentRunStatus.CANCELLED)).toBe(true))
  it('returns false for RUNNING', () => expect(isTerminal(AgentRunStatus.RUNNING)).toBe(false))
  it('returns false for PENDING', () => expect(isTerminal(AgentRunStatus.PENDING)).toBe(false))
})
