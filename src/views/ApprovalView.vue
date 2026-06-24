<template>
  <div>
    <h2 style="margin-bottom:20px">
      审批中心
      <el-badge v-if="approvalStore.pendingCount" :value="approvalStore.pendingCount" style="margin-left:8px" />
    </h2>

    <el-alert v-if="approvalStore.error" type="error" :title="approvalStore.error" show-icon :closable="false" style="margin-bottom:16px" />

    <el-table v-loading="approvalStore.loading" :data="approvalStore.pending" stripe>
      <el-table-column prop="ticketId" label="工单 ID" width="160">
        <template #default="{ row }">
          <el-link type="primary" @click="router.push(`/tickets/${row.ticketId}`)">{{ row.ticketId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户 ID" width="140" />
      <el-table-column prop="orderId" label="订单 ID" width="150" />
      <el-table-column prop="userMessage" label="用户消息" min-width="280">
        <template #default="{ row }">
          <span v-if="row.userMessage" style="word-break:break-all">{{ row.userMessage }}</span>
          <span v-else style="color:#c0c4cc">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="riskLevel" label="风险等级" width="100">
        <template #default="{ row }">
          <el-tag :type="riskLevelTagType(row.riskLevel)" size="small">{{ row.riskLevel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="requestedAt" label="请求时间" width="170">
        <template #default="{ row }">{{ formatDate(row.requestedAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="success" @click="openDialog(row, 'approve')">通过</el-button>
          <el-button size="small" type="danger" @click="openDialog(row, 'reject')">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <EmptyState v-if="!approvalStore.loading && !approvalStore.pending.length" description="暂无待审批请求" />

    <ApproveRejectDialog ref="approveDialog" @submit="handleApprovalSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApprovalStore } from '@/stores/approvalStore'
import type { EnrichedApproval } from '@/stores/approvalStore'
import { riskLevelTagType } from '@/types/approval'
import ApproveRejectDialog from '@/components/approval/ApproveRejectDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import dayjs from 'dayjs'

const router = useRouter()
const approvalStore = useApprovalStore()

const approveDialog = ref<InstanceType<typeof ApproveRejectDialog>>()
let pendingAction: { id: string; mode: 'approve' | 'reject' } | null = null

onMounted(() => approvalStore.loadPending())

function openDialog(row: EnrichedApproval, mode: 'approve' | 'reject') {
  pendingAction = { id: row.approvalRequestId, mode }
  approveDialog.value?.open(mode)
}

async function handleApprovalSubmit(data: { reviewerId: string; reason: string }) {
  if (!pendingAction) return
  const { id, mode } = pendingAction
  if (mode === 'approve') {
    await approvalStore.approve(id, data)
  } else {
    await approvalStore.reject(id, data)
  }
  pendingAction = null
}

function formatDate(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD HH:mm')
}
</script>
