<template>
  <div class="sidebar-logo">
    <span v-if="!isCollapsed">售后工单操控台</span>
    <span v-else>ASA</span>
  </div>
  <el-menu
    :default-active="route.path"
    :collapse="isCollapsed"
    router
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409eff"
  >
    <el-menu-item index="/dashboard">
      <el-icon><Odometer /></el-icon>
      <template #title>仪表盘</template>
    </el-menu-item>
    <el-menu-item index="/tickets">
      <el-icon><List /></el-icon>
      <template #title>工单管理</template>
    </el-menu-item>
    <el-menu-item index="/approvals">
      <el-icon><Stamp /></el-icon>
      <template #title>审批中心</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
defineProps<{ isCollapsed: boolean }>()
const route = useRoute()
</script>
