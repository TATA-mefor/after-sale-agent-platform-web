import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const healthStatus = ref<'UP' | 'DOWN'>('UP')
  const healthError = ref<string | null>(null)
  let pollTimer: ReturnType<typeof setInterval> | null = null

  async function fetchHealth() {
    try {
      const resp = await fetch('/actuator/health')
      const data = await resp.json()
      healthStatus.value = data.status || 'DOWN'
      healthError.value = null
    } catch {
      healthStatus.value = 'DOWN'
      healthError.value = '无法连接到后端服务'
    }
  }

  function startPolling(intervalMs = 30_000) {
    stopPolling()
    fetchHealth()
    pollTimer = setInterval(fetchHealth, intervalMs)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  return { healthStatus, healthError, fetchHealth, startPolling, stopPolling }
})
