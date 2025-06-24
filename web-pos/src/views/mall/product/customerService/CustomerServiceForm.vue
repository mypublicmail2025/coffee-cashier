<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      v-loading="formLoading"
    >
      <el-form-item label="客服名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入客服名称" :maxlength="15" show-word-limit/>
      </el-form-item>
      <el-form-item label="客服头像" prop="mediaData">
        <UploadMaterial v-model="formData.mediaData" :limit="1" :is-show-tip="false" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts" name="ProductBrandForm">
import { CommonStatusEnum } from '@/utils/constants'
import * as CustomerServiceApi from '@/api/mall/product/customerService'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
})
const formRules = reactive({
  name: [{ required: true, message: '客服名称不能为空', trigger: 'blur' }],
  mediaData: [{ required: true, message: '客服头像不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, data?: object) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (data) {
    formLoading.value = true
    formData.value = data
    formData.value.mediaData = {
      mediaId: data.mediaId,
      url: data.avatarUrl
    }
    try {

    } finally {
      formLoading.value = false
    }
  }
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
    const data = formData.value as CustomerServiceApi.KfVO
    data.mediaId = data.mediaData.mediaId
    data.avatarUrl = data.mediaData.url
    if (formType.value === 'create') {
      await CustomerServiceApi.createKf(data)
      message.success(t('common.createSuccess'))
    } else {
      await CustomerServiceApi.updateKf(data)
      message.success(t('common.updateSuccess'))
    }
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
    id: undefined,
    name: '',
    picUrl: '',
    status: CommonStatusEnum.ENABLE,
    description: ''
  }
  formRef.value?.resetFields()
}
</script>
