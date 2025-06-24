<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="选择类型" prop="orderType">
         <el-radio-group v-model="formData.orderType">
          <el-radio label="send">发货</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发货类型" prop="deliveryType">
         <el-radio-group v-model="formData.deliveryType" @change="selectDelivery">
          <el-radio label="normal">手动填写</el-radio>
<!--          <el-radio label="face">电子面单</el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="快递公司" prop="deliverySn" v-if="isShow">
          <el-select v-model="formData.deliverySn" placeholder="选择快递公司" @change="selectExpress" >
            <el-option label="选择快递公司" value="" />
            <el-option
              v-for="item in express"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
      </el-form-item>
      <el-form-item label="快递单号" prop="deliveryId" v-if="isShow">
        <el-input v-model="formData.deliveryId" placeholder="请输入快递单号" class="input-width" />
      </el-form-item>
      <el-form-item label="电子面单模板" prop="electId" v-if="!isShow">
          <el-select v-model="electId" placeholder="选择子面单模板"  @change="selectOrder">
            <el-option label="选择子面单模板" :value="0" />
            <el-option
              v-for="item in electOrder"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
      </el-form-item>


      <div id="printBox">
        <!-- {{ printHtml }} -->
        <span v-html="printHtml"></span>
      </div>


    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary"  v-show="isShow" :disabled="formLoading">确 定</el-button>
      <el-button v-print="print" type="primary"  v-show="!isShow" :disabled="formLoading">打印电子面单</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as StoreOrderApi from '@/api/mall/order/storeOrder'
import * as ExpressApi from '@/api/mall/order/express'
import * as ElectronicsOrderApi from '@/api/mall/order/electronicsOrder'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
    id: undefined,
    updateType: "",
    orderId: undefined,
    orderType: 'send',
    extendOrderId: undefined,
    uid: undefined,
    realName: undefined,
    userPhone: undefined,
    userAddress: undefined,
    cartId: undefined,
    freightPrice: undefined,
    totalNum: undefined,
    totalPrice: undefined,
    totalPostage: undefined,
    payPrice: undefined,
    payPostage: undefined,
    deductionPrice: undefined,
    couponId: undefined,
    couponPrice: undefined,
    paid: undefined,
    payTime: undefined,
    payType: undefined,
    status: undefined,
    refundStatus: undefined,
    refundReasonWapImg: undefined,
    refundReasonWapExplain: undefined,
    refundReasonTime: undefined,
    refundReasonWap: undefined,
    refundReason: undefined,
    refundPrice: undefined,
    deliverySn: '',
    deliveryName: undefined,
    deliveryType: 'normal',
    deliveryId: undefined,
    gainIntegral: undefined,
    useIntegral: undefined,
    payIntegral: undefined,
    backIntegral: undefined,
    mark: undefined,
    unique: undefined,
    remark: undefined,
    merId: undefined,
    combinationId: undefined,
    pinkId: undefined,
    cost: undefined,
    seckillId: undefined,
    bargainId: undefined,
    verifyCode: undefined,
    storeId: undefined,
    shippingType: undefined,
    isChannel: undefined,
    isSystemDel: undefined
})
const formRules = reactive({
  deliverySn: [{ required: true, message: '快递公司不能为空', trigger: 'change' }],
  deliveryId: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

const express = ref([])
const electOrder = ref([])
const isShow = ref(true)
const electId = ref(0)
const printHtml = ref('')



const print = ref({
  id: 'printBox',//这里的id就是上面我们的打印区域id，实现指哪打哪
  popTitle: '快递电子面单打印', // 打印配置页上方的标题
  extraHead: '', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
  preview: false, // 是否启动预览模式，默认是false
  previewTitle: '预览的标题', // 打印预览的标题
  previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
  zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
  previewBeforeOpenCallback() {
    console.log('正在加载预览窗口！');
  }, // 预览窗口打开之前的callback
  previewOpenCallback() {
    console.log('已经加载完预览窗口，预览打开了！')
  }, // 预览窗口打开时的callback
  beforeOpenCallback() {
    //printShow.value = true;
    console.log('开始打印之前！')
  }, // 开始打印之前的callback
  openCallback() {
    console.log('执行打印了！')
  }, // 调用打印时的callback
  closeCallback() { console.log('关闭了打印工具！') }, // 关闭打印的callback(无法区分确认or取消)
  clickMounted() { console.log('点击v-print绑定的按钮了！') }
})

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  isShow.value = true
  electId.value = 0
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  express.value = await ExpressApi.getExpressList()
  electOrder.value = await ElectronicsOrderApi.getElectronicsOrderList()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StoreOrderApi.getStoreOrder(id)
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
    const data = formData.value as unknown as StoreOrderApi.StoreOrderVO
    data.updateType = formType.value
    await StoreOrderApi.updateStoreOrder(data)
    message.success(t('common.updateSuccess'))

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const selectExpress = (val) => {
  let obj = {};
  obj = express.value.find((item)=>{ // 这里的userList就是上面遍历的数据源
      return item.code === val; // 筛选出匹配数据
  })
  formData.value.deliveryName = obj.name
}

const selectOrder = async (val) => {
  if (val > 0) {
    printHtml.value = await StoreOrderApi.getOrderHtml(formData.value.id,val)
   }
}

const selectDelivery = (val) => {
  if (val == 'face') {
    isShow.value = false
  } else if (val == 'normal') {
    isShow.value = true
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    updateType: "",
    orderId: undefined,
    orderType: 'send',
    extendOrderId: undefined,
    uid: undefined,
    realName: undefined,
    userPhone: undefined,
    userAddress: undefined,
    cartId: undefined,
    freightPrice: undefined,
    totalNum: undefined,
    totalPrice: undefined,
    totalPostage: undefined,
    payPrice: undefined,
    payPostage: undefined,
    deductionPrice: undefined,
    couponId: undefined,
    couponPrice: undefined,
    paid: undefined,
    payTime: undefined,
    payType: undefined,
    status: undefined,
    refundStatus: undefined,
    refundReasonWapImg: undefined,
    refundReasonWapExplain: undefined,
    refundReasonTime: undefined,
    refundReasonWap: undefined,
    refundReason: undefined,
    refundPrice: undefined,
    deliverySn: '',
    deliveryName: undefined,
    deliveryType: 'normal',
    deliveryId: undefined,
    gainIntegral: undefined,
    useIntegral: undefined,
    payIntegral: undefined,
    backIntegral: undefined,
    mark: undefined,
    unique: undefined,
    remark: undefined,
    merId: undefined,
    combinationId: undefined,
    pinkId: undefined,
    cost: undefined,
    seckillId: undefined,
    bargainId: undefined,
    verifyCode: undefined,
    storeId: undefined,
    shippingType: undefined,
    isChannel: undefined,
    isSystemDel: undefined
  }
  formRef.value?.resetFields()
}
</script>
<style scoped>
.input-width {
    width: 50%;
  }
</style>
