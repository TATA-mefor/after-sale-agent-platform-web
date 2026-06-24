<template>
  <div>
    <el-page-header @back="router.push(`/agent-runs/${runId}`)" title="返回 Agent 执行">
      <template #content>执行树 #{{ runId }}</template>
    </el-page-header>

    <div v-if="error" style="margin-top:20px">
      <el-alert type="error" :title="error" show-icon :closable="false" />
    </div>

    <div v-if="!loading && !error && !tree" style="margin-top:20px">
      <EmptyState description="暂无执行树数据" />
    </div>

    <el-card v-if="tree" style="margin-top:20px">
      <template #header>执行概况</template>
      <p><strong>最终建议：</strong>{{ tree.finalSuggestion || '(无)' }}</p>
      <p><strong>状态：</strong><AgentRunStatusTag :status="tree.agentRunStatus" /></p>
      <p v-if="tree.errors.length" style="color:#f56c6c"><strong>错误：</strong>{{ tree.errors.join('; ') }}</p>
    </el-card>

    <el-card v-if="tree && tree.subtasks.length" style="margin-top:16px">
      <template #header>子任务结构</template>
      <div class="tree-root">
        <div v-for="subtask in tree.subtasks" :key="subtask.subtaskId" class="tree-subtask">
          <div class="tree-node node-subtask">
            <el-tag :type="subtask.riskLevel === 'HIGH' ? 'danger' : subtask.riskLevel === 'MEDIUM' ? 'warning' : 'success'" size="small">
              {{ subtask.type }}
            </el-tag>
            <span>{{ subtask.target || subtask.subtaskId }}</span>
            <el-tag size="small" type="info">{{ subtask.status }}</el-tag>
          </div>
          <div class="tree-children">
            <div v-for="tc in subtask.toolCalls" :key="tc.traceId" class="tree-node node-tool">
              <el-icon><Cpu /></el-icon>
              <span>{{ tc.toolName }}</span>
              <el-tag :type="tc.status === 'SUCCEEDED' ? 'success' : 'danger'" size="small">{{ tc.status }}</el-tag>
              <span style="color:#909399;font-size:12px">{{ tc.latencyMs }}ms</span>
            </div>
            <div v-for="ev in subtask.policyEvidence" :key="ev.evidenceId" class="tree-node node-evidence">
              <el-icon><Document /></el-icon>
              <span style="font-size:13px">{{ ev.documentTitle || ev.category }}</span>
              <span v-if="ev.score !== null" style="color:#909399;font-size:12px">score: {{ ev.score?.toFixed(2) }}</span>
            </div>
            <div v-for="ap in subtask.approvalRequests" :key="ap.approvalRequestId" class="tree-node node-approval">
              <el-icon><Stamp /></el-icon>
              <span>{{ ap.reason }}</span>
              <el-tag :type="ap.status === 'APPROVED' ? 'success' : ap.status === 'REJECTED' ? 'danger' : 'warning'" size="small">
                {{ ap.status }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="tree && !tree.subtasks.length && tree.toolCalls.length" style="margin-top:16px">
      <template #header>工具调用（无子任务）</template>
      <!-- eslint-disable-next-line --> <TraceTimeline :traces="(tree!).toolCalls.map(tc => ({
        traceId: tc.traceId,
        runId: (tree!).runId,
        toolName: tc.toolName,
        inputJson: tc.inputJson,
        outputJson: tc.outputJson,
        status: tc.status,
        latencyMs: tc.latencyMs,
        errorMessage: tc.errorMessage,
        createdAt: tc.createdAt,
      }))" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchExecutionTree } from '@/api/agentRuns'
import type { ExecutionTreeResponse } from '@/types/executionTree'
import AgentRunStatusTag from '@/components/agent/AgentRunStatusTag.vue'
import TraceTimeline from '@/components/agent/TraceTimeline.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const runId = route.params.runId as string

const tree = ref<ExecutionTreeResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    tree.value = await fetchExecutionTree(runId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载执行树失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tree-root { padding: 8px 0; }
.tree-subtask { margin-bottom: 16px; border-left: 3px solid #409eff; padding-left: 16px; }
.tree-node { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
.node-subtask { font-weight: bold; }
.node-tool { margin-left: 20px; }
.node-evidence { margin-left: 20px; color: #67c23a; }
.node-approval { margin-left: 20px; }
</style>
