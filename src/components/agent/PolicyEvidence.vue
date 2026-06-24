<template>
  <div v-if="evidences.length" class="policy-evidence-list">
    <el-card
      v-for="(evidence, idx) in evidences"
      :key="idx"
      class="evidence-card"
      shadow="hover"
    >
      <div class="evidence-snippet">{{ evidence.snippet }}</div>
      <div class="evidence-meta">
        <el-tag size="small" :type="modeTagType(evidence.retrievalMode)">
          {{ evidence.retrievalMode || '未知模式' }}
        </el-tag>
        <el-progress
          v-if="evidence.score != null"
          :percentage="Math.round(evidence.score * 100)"
          :stroke-width="8"
          :color="scoreColor(evidence.score)"
          style="flex:1;min-width:120px"
        />
        <span v-if="evidence.documentTitle" class="evidence-source">{{ evidence.documentTitle }}</span>
      </div>
    </el-card>
  </div>
  <EmptyState v-else description="未检索到政策证据" />
</template>

<script setup lang="ts">
import type { ToolCallTraceResponse } from '@/types/trace'
import EmptyState from '@/components/common/EmptyState.vue'

interface PolicyEvidence {
  snippet: string
  retrievalMode: string
  score: number | null
  documentTitle?: string
}

const props = defineProps<{ traces: ToolCallTraceResponse[] }>()

/** Extract policy evidences from search_aftersale_policy tool call traces. */
function extractEvidences(traces: ToolCallTraceResponse[]): PolicyEvidence[] {
  const results: PolicyEvidence[] = []
  for (const trace of traces) {
    if (trace.toolName !== 'search_aftersale_policy') continue
    try {
      const output = typeof trace.outputJson === 'string'
        ? JSON.parse(trace.outputJson)
        : trace.outputJson
      const evs = output?.evidences
      if (Array.isArray(evs)) {
        for (const ev of evs) {
          results.push({
            snippet: ev.snippet || ev.text || '',
            retrievalMode: ev.retrievalMode || ev.mode || '',
            score: typeof ev.score === 'number' ? ev.score : null,
            documentTitle: ev.documentTitle || ev.title || undefined,
          })
        }
      }
    } catch { /* skip unparseable output */ }
  }
  return results
}

const evidences = extractEvidences(props.traces)

function modeTagType(mode: string): 'success' | 'warning' | 'info' | 'danger' {
  const m = mode.toLowerCase()
  if (m.includes('semantic') || m.includes('dense')) return 'success'
  if (m.includes('keyword') || m.includes('sparse') || m.includes('bm25')) return 'info'
  if (m.includes('hybrid')) return 'warning'
  return 'info'
}

function scoreColor(score: number): string {
  if (score >= 0.8) return '#67c23a'
  if (score >= 0.5) return '#e6a23c'
  return '#f56c6c'
}
</script>

<style scoped>
.policy-evidence-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evidence-card {
  margin-bottom: 0;
}

.evidence-snippet {
  font-size: 14px;
  line-height: 1.7;
  color: #303133;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.evidence-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.evidence-source {
  font-size: 12px;
  color: #909399;
}
</style>
