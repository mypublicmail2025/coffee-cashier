<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单号" prop="orderCode">
        <el-input disabled v-model="formData.orderCode" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="退款金额" prop="refundAmount">
        <el-input disabled v-model="formData.refundAmount" placeholder="请输入退款金额" />
      </el-form-item>
      <el-form-item label="申请原因" prop="reasons">
        <el-input disabled v-model="formData.reasons" placeholder="请输入申请原因" />
      </el-form-item>
      <el-form-item label="说明" prop="explains">
        <el-input disabled v-model="formData.explains" placeholder="请输入说明" />
      </el-form-item>
      <el-form-item label="说明图片" prop="explainImg" v-if="formData.explainImg">
        <el-image style="width: 100px; height: 100px" :preview-src-list="formData.explainImgList" v-for="(item,index) in formData.explainImgList" :key="index" :src="item"  />
      </el-form-item>
      <div class="group" v-if="formData.deliverySn">
        <h3 class="group-title color-red">物流信息</h3>
        <el-form-item label="物流公司">
          <el-input disabled v-model="formData.deliveryName" placeholder="请输入物流公司" />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input disabled v-model="formData.deliverySn" placeholder="请输入物流单号" />
        </el-form-item>
        <el-form-item label="退货说明">
          <el-input disabled v-model="formData.returnPolicy" placeholder="请输入退货说明" />
        </el-form-item>
        <el-form-item label="上传凭证" prop="explainImg" v-if="formData.returnVoucher">
          <div class="img-list">
            <el-image style="width: 100px; height: 100px" :preview-src-list="formData.returnVoucherList" v-for="(item,index) in formData.returnVoucherList" :key="index" :src="item"  />
          </div>
        </el-form-item>
      </div>
      <div class="group" v-if="formData.state===0 && formData.serviceType=== 1">
        <h3 class="group-title color-red">填写商家退货地址</h3>
        <el-form-item label="商家收货人" prop="consignee">
          <el-input v-model="formData.consignee" placeholder="请输入商家收货人" />
        </el-form-item>
        <el-form-item label="商家手机号" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber" placeholder="请输入商家手机号" />
        </el-form-item>
        <el-form-item label="商家地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入商家地址" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm(1)" type="primary" :disabled="formLoading">确 定</el-button>
       <el-button @click="submitForm(2)" type="danger" :disabled="formLoading">拒 绝</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as OrderConfigApi from '@/api/config'
import * as StoreAfterSalesApi from '@/api/mall/order/storeAfterSales'

// const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('订单审核') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderCode: undefined,
  refundAmount: undefined,
  serviceType: undefined,
  reasons: undefined,
  explains: undefined,
  explainImg: undefined,
  shipperCode: undefined,
  deliverySn: undefined,
  deliveryName: undefined,
  state: undefined,
  salesState: undefined,
  userId: undefined,
  consignee: undefined,
  phoneNumber: undefined,
  address: undefined,
  type: 0,
  explainImgList: [],
  returnVoucherList: []
})
const formRules = reactive({
  consignee: [{ required: true, message: '请输入商家收货人', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '请输入商家手机号', trigger: 'blur' }],
  address: [{ required: true, message: '请输入商家地址', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  //dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StoreAfterSalesApi.getStoreAfterSales(id)
      await getOrderRule()
       formData.value.explainImgList =  formData.value.explainImg?.split(',')
      formData.value.returnVoucherList =  formData.value.returnVoucher?.split(',')
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取收货信息
const getOrderRule = async () => {
  const data = await OrderConfigApi.getOrderRule()
  if (data) {
    formData.value.consignee = data.consignee
    formData.value.phoneNumber = data.phoneNumber
    formData.value.address = data.address
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (type) => {
  // 校验表单
  if (!formRef.value) return
  if( formData.value.state==0 && formData.value.serviceType==1 && type === 1){
    const valid = await formRef.value.validate()
    if (!valid) return
  }
  // 提交请求
  formLoading.value = true
  try {
    formData.value.type = type
    const data = formData.value
    // message.success(t('common.updateSuccess'))
    let confirmText = ''
    if(type === 1){
      if(formData.value.serviceType===1 && formData.value.state==0){
        confirmText = '确认通过吗？'
      } else {
        confirmText = '确认通过吗？通过后将退款到用户帐号上。'
      }
    } else {
      confirmText = '确认拒绝吗?'
    }
    message.confirm(confirmText).then(() => {
      StoreAfterSalesApi.updateStoreAfterSales(data).then(()=>{
        emit('success')
        message.success(type === 1?'已通过':'已拒绝')
      })
    })
    dialogVisible.value = false
    // 发送操作成功的事件
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    type: 0,
    orderCode: undefined,
    refundAmount: undefined,
    serviceType: undefined,
    reasons: undefined,
    explains: undefined,
    explainImg: undefined,
    shipperCode: undefined,
    deliverySn: undefined,
    deliveryName: undefined,
    state: undefined,
    salesState: undefined,
    userId: undefined,
    consignee: undefined,
    phoneNumber: undefined,
    address: undefined,
    explainImgList: [],
    returnVoucherList: []
  }
  formRef.value?.resetFields()
}
</script>
<style lang="scss" scoped>
.group {
  .group-title {
    margin: 40px 0 20px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
