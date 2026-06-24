import { describe, it, expect } from 'vitest'
import { agentRunStatusTagType, AgentRunStatus } from '@/types/agent'

describe('AgentRunStatusTag', () => {
  it('PENDING → info', () => expect(agentRunStatusTagType(AgentRunStatus.PENDING)).toBe('info'))
  it('RUNNING → warning', () => expect(agentRunStatusTagType(AgentRunStatus.RUNNING)).toBe('warning'))
  it('SUCCEEDED → success', () => expect(agentRunStatusTagType(AgentRunStatus.SUCCEEDED)).toBe('success'))
  it('FAILED → danger', () => expect(agentRunStatusTagType(AgentRunStatus.FAILED)).toBe('danger'))
  it('CANCELLED → danger', () => expect(agentRunStatusTagType(AgentRunStatus.CANCELLED)).toBe('danger'))
  it('unknown → info', () => {
    expect(agentRunStatusTagType('UNKNOWN' as AgentRunStatus)).toBe('info')
  })
})
