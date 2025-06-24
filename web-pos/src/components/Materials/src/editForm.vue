<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      v-loading="formLoading"
    >
      <el-form-item label="文件名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入文件名称" />
      </el-form-item>
      <el-form-item label="所属分组" prop="groupId">
        <el-select
          style="width: 100%"
          v-model="formData.groupId"
          placeholder="请选择分组"
        >
          <el-option
            v-for="item in materialGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="formData.type===1?'图片上传':'视频上传'">
         <UploadImg v-if="formData.type === 1 && formType == 'update'" v-model="formData.url" :limit="1" :is-show-tip="false"/>
         <UploadImgs v-else-if="formData.type === 1 && formType == 'create'" v-model="fileList" :is-show-tip="false"/>
         <UploadVideo v-else v-model="formData.url" :limit="1" :is-show-tip="false" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CommonStatusEnum } from '@/utils/constants'
import { addObj , putObj } from '@/api/tools/material'
import type { UploadUserFile } from 'element-plus'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const fileList = ref<UploadUserFile[]>([])
const props = defineProps({
  materialGroupOptions: {
    type: Array,
    default: ()=>[],
  },
});
const { materialGroupOptions } = toRefs(props);

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  groupId: '',
})
const formRules = reactive({
  name: [{ required: true, message: '文件名称不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true
  formType.value = row?'update':'create'
  dialogTitle.value = t('action.' +  formType.value)
  fileList.value = []
  resetForm()
  // 修改时，设置数据
  if (row) {
    formData.value = JSON.parse(JSON.stringify(row))
    if(row.groupId){
      formData.value.groupId = parseInt(row.groupId)
    }
  }

  formData.value.type = type// 类型 1、图片；2、视频
  console.log(formData.value,'formData.value')
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
  if (formData.value.type === 1) {
    if (formData.value.url === '' && formType.value === 'update') {
      message.error('请先上传素材')
      return false
    }
    if (fileList.value.length === 0 && formType.value === 'create') {
      message.error('请先上传素材')
      return false
    } else {
      formData.value.urlList = fileList.value.map(file => file.response.data);
    }
  } else {
    if (formData.value.url === '' && (formType.value === 'create' || formType.value === 'update')) {
      message.error('请先上传素材')
      return false
    } else if (formType.value === 'create') {
      formData.value.urlList = [formData.value.url]
    }
  }
  formLoading.value = true
  try {
    const data = formData.value
    if (formType.value === 'create') {
      await addObj(data)
      message.success(t('common.createSuccess'))
    } else {
      await putObj(data)
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
