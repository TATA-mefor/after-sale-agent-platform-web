<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="margin:0">工单管理</h2>
      <div style="display:flex;gap:8px">
        <el-button type="primary" @click="createDialog?.open()">创建工单</el-button>
        <el-button :loading="importing" @click="importTestCases">导入40条测试用例</el-button>
      </div>
    </div>

    <TicketFilterBar @filter="onFilter" />

    <div style="margin-bottom:12px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
      <span style="color:#909399;font-size:13px;white-space:nowrap">📋 测试用例：</span>
      <el-button
        v-for="preset in presets"
        :key="preset.label"
        size="small"
        plain
        @click="createDialog?.open({ userId: preset.userId, orderId: preset.orderId, message: preset.message })"
      >
        {{ preset.label }}
      </el-button>
    </div>

    <el-table
      v-loading="ticketStore.loading"
      :data="ticketStore.tickets"
      stripe
      highlight-current-row
      @row-click="onRowClick"
      style="cursor:pointer"
    >
      <el-table-column prop="ticketId" label="工单 ID" width="140" sortable="custom" />
      <el-table-column prop="userId" label="用户" width="120" />
      <el-table-column prop="orderId" label="订单 ID" width="140" />
      <el-table-column label="意图" width="120">
        <template #default="{ row }">
          <el-tag :type="intentDisplay(row.intentType).type" size="small">
            {{ intentDisplay(row.intentType).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理建议" width="120">
        <template #default="{ row }">
          <el-tag :type="suggestionDisplay(row).type" size="small">
            {{ suggestionDisplay(row).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="140">
        <template #default="{ row }">
          <TicketStatusTag :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="80" />
      <el-table-column prop="createdAt" label="创建时间" min-width="160">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click.stop="router.push(`/tickets/${row.ticketId}`)">详情</el-button>
          <el-popconfirm title="确定删除此工单？" @confirm="handleDelete(row.ticketId)">
            <template #reference>
              <el-button size="small" type="danger" @click.stop>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <EmptyState v-if="!ticketStore.loading && !ticketStore.tickets.length" description="暂无工单，点击上方按钮创建" />

    <el-pagination
      v-if="ticketStore.pageResponse"
      v-model:current-page="currentPage"
      :page-size="ticketStore.pageResponse.size"
      :total="ticketStore.pageResponse.totalElements"
      layout="total, prev, pager, next"
      style="margin-top:16px;justify-content:flex-end"
      @current-change="ticketStore.setPage($event - 1)"
    />

    <TicketCreateDialog ref="createDialog" @success="ticketStore.loadTickets()" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketStore } from '@/stores/ticketStore'
import type { TicketListParams, TicketResponse } from '@/types/ticket'
import TicketStatusTag from '@/components/ticket/TicketStatusTag.vue'
import TicketFilterBar from '@/components/ticket/TicketFilterBar.vue'
import TicketCreateDialog from '@/components/ticket/TicketCreateDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { createTicket, deleteTicket, triggerAgentRun } from '@/api/tickets'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { TEST_CASES } from '@/data/testCases'

const router = useRouter()
const ticketStore = useTicketStore()
const createDialog = ref<InstanceType<typeof TicketCreateDialog>>()

const currentPage = computed(() => (ticketStore.pageResponse?.page ?? 0) + 1)

const importing = ref(false)

async function importTestCases() {
  importing.value = true
  let created = 0
  let failed = 0
  try {
    for (const tc of TEST_CASES) {
      try {
        const ticket = await createTicket({
          userId: tc.userId,
          orderId: tc.orderId,
          message: tc.message,
        })
        await triggerAgentRun(ticket.ticketId)
        created++
      } catch {
        failed++
      }
    }
    ElMessage.success(`导入完成：成功 ${created} 条${failed > 0 ? `，失败 ${failed} 条` : ''}`)
  } finally {
    importing.value = false
    ticketStore.loadTickets()
  }
}

const presets = [
  { label: '换货-耳机杂音',   userId: 'U-DEMO-1',     orderId: 'O202605130001',       message: 'Wireless Headphones耳机左耳有杂音，申请换货' },
  { label: '退货-包装破损',   userId: 'U-7001',       orderId: 'O-7001',              message: 'Wireless Headphones收到后发现包装破损，要求退货' },
  { label: '退款-充电器坏',   userId: 'U-7002',       orderId: 'O-7002',              message: 'USB-C Charger充电器用了三天就不充电了，退款' },
  { label: '售前-未发货',     userId: 'U-DEMO-ORDER', orderId: 'O-PAID-NOT-SHIPPED',  message: 'Mechanical Keyboard付款一周了还没发货，催一下' },
  { label: '定制-颜色不符',   userId: 'U-DEMO-ORDER', orderId: 'O-SPECIAL-GOODS',     message: 'Customized Gift Box收到的礼盒颜色和定制要求不一致' },
  { label: '保修-过期订单',   userId: 'U-DEMO-ORDER', orderId: 'O-EXPIRED-AFTERSALE', message: 'Running Shoes鞋子开胶了想保修' },
]

onMounted(() => ticketStore.loadTickets())

function onFilter(params: TicketListParams) {
  ticketStore.setFilters(params)
}

function onRowClick(row: TicketResponse) {
  router.push(`/tickets/${row.ticketId}`)
}

async function handleDelete(ticketId: string) {
  try {
    await deleteTicket(ticketId)
    ElMessage.success('工单已删除')
    ticketStore.loadTickets()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

const INTENT_LABELS: Record<string, { label: string; type: 'success' | 'warning' | 'info' | 'danger' }> = {
  REFUND_ONLY:          { label: '退款评定',   type: 'success' },
  RETURN_AND_REFUND:    { label: '退货退款评定', type: 'success' },
  EXCHANGE:             { label: '换货评定',   type: 'success' },
  REPAIR:               { label: '保修评定',   type: 'warning' },
  LOGISTICS_ISSUE:      { label: '物流/售前',  type: 'info' },
  GENERAL_CONSULTATION: { label: '常规咨询',   type: 'info' },
  MULTI_INTENT:         { label: '多意图',     type: 'info' },
  UNKNOWN:              { label: '待确认',     type: 'info' },
}

function intentDisplay(intentType: string | null | undefined): { label: string; type: string } {
  if (!intentType) return { label: '未分类', type: 'info' }
  return INTENT_LABELS[intentType] ?? { label: intentType, type: 'info' }
}

function suggestionDisplay(row: TicketResponse): { label: string; type: 'success' | 'warning' | 'info' | 'danger' } {
  if (row.status === 'FAILED') return { label: '处理失败', type: 'danger' }

  const s = (row.agentSuggestion ?? '') + (row.internalNote ?? '')

  if (s.includes('不可退换') || s.includes('不在保修') || s.includes('不在售后')) return { label: '拒绝', type: 'danger' }
  if (s.includes('仅退款') || s.includes('仅退款不退货') || row.intentType === 'REFUND_ONLY') return { label: '仅退款', type: 'success' }
  if ((s.includes('换货') && s.includes('退货')) || (row.intentType === 'MULTI_INTENT' && s.includes('RETURN') && s.includes('EXCHANGE'))) return { label: '退换', type: 'success' }
  if (s.includes('退货') || row.intentType === 'RETURN_AND_REFUND') return { label: '仅退货', type: 'success' }
  if (s.includes('换货') || row.intentType === 'EXCHANGE') return { label: '换货', type: 'success' }
  if (s.includes('保修') || s.includes('维修') || row.intentType === 'REPAIR') return { label: '保修', type: 'warning' }
  if (s.includes('未发货') || s.includes('催发货') || s.includes('取消') || s.includes('售前') || s.includes('PRE_SALE')) return { label: '转售前', type: 'info' }
  if (s.includes('物流') || row.intentType === 'LOGISTICS_ISSUE') return { label: '转物流', type: 'info' }
  if (row.intentType === 'GENERAL_CONSULTATION') return { label: '咨询', type: 'info' }

  return { label: '待确认', type: 'info' }
}

function formatDate(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD HH:mm')
}
</script>
