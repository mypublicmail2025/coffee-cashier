<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="成长任务类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择成长任务类型">
          <el-option v-for="item of taskType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型名称" prop="typeName">
        <el-input v-model="formData.typeName" placeholder="请输入类型名称" />
      </el-form-item>
      <el-form-item label="成长值" prop="growthValue">
        <el-input v-model="formData.growthValue" placeholder="请输入成长值" />
      </el-form-item>
      <el-form-item label="图标" prop="iconUrl">
        <Materials v-model="formData.iconUrl" :num="1" type="image" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as UserLevelGrowthValueConfigApi from '@/api/member/userLevelGrowthValueConfig'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  type: undefined,
  typeName: undefined,
  growthValue: undefined,
  iconUrl: undefined
})
const formRules = reactive({
  type: [{ required: true, message: '请选择成长类型', trigger: 'blur' }],
  typeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
  growthValue: [{ required: true, message: '请输入成长值', trigger: 'blur' }],
  iconUrl: [{ required: true, message: '请上传图标', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const taskType = ref([
  {
    label: '消费',
    value: 'consume'
  },
  {
    label: '邀请',
    value: 'invite'
  }
])

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
      formData.value = await UserLevelGrowthValueConfigApi.getUserLevelGrowthValueConfig(id)
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
    const data = formData.value as unknown as UserLevelGrowthValueConfigApi.UserLevelGrowthValueConfigVO
    if (formType.value === 'create') {
      await UserLevelGrowthValueConfigApi.createUserLevelGrowthValueConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserLevelGrowthValueConfigApi.updateUserLevelGrowthValueConfig(data)
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
    type: undefined,
    typeName: undefined,
    growthValue: undefined
  }
  formRef.value?.resetFields()
}
</script>
