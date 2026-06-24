<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="layout-aside">
      <SidebarNav :is-collapsed="isCollapsed" />
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <TopHeader :is-collapsed="isCollapsed" @toggle="isCollapsed = !isCollapsed" />
      </el-header>
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import SidebarNav from './SidebarNav.vue'
import TopHeader from './TopHeader.vue'

const appStore = useAppStore()
const isCollapsed = ref(false)

onMounted(() => appStore.startPolling())
onUnmounted(() => appStore.stopPolling())
</script>
