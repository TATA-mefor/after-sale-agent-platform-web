import { describe, it, expect } from 'vitest'
import { riskLevelTagType, ToolRiskLevel } from '@/types/approval'

describe('Risk level tag', () => {
  it('LOW → success', () => expect(riskLevelTagType(ToolRiskLevel.LOW)).toBe('success'))
  it('MEDIUM → warning', () => expect(riskLevelTagType(ToolRiskLevel.MEDIUM)).toBe('warning'))
  it('HIGH → danger', () => expect(riskLevelTagType(ToolRiskLevel.HIGH)).toBe('danger'))
  it('unknown → info', () => {
    expect(riskLevelTagType('UNKNOWN' as ToolRiskLevel)).toBe('info')
  })
})
