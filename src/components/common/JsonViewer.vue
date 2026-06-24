<template>
  <div class="json-viewer">
    <pre v-if="formatted">{{ formatted }}</pre>
    <span v-else class="json-empty">{{ emptyText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data: unknown
  emptyText?: string
}>(), {
  emptyText: '(empty)',
})

const formatted = computed(() => {
  if (props.data === null || props.data === undefined) return ''
  if (typeof props.data === 'string') {
    try {
      return JSON.stringify(JSON.parse(props.data), null, 2)
    } catch {
      return props.data
    }
  }
  try {
    return JSON.stringify(props.data, null, 2)
  } catch {
    return String(props.data)
  }
})
</script>

<style scoped>
.json-viewer pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 13px;
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
}
.json-empty {
  color: #909399;
  font-style: italic;
}
</style>
