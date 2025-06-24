<template>
  <div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="250px"
      v-loading="formLoading"
    >
      <h3 class="title">商城配置</h3>
      <el-form-item label="商城名称" prop="mallName">
        <el-input v-model="formData.mallName"  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="后台LOGO" prop="adminLogo">
        <Materials v-model="formData.adminLogo" num="1" type="image" />
      </el-form-item>
      <el-form-item label="移动端LOGO" prop="appLogo">
        <Materials v-model="formData.appLogo" num="1" type="image" />
      </el-form-item>
    </el-form>
    <el-button class="btn-submit" @click="submitForm" type="primary">确 定</el-button>
  </div>
</template>
<script setup lang="ts">
import * as configApi from '@/api/config'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
})
const formRules = reactive({
  mallName: [{ required: true, message: '请输入商城名称', trigger: 'blur' }],
  adminLogo: [{ required: true, message: '请输入后台LOGO', trigger: 'blur' }],
  appLogo: [{ required: true, message: '请输入移动端LOGO', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref


/** 提交表单 */
//const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    await configApi.updateMallConfig(data)
    message.success(t('common.updateSuccess'))
    // 发送操作成功的事件
    // emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

const getList = async () => {
  const data = await configApi.getMallConfig()
  if (data) {
    formData.value = data
  }
}
</script>

<style lang="scss" scoped>
.text{
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
  margin-left: 10px;
}
.title{
  margin: 60px 0 30px 60px;
  &:first-child{
    margin-top: 0;
  }
}
.el-input{
  width: 300px;
}
.btn-submit{
   margin-left: 250px;
}
</style>
