<script setup lang="ts">
import * as UserLevelEquityApi from '@/api/member/userLevelEquity'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  typeName: undefined,
  iconUrl: undefined,
  remarks: ''

})
const formRules = reactive({
  typeName: [{ required: true, message: '请输入权益名称', trigger: 'blur' }]
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
      formData.value = await UserLevelEquityApi.getUserLevelEquity(id)
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
  if (!formData.value.iconUrl) {
    message.error('请上传权益图标!')
    return false
  }
  formLoading.value = true
  try {
    const data = formData.value as unknown as UserLevelEquityApi.UserLevelEquityVO
    if (formType.value === 'create') {
      await UserLevelEquityApi.createUserLevelEquity(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserLevelEquityApi.updateUserLevelEquity(data)
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
    typeName: undefined,
    remarks: '',
    iconUrl: undefined
  }
  formRef.value?.resetFields()
}
</script>
<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="权益名称" prop="typeName">
        <el-input v-model="formData.typeName" placeholder="请输入类型名称" />
      </el-form-item>
      <el-form-item label="图标" prop="iconUrl" class="is-required">
        <Materials v-model="formData.iconUrl" :num="1" type="image" />
      </el-form-item>
      <el-form-item label="说明" prop="remarks">
        <el-input type="textarea" rows="5" maxlength="100" show-word-limit v-model="formData.remarks" placeholder="请输入权益说明" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
