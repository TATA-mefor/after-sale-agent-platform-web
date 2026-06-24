<template>
  <span class="health-badge">
    <span :class="['health-dot', status === 'UP' ? 'is-up' : 'is-down']" />
    <el-tag :type="status === 'UP' ? 'success' : 'danger'" size="large">
      {{ status === 'UP' ? '正常' : '异常' }}
    </el-tag>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: 'UP' | 'DOWN'
}>()
</script>

<style scoped>
.health-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.health-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.health-dot.is-up {
  background-color: #67c23a;
  animation: health-pulse 2s ease-in-out infinite;
}

.health-dot.is-down {
  background-color: #f56c6c;
}

@keyframes health-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}
</style>
