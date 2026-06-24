<template>
  <el-dialog v-model="visible" :title="action === 'approve' ? '通过审批' : '拒绝审批'" width="450px" @close="resetForm">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="审核人 ID" prop="reviewerId">
        <el-input v-model="form.reviewerId" placeholder="例如 reviewer-demo" />
      </el-form-item>
      <el-form-item label="备注" prop="reason">
        <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="审核备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button :type="action === 'approve' ? 'success' : 'danger'" :loading="submitting" @click="handleSubmit">
        {{ action === 'approve' ? '通过' : '拒绝' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const emit = defineEmits<{ submit: [data: { reviewerId: string; reason: string }] }>()

const visible = ref(false)
const submitting = ref(false)
const action = ref<'approve' | 'reject'>('approve')
const formRef = ref<FormInstance>()
const form = reactive({ reviewerId: '', reason: '' })

const rules: FormRules = {
  reviewerId: [{ required: true, message: '请输入审核人 ID', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    emit('submit', { reviewerId: form.reviewerId, reason: form.reason })
    visible.value = false
    resetForm()
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.reviewerId = ''
  form.reason = ''
  formRef.value?.resetFields()
}

function open(mode: 'approve' | 'reject') {
  action.value = mode
  visible.value = true
}

defineExpose({ open })
</script>
