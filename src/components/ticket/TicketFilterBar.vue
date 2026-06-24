<template>
  <el-form :model="filters" inline class="filter-bar">
    <el-form-item label="状态">
      <el-select v-model="filters.status" placeholder="全部" clearable style="width: 140px" @change="emitFilter">
        <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="意图">
      <el-select v-model="filters.intentType" placeholder="全部" clearable style="width: 140px" @change="emitFilter">
        <el-option v-for="i in intentOptions" :key="i.value" :label="i.label" :value="i.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="用户ID">
      <el-input v-model="filters.userId" placeholder="用户ID" clearable style="width: 140px" @change="emitFilter" />
    </el-form-item>
    <el-form-item label="订单ID">
      <el-input v-model="filters.orderId" placeholder="订单ID" clearable style="width: 140px" @change="emitFilter" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="emitFilter">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { TicketStatus, IntentType, type TicketListParams } from '@/types/ticket'

const emit = defineEmits<{ filter: [params: TicketListParams] }>()

const filters = reactive<Partial<TicketListParams>>({})

const statusOptions = Object.values(TicketStatus).map(v => ({ label: v, value: v }))
const intentOptions = Object.values(IntentType).map(v => ({ label: v, value: v }))

function emitFilter() {
  const params: TicketListParams = {}
  if (filters.status) params.status = filters.status as TicketStatus
  if (filters.intentType) params.intentType = filters.intentType as IntentType
  if (filters.userId) params.userId = filters.userId
  if (filters.orderId) params.orderId = filters.orderId
  emit('filter', params)
}

function reset() {
  filters.status = undefined
  filters.intentType = undefined
  filters.userId = ''
  filters.orderId = ''
  emit('filter', {})
}
</script>

<style scoped>
.filter-bar {
  margin-bottom: 16px;
}
</style>
