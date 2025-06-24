<script setup lang="ts">
import * as DistributorApi from "@/api/distributor/merchant";
import {ref, reactive} from "vue";
const message = useMessage() // 消息弹窗

const dialogVisible = ref<boolean>(false)

interface FormData {
  id?: number;
  refuse: string;
  status: number;
}
const formData = ref<FormData>({
  refuse: '',
  status: 1
})
const formRules = reactive({})
const formLoading = ref<boolean>(false)

// 打开弹窗
const open = (id: number) => {
  formData.value.id = id
  formData.value.refuse = ''
  formData.value.status = 1
  dialogVisible.value = true
}
// 确认审核
const confirmationAudit = async () => {
  formLoading.value = true
  try {
    if (formData.value.status === 2 && formData.value.refuse === '') {
      message.error('请输入拒绝说明')
      return false
    }
    await DistributorApi.auditDistributorApi(formData.value)
    message.success('审核成功')
  } catch (err) {
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = false
  // 发送操作成功的事件
  emit('success')
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<template>
  <Dialog title="分销商审核" v-model="dialogVisible" width="40%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
    >
      <el-form-item label="分销商审核">
        <el-radio-group class="radio" v-model="formData.status" >
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="2">审核拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" rows="4"  v-model="formData.refuse" placeholder="请输入审核说明" maxlength="255" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        @click="confirmationAudit"
      >确 认</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
