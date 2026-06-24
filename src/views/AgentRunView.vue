<template>
  <div>
    <el-page-header @back="router.push(`/tickets/${status?.ticketId}`)" :title="`返回工单 ${status?.ticketId || ''}`">
      <template #content>Agent 执行 #{{ runId }}</template>
    </el-page-header>

    <div v-if="error" style="margin-top:20px">
      <el-alert type="error" :title="error" show-icon :closable="false" />
    </div>

    <template v-if="status">
      <el-tabs v-model="activeTab" style="margin-top:20px">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Run ID">{{ status.runId }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <AgentRunStatusTag :status="status.status" />
              <span v-if="status.status === 'RUNNING' || status.status === 'PENDING'" style="margin-left:8px">
                <el-icon class="is-loading"><Loading /></el-icon>
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="工单 ID">
              <el-link type="primary" @click="router.push(`/tickets/${status.ticketId}`)">{{ status.ticketId }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="开始时间">{{ formatDate(status.startedAt) }}</el-descriptions-item>
            <el-descriptions-item v-if="status.completedAt" label="完成时间">{{ formatDate(status.completedAt) }}</el-descriptions-item>
            <el-descriptions-item v-if="status.finalSummary" label="最终摘要" :span="2">
              {{ status.finalSummary }}
            </el-descriptions-item>
            <el-descriptions-item v-if="status.failureSummary" label="失败原因" :span="2">
              <span style="color:#f56c6c">{{ status.failureSummary }}</span>
            </el-descriptions-item>
          </el-descriptions>

          <div style="margin-top:16px">
            <el-button v-if="status.traceAvailable" type="primary" @click="router.push(`/agent-runs/${runId}/execution-tree`)">
              查看执行树
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="工具调用轨迹" name="traces">
          <TraceTimeline :traces="traces" />
        </el-tab-pane>

        <el-tab-pane label="政策证据" name="policy">
          <PolicyEvidence :traces="traces" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAgentRunStatus, fetchTraces } from '@/api/agentRuns'
import { isTerminal } from '@/types/agent'
import type { AgentRunStatusResponse } from '@/types/agent'
import type { ToolCallTraceResponse } from '@/types/trace'
import AgentRunStatusTag from '@/components/agent/AgentRunStatusTag.vue'
import TraceTimeline from '@/components/agent/TraceTimeline.vue'
import PolicyEvidence from '@/components/agent/PolicyEvidence.vue'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const runId = route.params.runId as string

const status = ref<AgentRunStatusResponse | null>(null)
const traces = ref<ToolCallTraceResponse[]>([])
const error = ref<string | null>(null)
const activeTab = ref('basic')

let pollTimer: ReturnType<typeof setInterval> | null = null

async function poll() {
  try {
    status.value = await fetchAgentRunStatus(runId)
    if (isTerminal(status.value.status)) {
      stopPolling()
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
    stopPolling()
  }
}

function startPolling() {
  poll()
  pollTimer = setInterval(poll, 3000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

// Load traces when user switches to traces or policy tab
watch(activeTab, async (tab) => {
  if ((tab === 'traces' || tab === 'policy') && !traces.value.length) {
    try {
      traces.value = await fetchTraces(runId)
    } catch { /* ignore */ }
  }
})

function formatDate(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD HH:mm:ss')
}
</script>
