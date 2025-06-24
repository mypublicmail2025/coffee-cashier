<template>
  <div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="250px"
      v-loading="formLoading"
    >
      <h3 class="title">订单规则配置</h3>
      <el-form-item label="用户下单后" prop="autoOrderCancelTime">
        <el-input-number v-model="formData.autoOrderCancelTime" :controls="false" :precision="0" :min="1" placeholder="请输入" />
        <span class="text">分钟未付款，则订单自动取消</span>
      </el-form-item>
      <el-form-item label="商家发货" prop="autoOrderTakeTime">
        <el-input-number v-model="formData.autoOrderTakeTime" :controls="false" :precision="0" :min="1" placeholder="请输入" />
        <span class="text">天后，未确认收货，则订单自动确认收货</span>
      </el-form-item>
      <el-form-item label="订单确认收货" prop="noAfterSalesTime">
        <el-input-number v-model="formData.noAfterSalesTime" :controls="false" :precision="0" :min="1" placeholder="请输入" />
        <span class="text">天后，不可申请售后</span>
      </el-form-item>
      <el-form-item label="用户提交售后" prop="autoAfterSalesPass">
        <el-input-number v-model="formData.autoAfterSalesPass" :controls="false" :precision="0" :min="1" placeholder="请输入" />
        <span class="text">天，商家未审核，则售后申请自动通过</span>
      </el-form-item>
      <el-form-item label="订单确认收货" prop="orderNoCommentTime">
        <el-input-number v-model="formData.orderNoCommentTime" :controls="false" :precision="0" :min="1" placeholder="请输入" />
        <span class="text">天后，不可进行评价</span>
      </el-form-item>
      <el-form-item label="退款退货审核通过，用户超过" prop="afterSalesFailCancel">
        <el-input-number v-model="formData.afterSalesFailCancel" :controls="false" :precision="0" :min="1" placeholder="请输入" />
        <span class="text">天未寄回商品，则售后自动取消</span>
      </el-form-item>
      <el-form-item label="用户寄回退货商品，商家超过" prop="afterSalesOrderAutoSucceed">
        <el-input-number v-model="formData.afterSalesOrderAutoSucceed" :controls="false" :precision="0" :min="1" placeholder="请输入" />
        <span class="text">天未确认收货，售后订单自动确认收货</span>
      </el-form-item>
      <h3 class="title">售后订单设置</h3>
      <el-form-item label="退款收货人姓名" prop="consignee">
        <el-input v-model="formData.consignee"  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="退款收货人电话" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber"  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="退款收货人地址" prop="address">
        <el-input v-model="formData.address"  placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-button class="btn-submit" @click="submitForm" type="primary">确 定</el-button>
  </div>
</template>
<script setup lang="ts">
import * as OrderConfigApi from '@/api/config'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
})
const formRules = reactive({
  autoOrderCancelTime: [{ required: true, message: '请输入用户下单后订单多少分钟自动取消的时间', trigger: 'blur' }],
  autoOrderTakeTime: [{ required: true, message: '请输入收货后订单多少天自动确认的时间', trigger: 'blur' }],
  noAfterSalesTime: [{ required: true, message: '请输入订单确认多少天之后不再能售后', trigger: 'blur' }],
  autoAfterSalesPass: [{ required: true, message: '请输入提交售后之后多少天自动通过售后', trigger: 'blur' }],
  orderNoCommentTime: [{ required: true, message: '请输入确认收货多少天不能评价', trigger: 'blur' }],
  afterSalesFailCancel: [{ required: true, message: '请输入售后审核通过后，多少天用户没寄回，售后自动失败', trigger: 'blur' }],
  afterSalesOrderAutoSucceed: [{ required: true, message: '请输入用户寄回商品后多少天自动通过售后', trigger: 'blur' }],
  consignee: [{ required: true, message: '请输入退款收货人姓名', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '请输入退款收货人电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入退款收货人地址', trigger: 'blur' }],
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
    await OrderConfigApi.updateOrderRule(data)
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
  const data = await OrderConfigApi.getOrderRule()
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
