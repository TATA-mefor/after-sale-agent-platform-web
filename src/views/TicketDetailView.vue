<template>
  <div>
    <el-page-header @back="router.push('/tickets')" title="返回列表">
      <template #content>工单详情 #{{ ticketId }}</template>
    </el-page-header>

    <div v-if="error" style="margin-top:20px">
      <el-alert type="error" :title="error" show-icon :closable="false" />
    </div>

    <template v-if="ticket">
      <el-descriptions :column="2" border style="margin-top:20px">
        <el-descriptions-item label="工单 ID">{{ ticket.ticketId }}</el-descriptions-item>
        <el-descriptions-item label="状态"><TicketStatusTag :status="ticket.status" /></el-descriptions-item>
        <el-descriptions-item label="用户 ID">{{ ticket.userId }}</el-descriptions-item>
        <el-descriptions-item label="订单 ID">{{ ticket.orderId }}</el-descriptions-item>
        <el-descriptions-item label="意图">{{ ticket.intentType }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{ ticket.priority }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(ticket.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatDate(ticket.updatedAt) }}</el-descriptions-item>
      </el-descriptions>

      <el-card style="margin-top:16px">
        <template #header>用户消息</template>
        <p>{{ ticket.rawUserMessage }}</p>
      </el-card>

      <el-card v-if="ticket.internalNote" style="margin-top:16px">
        <template #header>内部备注</template>
        <p>{{ ticket.internalNote }}</p>
      </el-card>

      <el-card v-if="ticket.agentSuggestion" style="margin-top:16px">
        <template #header>Agent 处理建议</template>
        <div class="agent-suggestion">{{ ticket.agentSuggestion }}</div>
      </el-card>

      <div style="margin-top:20px;display:flex;gap:12px">
        <el-button type="primary" :loading="triggering" @click="handleTriggerAgent">
          触发 Agent 处理
        </el-button>
        <el-popconfirm title="确定删除此工单？" @confirm="handleDelete">
          <template #reference>
            <el-button type="danger">删除工单</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-alert v-if="triggerError" type="error" :title="triggerError" style="margin-top:8px" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTicket, triggerAgentRun, deleteTicket } from '@/api/tickets'
import type { TicketResponse } from '@/types/ticket'
import TicketStatusTag from '@/components/ticket/TicketStatusTag.vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const ticketId = route.params.ticketId as string

const ticket = ref<TicketResponse | null>(null)
const error = ref<string | null>(null)
const triggering = ref(false)
const triggerError = ref<string | null>(null)

onMounted(async () => {
  try {
    ticket.value = await fetchTicket(ticketId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载工单失败'
  }
})

async function handleDelete() {
  try {
    await deleteTicket(ticketId)
    ElMessage.success('工单已删除')
    router.push('/tickets')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

async function handleTriggerAgent() {
  triggering.value = true
  triggerError.value = null
  try {
    const run = await triggerAgentRun(ticketId)
    router.push(`/agent-runs/${run.runId}`)
  } catch (e) {
    triggerError.value = e instanceof Error ? e.message : '触发 Agent 失败'
  } finally {
    triggering.value = false
  }
}

function formatDate(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.agent-suggestion {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 14px;
  color: #303133;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  max-height: 400px;
  overflow-y: auto;
}
</style>
