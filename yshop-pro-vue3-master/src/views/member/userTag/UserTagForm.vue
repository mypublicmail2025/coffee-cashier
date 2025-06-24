<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="25%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="标签名称" prop="tagName">
        <el-input v-model="formData.tagName" placeholder="请输入标签名称" />
      </el-form-item>
      <el-form-item label="标签分组" prop="groupId">
        <el-select
          v-model="formData.groupId"
          clearable
          style="width: 100%"
          placeholder="请选择标签"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as UserTagApi from '@/api/member/userTag'
import * as UserTagGroupApi from '@/api/member/userTagGroup'
import { ref, reactive } from 'vue'

interface GroupData {
  id: number
  groupName: string
}

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const list = ref<GroupData[]>([]) // 列表的数据
const formData = ref({
  id: undefined,
  tagName: '',
  groupId: undefined
})
const formRules = reactive({
  tagName: [{ required: true, message: '标签名不能为空', trigger: 'blur' }],
  groupId: [{ required: true, message: '标签分组不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await getList()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await UserTagApi.getUserTag(id)
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
    const data = formData.value as unknown as UserTagApi.UserTagVO
    if (formType.value === 'create') {
      await UserTagApi.createUserTag(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserTagApi.updateUserTag(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const getList = async () => {
  try {
    const data = await UserTagGroupApi.getAllGroupPage()
    list.value = data
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    tagName: '',
    groupId: undefined
  }
  formRef.value?.resetFields()
}
</script>
