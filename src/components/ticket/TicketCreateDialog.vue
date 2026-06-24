<template>
  <el-dialog v-model="visible" title="创建工单" width="500px" @close="resetForm">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户 ID" prop="userId">
        <el-input v-model="form.userId" placeholder="例如 U-DEMO-1001" />
      </el-form-item>
      <el-form-item label="订单 ID" prop="orderId">
        <el-input v-model="form.orderId" placeholder="例如 O-DEMO-2001" />
      </el-form-item>
      <el-form-item label="问题描述" prop="message">
        <el-input v-model="form.message" type="textarea" :rows="3" placeholder="请描述售后问题" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">创建工单</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { createTicket } from '@/api/tickets'
import type { TicketResponse } from '@/types/ticket'

const emit = defineEmits<{ success: [ticket: TicketResponse] }>()

const visible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({ userId: '', orderId: '', message: '' })

const rules: FormRules = {
  userId: [{ required: true, message: '请输入用户 ID', trigger: 'blur' }],
  orderId: [{ required: true, message: '请输入订单 ID', trigger: 'blur' }],
  message: [{ required: true, message: '请输入问题描述', trigger: 'blur' }, { min: 5, message: '至少5个字符', trigger: 'blur' }],
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const ticket = await createTicket({
      userId: form.userId.trim(),
      orderId: form.orderId.trim(),
      message: form.message.trim(),
    })
    emit('success', ticket)
    visible.value = false
    resetForm()
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.userId = ''
  form.orderId = ''
  form.message = ''
  formRef.value?.resetFields()
}

function open(init?: { userId?: string; orderId?: string; message?: string }) {
  if (init) {
    form.userId = init.userId ?? ''
    form.orderId = init.orderId ?? ''
    form.message = init.message ?? ''
  }
  visible.value = true
}

defineExpose({ open })
</script>
