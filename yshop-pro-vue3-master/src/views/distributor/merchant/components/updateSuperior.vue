<template>
  <div>
    <Dialog title="更改上级分销" v-model="dialogVisible" width="800">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-form-item label="用户" prop="ptype">
          <el-button @click="openSelect">选择用户</el-button>
        </el-form-item>
        <el-table v-if="selectedData.id" :data="[selectedData]" max-height="500" border style="width: 100%">
          <el-table-column label="ID" align="center" prop="id"/>
          <el-table-column label="分销商信息" align="center" prop="realName"/>
        </el-table>
      </el-form>
      <template #footer>
        <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
    <SuperiorSelect ref="superiorSelectRef" @success="superiorSelectSubmit" />
  </div>
</template>
<script setup lang="ts">
import * as DistributorApi from "@/api/distributor/merchant";
import SuperiorSelect from './superiorSelect.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const selectedData = ref({})
const formData = ref({
  id: 0,
  superiorId: undefined,
})
const formRules = reactive({
  money: [{ required: true, message: '请输入余额', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (data?: number) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = data.id
  selectedData.value = {
    id: data.superiorIdP1,
    realName: data.superiorNameP1
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 打开选择上级分销弹窗
const superiorSelectRef = ref()
const openSelect = () => {
  superiorSelectRef.value.open()
}

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
    const data = formData.value as unknown as UserApi.UserVO
    await DistributorApi.updateDistributor(data)
    message.success(t('common.updateSuccess'))
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
    superiorId: undefined,
  }
  formRef.value?.resetFields()
}

const superiorSelectSubmit = (data: UserApi.UserVO) => {
  formData.value.superiorIdP1 = data.id
  formData.value.superiorNameP1 = data.realName
  selectedData.value = data
}
</script>
