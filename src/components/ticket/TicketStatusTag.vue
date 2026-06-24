<template>
  <el-tag :type="tagType" size="small">{{ status }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type TicketStatus, ticketStatusTagType } from '@/types/ticket'

const props = defineProps<{ status: TicketStatus }>()
const tagType = computed(() => ticketStatusTagType(props.status))
</script>
