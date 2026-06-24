<template>
  <el-timeline v-if="traces.length">
    <el-timeline-item
      v-for="trace in traces"
      :key="trace.traceId"
      :timestamp="`${trace.latencyMs}ms`"
      :type="trace.status === 'SUCCEEDED' ? 'success' : trace.status === 'FAILED' ? 'danger' : 'info'"
      placement="top"
    >
      <el-card shadow="hover">
        <template #header>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span>{{ trace.toolName }}</span>
            <el-tag :type="toolCallStatusTagType(trace.status)" size="small">{{ trace.status }}</el-tag>
          </div>
        </template>
        <el-collapse>
          <el-collapse-item title="输入">
            <JsonViewer :data="trace.inputJson" />
          </el-collapse-item>
          <el-collapse-item title="输出">
            <JsonViewer :data="trace.outputJson" />
          </el-collapse-item>
        </el-collapse>
        <div v-if="trace.errorMessage" style="color:#f56c6c;margin-top:8px">
          {{ trace.errorMessage }}
        </div>
      </el-card>
    </el-timeline-item>
  </el-timeline>
  <EmptyState v-else description="暂无工具调用记录" />
</template>

<script setup lang="ts">
import type { ToolCallTraceResponse } from '@/types/trace'
import { toolCallStatusTagType } from '@/types/trace'
import JsonViewer from '@/components/common/JsonViewer.vue'
import EmptyState from '@/components/common/EmptyState.vue'

defineProps<{ traces: ToolCallTraceResponse[] }>()
</script>
