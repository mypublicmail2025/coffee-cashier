<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单编号" prop="orderSn">
        <el-input v-model="formData.orderSn" placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item label="模板" prop="printTemplate">
        <el-input v-model="formData.printTemplate" placeholder="请输入模板" />
      </el-form-item>
      <el-form-item label="KDNOrderCode" prop="kdnOrderCode">
        <el-input v-model="formData.kdnOrderCode" placeholder="请输入KDNOrderCode" />
      </el-form-item>
      <el-form-item label="物流单号" prop="logisticCode">
        <el-input v-model="formData.logisticCode" placeholder="请输入物流单号" />
      </el-form-item>
      <el-form-item label="快递编号" prop="shipperCode">
        <el-input v-model="formData.shipperCode" placeholder="请输入快递编号" />
      </el-form-item>
      <el-form-item label="接口返回的json" prop="order">
        <el-input v-model="formData.order" placeholder="请输入接口返回的json" />
      </el-form-item>
      <el-form-item label="线下网点客户号" prop="customerName">
        <el-input v-model="formData.customerName" placeholder="请输入线下网点客户号" />
      </el-form-item>
      <el-form-item label="线下网点密码" prop="customerPwd">
        <el-input v-model="formData.customerPwd" placeholder="请输入线下网点密码" />
      </el-form-item>
      <el-form-item label="状态:0=正常,1=已取消" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="1">请选择字典生成</el-radio>
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
import * as StoreOrderElectronicsApi from '@/api/mall/order/storeOrderElectronics'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderSn: undefined,
  printTemplate: undefined,
  kdnOrderCode: undefined,
  logisticCode: undefined,
  shipperCode: undefined,
  order: undefined,
  customerName: undefined,
  customerPwd: undefined,
  status: undefined
})
const formRules = reactive({
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
      formData.value = await StoreOrderElectronicsApi.getStoreOrderElectronics(id)
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
    const data = formData.value as unknown as StoreOrderElectronicsApi.StoreOrderElectronicsVO
    if (formType.value === 'create') {
      await StoreOrderElectronicsApi.createStoreOrderElectronics(data)
      message.success(t('common.createSuccess'))
    } else {
      await StoreOrderElectronicsApi.updateStoreOrderElectronics(data)
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
    orderSn: undefined,
    printTemplate: undefined,
    kdnOrderCode: undefined,
    logisticCode: undefined,
    shipperCode: undefined,
    order: undefined,
    customerName: undefined,
    customerPwd: undefined,
    status: undefined
  }
  formRef.value?.resetFields()
}
</script>
