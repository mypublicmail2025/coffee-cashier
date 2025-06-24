<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400px" @close="handleClose">
    <el-form
        class="reply-form"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="92px"
        v-loading="formLoading"
        :inline="true"
    >
      <!-- <el-row :gutter="20"  > -->
      <el-row :gutter="20">
        <el-col class="mb15">
          <el-form-item label="回复内容" prop="merchantReplyContent" class="reply-item">
            <el-input :rows="5" type="textarea" v-model="formData.merchantReplyContent" placeholder="请输入回复内容" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- </el-row> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as StoreProductReplyApi from '@/api/mall/product/storeProductReply'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('回复评价') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: 0,
  merchantReplyContent: ''
})
const formRules = reactive({
  merchantReplyContent: [{ required: true, message: '回复内容不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id: number) => {
  resetForm()
  formData.value.id = id
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    await StoreProductReplyApi.replyEvaluation(formData.value)
    message.success('回复成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: 0,
    merchantReplyContent: ''
  }
  formRef.value?.resetFields()
}
const handleClose = () => {
  formData.value = {
    id: 0,
    merchantReplyContent: ''
  }
}
</script>

<style scoped>
.mb15 {
  margin-bottom: 15px !important;
}
.reply-form .reply-item {
  width: 100%;
}
</style>
