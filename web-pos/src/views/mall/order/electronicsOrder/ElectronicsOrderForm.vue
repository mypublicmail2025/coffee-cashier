<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="160px"
      v-loading="formLoading"
    >
     <el-form-item label="面单名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入自定义名称" />
      </el-form-item>
      <el-form-item label="快递公司" prop="shipperId">
          <el-select v-model="formData.shipperId" placeholder="选择快递公司" >
            <el-option label="选择快递公司" value="" />
            <el-option
              v-for="item in express"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
      </el-form-item>
      <el-form-item label="运费支付方式" prop="paytype">
         <el-select v-model="formData.paytype" placeholder="选择运费支付方式" >
            <el-option label="运费支付方式" value="" />
            <el-option label="现付" :value="1"/>
            <el-option label="到付" :value="2"/>
            <el-option label="月结" :value="3"/>
            <el-option label="第三方付(仅SF支持)" :value="4"/>
          </el-select>
      </el-form-item>
      <el-form-item label="线下网点客户号" prop="customerName">
        <el-input v-model="formData.customerName" placeholder="请输入线下网点客户号" />
      </el-form-item>
      <el-form-item label="线下网点密码" prop="customerPwd">
        <el-input v-model="formData.customerPwd" placeholder="请输入线下网点密码" />
      </el-form-item>
      <el-form-item label="网点名称" prop="sendSite">
        <el-input v-model="formData.sendSite" placeholder="请输入网点名称" />
      </el-form-item>
      <el-form-item label="网点快递员" prop="sendStaff">
        <el-input v-model="formData.sendStaff" placeholder="请输入网点快递员" />
      </el-form-item>
      <el-form-item label="月结编号" prop="monthCode">
        <el-input v-model="formData.monthCode" placeholder="请输入月结编号" />
      </el-form-item>
      <el-form-item label="是否通知揽件" prop="isNotice">
        <el-radio-group v-model="formData.isNotice">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否返回电子面单模板" prop="isReturnTemp">
        <el-radio-group v-model="formData.isReturnTemp">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否需要短信提醒" prop="isSendMessage">
        <el-radio-group v-model="formData.isSendMessage">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="签回单操作要求" prop="operateRequire">
        <el-input v-model="formData.operateRequire" placeholder="请输入签回单操作要求(如：签名、盖章、身份证复印件等)" />
      </el-form-item>
      <el-form-item label="上门揽件开始时间" prop="startDate">
        <el-date-picker
          v-model="formData.startDate"
          type="date"
          value-format="x"
          placeholder="选择上门揽件开始时间"
        />
      </el-form-item>
      <el-form-item label="上门揽件结束时间" prop="endDate">
        <el-date-picker
          v-model="formData.endDate"
          type="date"
          value-format="x"
          placeholder="选择上门揽件结束时间"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="快递类型" prop="expType">
        <el-radio-group v-model="formData.expType">
          <el-radio :label="1">标准快件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否要签回单" prop="isReturnSignBill">
        <el-radio-group v-model="formData.isReturnSignBill">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发件人公司" prop="company">
        <el-input v-model="formData.company" placeholder="请输入发件人公司" />
      </el-form-item>
      <el-form-item label="发件人省" prop="provinceName">
        <el-input v-model="formData.provinceName" placeholder="请输入发件人省" />
      </el-form-item>
      <el-form-item label="发件人市" prop="cityName">
        <el-input v-model="formData.cityName" placeholder="请输入发件人市" />
      </el-form-item>
      <el-form-item label="发件人区" prop="expAreaName">
        <el-input v-model="formData.expAreaName" placeholder="请输入发件人区" />
      </el-form-item>
      <el-form-item label="发件人详细地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入发件人详细地址" />
      </el-form-item>
      <el-form-item label="发件人姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入发件人姓名" />
      </el-form-item>
      <el-form-item label="发件人电话" prop="tel">
        <el-input v-model="formData.tel" placeholder="请输入发件人电话" />
      </el-form-item>
      <el-form-item label="发件人手机号码" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入发件人手机号码" />
      </el-form-item>
      <el-form-item label="发件地邮编" prop="postCode">
        <el-input v-model="formData.postCode" placeholder="请输入发件地邮编" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as ElectronicsOrderApi from '@/api/mall/order/electronicsOrder'
import * as ExpressApi from '@/api/mall/order/express'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  shipperId: undefined,
  paytype: undefined,
  customerName: undefined,
  customerPwd: undefined,
  sendSite: undefined,
  sendStaff: undefined,
  monthCode: undefined,
  isNotice: undefined,
  isReturnTemp: undefined,
  isSendMessage: undefined,
  templateSize: undefined,
  operateRequire: undefined,
  logisticCode: undefined,
  startDate: undefined,
  endDate: undefined,
  remark: undefined,
  expType: undefined,
  isReturnSignBill: undefined,
  company: undefined,
  provinceName: undefined,
  cityName: undefined,
  expAreaName: undefined,
  address: undefined,
  name: undefined,
  tel: undefined,
  mobile: undefined,
  postCode: undefined,
  title: undefined
})
const formRules = reactive({
  title: [{ required: true, message: '面单名称不能为空', trigger: 'blur' }],
  paytype: [{ required: true, message: '运费支付方式不能为空', trigger: 'blur' }],
  shipperId: [{ required: true, message: '快递公司不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const express = ref([])

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  express.value = await ExpressApi.getExpressList()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ElectronicsOrderApi.getElectronicsOrder(id)
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
    const data = formData.value as unknown as ElectronicsOrderApi.ElectronicsOrderVO
    if (formType.value === 'create') {
      await ElectronicsOrderApi.createElectronicsOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await ElectronicsOrderApi.updateElectronicsOrder(data)
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
    shipperId: undefined,
    paytype: undefined,
    customerName: undefined,
    customerPwd: undefined,
    sendSite: undefined,
    sendStaff: undefined,
    monthCode: undefined,
    isNotice: 0,
    isReturnTemp: 0,
    isSendMessage: 0,
    templateSize: undefined,
    operateRequire: undefined,
    logisticCode: undefined,
    startDate: undefined,
    endDate: undefined,
    remark: undefined,
    expType: 1,
    isReturnSignBill: 0,
    company: undefined,
    provinceName: undefined,
    cityName: undefined,
    expAreaName: undefined,
    address: undefined,
    name: undefined,
    tel: undefined,
    mobile: undefined,
    postCode: undefined,
    title: undefined
  }
  formRef.value?.resetFields()
}
</script>
