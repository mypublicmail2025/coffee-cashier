<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px" @close="close" :close-on-click-modal="false">
    <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <div class="select-product">
        <h3>基本信息</h3>
      </div>
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input
:disabled="formType === 'detail'" type="text" placeholder="请输入优惠券名称" :maxlength="32" show-word-limit
          v-model="formData.couponName" />
      </el-form-item>
      <el-form-item label="优惠券图片" prop="image">
        <Materials v-model="formData.image" :num="1" type="image" />
      </el-form-item>
      <el-form-item label="优惠券描述">
        <el-input
type="textarea" :disabled="formType === 'detail'" v-model="formData.description" maxlength="400"
          placeholder="请输入优惠券描述" />
      </el-form-item>
      <el-form-item label="优惠券类型" props="couponType">
        <el-radio-group class="radio" v-model="formData.couponType" :disabled="formType === 'detail'">
          <el-radio :label="1">满减券</el-radio>
          <el-radio :label="2">折扣券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="兑换码类型" props="getType">
        <el-radio-group class="radio" v-model="formData.getType" :disabled="formType === 'detail'">
          <el-radio :label="0">无码</el-radio>
          <el-radio :label="1">通用码</el-radio>
          <el-radio :label="2">一卡一码</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="通用码" props="cdkey" v-if="formData.getType === 1">
        <el-input v-model="formData.cdkey" maxlength="200" placeholder="请输入通用码" :disabled="formType === 'detail'" />
      </el-form-item>
      <el-form-item class="timeDataBox" label="用券时间">
        <el-radio v-model="formData.expirationType" :label="1" :disabled="formType === 'detail'">固定时间</el-radio>
        <div class="dateBox">
          <el-form-item>
            <el-date-picker
v-model="fixedTimeData" :disabled="formData.expirationType === 2 || formType === 'detail'"
              type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item class="boxWidth">
        <el-radio v-model="formData.expirationType" :label="2" :disabled="formType === 'detail'">领券后立即生效，有效期</el-radio>
        <el-input
v-model="formData.expirationDay" maxlength="9"
          :disabled="formData.expirationType !== 2 || formType === 'detail'"
          oninput="value=value.replace(/[^\d]/g,'')" />天
      </el-form-item>
      <el-form-item class="boxWidth">
        <el-radio v-model="formData.expirationType" :label="3" :disabled="formType === 'detail'">无限制时间</el-radio>
      </el-form-item>
      <el-form-item label="活动说明">
        <el-input
type="textarea" v-model="formData.remark" maxlength="400" placeholder="请输入活动说明"
          :disabled="formType === 'detail'" />
      </el-form-item>
      <el-form-item label="门店范围" props="shopScope" required>
        <el-radio-group class="radio" v-model="formData.shopScope" :disabled="formType === 'detail'">
          <el-radio :label="1">全部门店</el-radio>
          <el-radio :label="2">指定门店</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.shopScope === 2" label="店铺"  prop="shopId">
        <el-select multiple :disabled="formType === 'detail'" v-model="formData.shopId" clearable placeholder="请选择店铺">
          <el-option v-for="item in shopList" :key="item.id" :label="item.storeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item class="boxWidth" label="发放数量" prop="totalNumber">
        <el-input
v-model="formData.totalNumber" maxlength="9" oninput="value=value.replace(/[^\d]/g,'')"
          :disabled="formType === 'detail'" />张
      </el-form-item>
      <el-form-item class="couponScope" label="适用商品" prop="couponScope">
        <el-radio v-model="formData.couponScope" :label="1" :disabled="formType === 'detail'">全部商品</el-radio>
        <el-radio
v-model="formData.couponScope" :label="2" @change="chooseProduct"
          :disabled="formType === 'detail'">指定商品可用</el-radio>
        <el-radio
v-model="formData.couponScope" :label="3" @change="chooseProduct"
          :disabled="formType === 'detail'">指定商品不可用</el-radio>
      </el-form-item>
      <div class="select-product" style="margin-bottom: 20px" v-if="formData.couponScope !== 1">
        <div class="title flex">
          <div v-if="formType === 'detail'" class="group-goods-add" @click="chooseProduct">添加商品</div>
        </div>
        <div class="product-list">
          <div class="tableBox">
            <el-table
:loading="loading" ref="multiple" :data="selectProductList" border
              :header-cell-style="{ background: '#EEF3FF', color: '#333333' }" tooltip-effect="dark" style="width: 100%"
              row-key="id" max-height="400">
              <el-table-column label="商品信息" width="330" align="center">
                <template #default="scope">
                  <div class="flex items-center">
                    <img height="80" width="80" :src="scope.row.image" alt="" />
                    <div class="product-info">
                      <h4>{{ scope.row.storeName }}</h4>
                      <!--                      <div class="specification" v-if="scope.row.specType === 1">多规格</div>-->
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="stock" label="库存" />
              <el-table-column label="操作" align="center" v-if="formType === 'detail'">
                <template #default="scope">
                  <el-button link type="danger" @click="handleDelete(scope.row.id)">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-form-item class="inputW" label="使用门槛" prop="threshold">
        <!-- 订单满<el-input v-model="form.threshold" :disabled="isThreshold" type="number" oninput="value=value.replace(/-/, '')" />元 -->
        订单满
        <el-input-number
v-model="formData.threshold" :disabled="isThreshold || formType === 'detail'" :controls="false"
          :max="999999999" :min="0" :precision="2" :step="0.01" style="margin: 0 8px" />
        元
        <el-checkbox v-model="isThreshold" @change="changeThreshold" :disabled="formType === 'detail'">无门槛</el-checkbox>
      </el-form-item>
      <el-form-item v-if="formData.couponType === 1" class="inputW" label="优惠内容" prop="couponValue">
        <!-- 减<el-input v-model="form.couponValue" type="number" />元 -->
        减
        <el-input-number
v-model="formData.couponValue" :controls="false" :max="999999999" :min="0" :precision="2"
          :step="0.01" style="margin: 0 8px" :disabled="formType === 'detail'" />
        元
      </el-form-item>
      <el-form-item v-else class="inputW discount" label="优惠内容" prop="discount">
        <!-- 打<el-input v-model="form.couponValue" type="number" />折 -->
        打
        <el-input-number
v-model="formData.discount" :controls="false" :min="0.1" :max="9.9" :precision="1" :step="0.1"
          :disabled="formType === 'detail'" />
        折
        <label>输入值要大于0 小于10，可保留一位小数</label>
      </el-form-item>

      <div class="select-product">
        <h3>活动规则</h3>
      </div>
      <el-form-item class="boxWidth" label="每人限领次数">
        <el-radio v-model="formData.receiveType" :label="1" :disabled="formType === 'detail'">无限制</el-radio>
        <el-radio v-model="formData.receiveType" :label="2" :disabled="formType === 'detail'">限制</el-radio>
        <el-input
v-model="formData.limitNumber" maxlength="9"
          :disabled="formData.receiveType === 1 || formType === 'detail'" oninput="value=value.replace(/[^\d]/g,'')" />次
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button v-show="formType !== 'detail'" type="primary" @click="addCouponFn">保 存</el-button>
      <el-button v-if="formType === 'detail'" type="primary" @click="goToCoupon">取 消</el-button>
      <el-button v-else @click="goToCoupon">取 消</el-button>
    </template>
  </Dialog>
  <select-product ref="selectProductRef" @save-product="saveProduct" />
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import * as StoreProductApi from '@/api/mall/product/product'
import * as ProductCouponApi from '@/api/mall/product/discountCoupon'
import SelectProduct from '@/views/marketing/components/SelectProduct.vue'
import { ActivityProduct } from '@/types/activity'
import * as ShopApi from '@/api/mall/shop/shop'
const { t } = useI18n() // 国际化
// const message = useMessage() // 消息弹窗
const shopList = ref<ShopApi.ShopVO[]>([]) // 店铺列表

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const selectProductList = ref<ActivityProduct[]>([])
const loading = ref(false)
const formRules = reactive({
  couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  couponValue: [{ required: true, message: '请输入优惠内容', trigger: 'blur' }],
  discount: [{ required: true, message: '请输入优惠内容', trigger: 'blur' }],
  shopScope  : [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  totalNumber: [{ required: true, message: '请输入发放张数', trigger: 'blur' }]
})
const selectProductRef = ref()
const ruleFormRef = ref()
// 优惠券使用的固定时间
const fixedTimeData = ref([])
// 优惠券是否无门槛
const isThreshold = shallowRef(true)
const currentType = shallowRef(1)
// const productList = ref([]) // 商品列表
// const productTotal = ref(0)
const multipleTableRef = ref()
const couponId = ref(null)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  storeName: null,
  isPostage: null,
  isShow: 1,
  stock: 1,
  ids: [],
  couponScope: null
})
// const multipleSelection = ref([])
const initCouponForm = () => {
  return {
    couponScope: 1, //  适用商品 1-全部商品 2-指定商品可用
    couponValue: null, // 优惠内容减多少元
    discount: null, // 打折数值
    couponName: '', //  优惠券名称
    couponType: 1, //  优惠券类型 1-满减券 2-折扣券
    expirationDay: null, //  领券当日几天内（天数）
    takingEffectTime: '', //  用券开始时间
    expirationTime: '', //  用券结束时间
    limitNumber: null, //  限制次数
    ids: [], //  选中的商品id数组
    totalNumber: null, //  发放数量
    receiveType: 1, //  每人限领次数 1-无限次 2-限制几次
    remark: '', //  备注
    threshold: 0, //  使用门槛满多少元，无门槛为0
    expirationType: 1, //  用券时间 1-固定时间 2-领券当日起几天内可用
    id: null,
    shopScope : 1,
    image: null,
    description: '',
    getType: 1
  }
}
const formData = ref(initCouponForm())
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  shopList.value = (
    await ShopApi.getShopPage({
      pageNo: 1,
      pageSize: 100
    })
  ).list
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  selectProductList.value = []
  formType.value = type
  formData.value = initCouponForm()
  // 修改时，设置数据
  if (id) {
    couponId.value = id
    formData.value.id = id
    formLoading.value = true
    try {
      getCouponInfo()
    } finally {
      formLoading.value = false
    }
  }
  
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
// 提交

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

// 选择商品
const chooseProduct = () => {
  selectProductRef.value.open(selectProductList.value, formType.value !== 'create')
}

const changeThreshold = (val) => {
  // 输入框值改变
  if (val) {
    formData.value.threshold = 0
  }
}

// 获取当前优惠券数据
const getCouponInfo = async () => {
  let res = await ProductCouponApi.getDiscountCoupon(couponId.value)
  console.log(res, 'res-test')
  formData.value = Object.assign(formData.value, res)
  if (formData.value.takingEffectTime && formData.value.expirationTime) {
    fixedTimeData.value = [
      formatTimestamp(formData.value.takingEffectTime),
      formatTimestamp(formData.value.expirationTime)
    ]
  }
  if (formData.value.shopScope === 2) {
    formData.value.shopId = formData.value?.shopId?.split(',').map(Number)
  }
  if (formData.value.couponScope !== 1) {
    // idList.value  = JSON.parse(formData.value.scopeValues);
    formData.value.ids = JSON.parse(formData.value.scopeValues)
    getProductList()
  } else {
    // idList.value = []
  }
  currentType.value = res.couponScope
}
const addCouponFn = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (formData.value.expirationType === 1 && fixedTimeData.value.length === 0) {
        ElMessage({
          message: '请选择用券时间开始和结束日期',
          type: 'warning'
        })
        return false
      }
      if (formData.value.expirationType === 2 && formData.value.effectiveDay === null) {
        ElMessage({
          message: '请填写领券多久内可以使用时间',
          type: 'warning'
        })
        return false
      }
      if (formData.value.shopScope === 2 && formData.value.shopId.length === 0) {
        ElMessage({
          message: '请选择店铺',
          type: 'warning'
        })
        return false
      }
      if (!formData.value.limitNumber && formData.value.receiveType === 2) {
        ElMessage({
          message: '请填写每人限领次数',
          type: 'warning'
        })
        return false
      }
      
      if (formData.value.couponType === 2) {
        var regExp = /^([1-9]{1})(.\d{1})?$/
        if (!regExp.test(formData.value.discount)) {
          ElMessage({
            message: '格式输入不正确',
            type: 'warning'
          })
          return false
        }
      }
      if ([2, 3].includes(parseInt(formData.value.couponScope))) {
        if (!formData.value.ids || !formData.value.ids.length || formData.value.ids.length === 0) {
          ElMessage({
            message: '请选择指定商品',
            type: 'warning'
          })
          return false
        }
      }
      let date1 = new Date(fixedTimeData.value[0])
      let date2 = new Date(fixedTimeData.value[1])
      formData.value.takingEffectTime = date1.getTime()
      formData.value.expirationTime = date2.getTime()
      const postData = {
        ...formData.value,
        shopId: formData.value.shopScope === 2 ? formData.value.shopId.join(',') : ''
      }
      if (formData.value.id) {
        await ProductCouponApi.updateDiscountCoupon(postData)
        ElMessage.success('修改成功')
        formData.value = initCouponForm()
        dialogVisible.value = false
        emit('success')
      } else {
        await ProductCouponApi.createDiscountCoupon(postData)
        ElMessage.success('提交成功')
        formData.value = initCouponForm()
        dialogVisible.value = false
        emit('success')
      }
    } else {
      return false
    }
  })
}

const goToCoupon = () => {
  dialogVisible.value = false
  emit('success')
}
const close = () => {
  dialogVisible.value = false
  formData.value = initCouponForm()
  queryParams.pageNo = 1
  fixedTimeData.value = []
  selectProductList.value = []
  multipleTableRef.value?.clearSelection()
  ruleFormRef.value?.resetFields()
}

// 获取商品列表
/** 查询列表 */
const getProductList = async () => {
  loading.value = true
  try {
    queryParams.couponScope = formData.value.couponScope
    queryParams.ids = JSON.parse(formData.value.scopeValues)
    const listData = await StoreProductApi.getSelectProductPage(queryParams)
    selectProductList.value = listData.list
    // if (visitDetail.value) {
    //   queryParams.couponScope = formData.value.couponScope
    //   queryParams.ids = JSON.parse(formData.value.scopeValues);
    //   const listData = await StoreProductApi.getSelectProductPage(queryParams)
    //   productList.value = listData.list
    //   productTotal.value = listData.total
    // } else {
    //   const listData = await StoreProductApi.getStoreProductPage(queryParams)
    //   productList.value = listData.list
    //   productTotal.value = listData.total
    //   // 点击编辑时回显表格勾选
    //   for (let i = 0; i < productList.value.length; i++) {
    //     if (idList.value.includes(productList.value[i].id)) {
    //       multipleTableRef.value.toggleRowSelection(productList.value[i])
    //     }
    //   }
    // }
  } finally {
    loading.value = false
  }
}

// 日期格式化
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return dateTimeString
}

// 获取子组件提供的产品列表
const saveProduct = (list: ActivityProduct[]) => {
  let updatedSelectProductList = list.map((item2) => {
    return selectProductList.value.find((item1) => item1.id === item2.id) || item2
  })
  selectProductList.value = updatedSelectProductList.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  )
  formData.value.ids = selectProductList.value.map((v) => {
    return v.id
  })
}

const handleDelete = (id: number) => {
  selectProductList.value = selectProductList.value.filter((item) => item.id !== id)
}
</script>
<style scoped>
.discount label {
  color: #cccccc;
  font-weight: 500;
  padding-left: 30px;
}
:deep(.boxWidth) .el-input {
  width: 100px;
  margin-right: 15px;
}
:deep(.inputW) .el-form-item__error {
  padding-left: 25px;
}
:deep(.inputW) .el-checkbox {
  margin-left: 20px;
}
:deep(.inputW) .el-radio {
  margin-left: 30px;
}
:deep(.discount) .el-input-number {
  margin: 0 8px;
}

.couponScope span {
  width: 100px;
  height: 30px;
  line-height: 30px;
  background: #66b1ff;
  color: #ffffff;
  text-align: center;
  display: inline-block;
  font-size: 14px;
  margin-right: 30px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  i {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    background: #ffffff;
    border-radius: 50%;
    border: 1px solid #66b1ff;
    text-align: center;
    color: #3a68f2;
    font-style: normal;
    font-size: 12px;
  }
}

.select-product {
  h3 {
    color: #333333;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .title {
    margin-bottom: 10px;
    .group-goods {
      b {
        font-weight: 400;
        color: #f56c6c;
      }
    }
    .group-goods-add {
      color: #409eff;
      cursor: pointer;
      margin-left: 5px;
    }
  }
  .product-info {
    h4 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      padding: 0 5px;
      text-align: left;
    }
    .specification {
      text-align: left;
      padding-left: 5px;
      margin-top: 10px;
      color: #409eff;
    }
  }
  .product-list {
    .set-specification {
      color: #333333;
    }
  }
}
</style>
