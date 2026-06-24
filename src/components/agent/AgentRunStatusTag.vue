<template>
  <el-tag :type="tagType" size="small">{{ status }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type AgentRunStatus, agentRunStatusTagType } from '@/types/agent'

const props = defineProps<{ status: AgentRunStatus }>()
const tagType = computed(() => agentRunStatusTagType(props.status))
</script>
