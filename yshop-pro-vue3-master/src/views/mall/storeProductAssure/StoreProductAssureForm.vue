<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入服务名称" />
      </el-form-item>
      <el-form-item label="服务内容" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          resize="none"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sorted">
        <el-input
          v-model="formData.sorted"
          type="number"
          :min="1"
          placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as StoreProductAssureApi from '@/api/storeProductAssure'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  content: undefined,
  sorted: undefined,
  status: 1
})
const formRules = reactive({
  name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '服务内容不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StoreProductAssureApi.getStoreProductAssure(id)
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
    const data = formData.value as unknown as StoreProductAssureApi.StoreProductAssureVO
    if (formType.value === 'create') {
      await StoreProductAssureApi.createStoreProductAssure(data)
      message.success(t('common.createSuccess'))
    } else {
      await StoreProductAssureApi.updateStoreProductAssure(data)
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
    name: undefined,
    content: undefined,
    sorted: undefined,
    status: 1
  }
  formRef.value?.resetFields()
}
</script>
