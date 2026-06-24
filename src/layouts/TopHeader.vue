<template>
  <div class="header-left">
    <el-icon class="collapse-btn" @click="$emit('toggle')" :size="20">
      <Fold v-if="!isCollapsed" />
      <Expand v-else />
    </el-icon>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="route.meta.title && !route.meta.hidden">
        {{ route.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="header-right">
    <HealthBadge :status="appStore.healthStatus" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import HealthBadge from '@/components/common/HealthBadge.vue'

defineProps<{ isCollapsed: boolean }>()
defineEmits<{ toggle: [] }>()
const route = useRoute()
const appStore = useAppStore()
</script>

<style scoped>
.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>
