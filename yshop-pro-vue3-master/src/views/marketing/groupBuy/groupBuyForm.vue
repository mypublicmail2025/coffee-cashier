<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="visitDetail"
    >
      <div class="select-product">
        <h3>基本信息</h3>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入活动名称" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="is-required" label="活动时间">
            <el-date-picker
              v-model="timeData"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="活动说明">
        <el-input type="textarea" rows="4"  v-model="formData.remark" placeholder="请输入活动说明" maxlength="255" show-word-limit />
      </el-form-item>
      <div class="select-product">
        <h3>活动规则</h3>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="拼团人数" prop="person">
            <el-input-number style="width: 300px" v-model="formData.person" placeholder="请输入成团人数" :precision="0" :controls="false" :min="2" :max="99" />
            <i style="font-style: normal;color: #333333;margin-left: 5px">人</i>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拼团有效期" prop="effectiveTime">
            <el-input-number style="width: 300px" v-model="formData.effectiveTime" :precision="0" :controls="false" :min="1" placeholder="请输入成团有效期" />
            <i style="font-style: normal;color: #333333;margin-left: 5px">分钟</i>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="虚拟成团">
        <el-switch v-model="ifVirtual" @change="changeSwitch('ifVirtual')" />
        <p class="describe">开启虚拟成团后，在成团有效期内人数不够的团，系统会虚拟用户使拼团成功</p>
      </el-form-item>
      <el-form-item label="限购数量">
        <div class="flex">
          <el-switch v-model="ifLimit" @change="changeSwitch('ifLimit')" />
          <div v-if="ifLimit">
            <el-input-number style="margin-left:10px" v-model="formData.limitNumber" placeholder="请输限购数量" :precision="0" :controls="false" :min="1" />
            <i style="font-style: normal;color: #333333;margin-left: 5px">件</i>
          </div>
        </div>
      </el-form-item>
<!--      <el-form-item label="叠加优惠券">-->
<!--        <el-switch v-model="ifAdd" @change="changeSwitch('ifAdd')" />-->
<!--      </el-form-item>-->
      <el-form-item label="活动预热">
        <el-switch v-model="preheat" @change="changeSwitch('preheat')" />
        <div v-if="preheat">
          <el-input-number style="margin-left:10px" v-model="formData.enableTime" placeholder="请输预热时间" :precision="0" :controls="false" :min="1" />
          <i style="font-style: normal;color: #333333;margin-left: 5px">分钟</i>
        </div>
        <p class="describe">设置活动开始前会在商详页展示活动信息</p>
      </el-form-item>
      <div class="select-product">
        <h3>活动商品</h3>
        <div class="title flex">
          <div class="group-goods"><b>*</b>拼团商品</div>
          <div v-if="!visitDetail" class="group-goods-add"  @click="chooseProduct">添加商品</div>
        </div>
        <div class="product-list">
          <div class="tableBox">
            <el-table
              ref="multiple"
              :data="selectProductList"
              border
              :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
              tooltip-effect="dark"
              style="width: 100%"
              row-key="id"
              max-height="400"
            >
              <el-table-column label="商品信息" width="330" align="center">
                <template #default="scope">
                  <div class="flex">
                    <img height="80" width="80" :src="scope.row.image" alt="" />
                    <div class="product-info">
                      <h4>{{ scope.row.storeName }}</h4>
                      <div class="specification" v-if="scope.row.specType === 1">多规格</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格">
                <template #default="scope">
                  <span>{{ !visitDetail ? scope.row.price : scope.row.originalPrice }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="originalStock"
                label="库存"
              />
              <el-table-column label="拼团价" width="180" align="center">
                <template #default="scope">
                  <div class="set-specification"  v-if="scope.row.specType === 1">
                    <el-button @click="setSpecifications(scope.row)">设置规格信息</el-button>
                  </div>
                  <el-input-number
                    v-else
                    v-model="scope.row.skus[0].price"
                    :min="0"
                    :step="1"
                    controls-position="right"
                  />
                </template>
              </el-table-column>
              <el-table-column label="活动库存" width="180" align="center">
                <template #default="scope">
                  <el-input-number
                    v-if="scope.row.specType !== 1"
                    v-model="scope.row.skus[0].stock"
                    :min="0"
                    :step="1"
                    :precision="0"
                    controls-position="right"
                  />
                  <el-popover
                    v-else
                    placement="top-start"
                    title=""
                    :width="380"
                    trigger="hover"
                  >
                    <div class="tabBox">
                      <el-table
                        ref="skuTableRef"
                        :data="filterSkus(scope.row.skus)"
                        border
                        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
                        tooltip-effect="dark"
                        style="width: 100%"
                        max-height="300"
                      >
                        <el-table-column prop="sku" label="规格名" :show-overflow-tooltip="true" />
                        <el-table-column label="价格" align="center">
                          <template #default="skuScope">
                            <span>{{skuScope.row.price ? skuScope.row.price : 0 }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="库存" width="68" align="center">
                          <template #default="skuScope">
                            <span>{{ skuScope.row.stock ? skuScope.row.stock : 0 }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <template #reference>
                      <el-form label-width="100px" :model="formData">
                        <el-button class="m-2">查看价格与库存</el-button>
                      </el-form>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" v-if="!visitDetail">
                <template #default="scope">
                  <el-button
                    link
                    type="danger"
                    @click="handleDelete(scope.row.id)"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" v-if="!visitDetail" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <select-product ref="selectProductRef" @saveProduct="saveProduct"/>
  <set-product ref="setProductRef" @changeSpecification="changeSpecification"/>
</template>
<script setup lang="ts">
import * as StoreActivityApi from '@/api/marketing'
import SelectProduct from "@/views/marketing/components/SelectProduct.vue";
import SetProduct from "@/views/marketing/components/SetProduct.vue";
import {ActivityProduct, CreateActivity, SkuResp} from "@/types/activity";
import {ref} from "vue";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref<boolean>(false) // 弹窗的是否展示
const dialogTitle = ref<string>('') // 弹窗的标题
const formLoading = ref<boolean>(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref<string>('') // 表单的类型：create - 新增；update - 修改
const timeData = ref<any>([])
const multiple = ref()
const selectProductRef = ref()
const setProductRef = ref()
const visitDetail = ref<boolean>(false)
const formRules = reactive({
  name: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  person: [{ required: true, message: '拼团人数不能为空', trigger: 'blur' }],
  effectiveTime: [{ required: true, message: '拼团有效期不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const selectProductList = ref<ActivityProduct[]>([])

const initForm = (): CreateActivity => {
  return {
    name: '', // 活动名称
    type: 1, //  活动类型：1、拼团，2、秒杀，3、限时折扣
    startTime: null, // 活动开始时间
    endTime: null, // 活动结束时间
    ifLimit: 1, // 是否限购
    limitNumber: undefined, //  限购几件/人
    ifEnable: 1, //  活动预热 1-停用 2-启用
    enableTime: undefined, //  预热时间 （分钟）
    person: undefined, //  成团人数
    effectiveTime: undefined, //  成团有效时间几（分钟）
    remark: '', //  备注
    isVirtually: 0, //  是否虚拟成团:0-否，1-是
    id: null,
    details: []
    // ifAdd: 0, //  优惠券是否叠加 1-是 0-否
  }
}
const formData = ref<CreateActivity>(initForm())

const preheat = ref<boolean>(formData.value.ifEnable === 2) // 是否开启活动预热
// const ifAdd = ref<boolean>(!!formData.value.ifAdd) // 是否开启优惠券叠加
const ifVirtual = ref<boolean>(!!formData.value.isVirtually) // 是否开启虚拟成团
const ifLimit = ref<boolean>(formData.value.ifLimit === 2) // 是否开启限购
const currentProductId = ref<number | null>(null)
/** 打开弹窗 */
const open: (type: string, id?: number, disabled?: boolean) => Promise<void> = async (type, id, disabled) => {
  selectProductList.value = []
  selectProductRef.value.clear()
  visitDetail.value = false
  if (type === 'detail' && disabled) {
    visitDetail.value = disabled
  }
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data =  await StoreActivityApi.getStoreActivityInfo(id)
      formData.value = data
      selectProductList.value = data.details
      if (formData.value.startTime && formData.value.endTime) {
        timeData.value = [
          formatTimestamp(formData.value.startTime),
          formatTimestamp(formData.value.endTime)
        ];
      }
    } finally {
      formLoading.value = false
    }
  }
  preheat.value = formData.value.ifEnable === 2
  // ifAdd.value = !!formData.value.ifAdd
  ifVirtual.value = !!formData.value.isVirtually
  ifLimit.value = formData.value.ifLimit === 2
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 提交表单 */
const submitForm = async () => {
  await validateForm()
  if (!validateDetails()) {
    return false;
  }
  formLoading.value = true;
  // 如果所有校验都通过，进行数据转化和接口请求代码
  let date1 = new Date(timeData.value[0]);
  let date2 = new Date(timeData.value[1]);
  formData.value.startTime = date1.getTime();
  formData.value.endTime = date2.getTime();

  // 组合所有商品的规格详情
  formData.value.details = []
  // 遍历选中商品
  for (let item of selectProductList.value) {
    // 根据商品类型选择对应的规格列表
    if (item.skus) {
      let validSkus = item.skus.filter(sku => sku.price > 0);
      formData.value.details = formData.value.details.concat(validSkus);
    }
  }
  try {
    const data = formData.value as CreateActivity;
    if (formType.value === 'create') {
      await StoreActivityApi.createActivityApi(data)
      message.success(t('common.createSuccess'))
    } else {
      await StoreActivityApi.updateActivityApi(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    return true;
  } catch (e) {
    message.error('提交失败。');
    formLoading.value = false;
    return false;
  } finally {
    formLoading.value = false;
  }
}
// 表单校验
const validateForm = async () => {
  if (!formRef.value) {
    message.error('Form reference is not available.')
    return false;
  }
  const valid = await formRef.value.validate();
  if (!valid) {
    message.error('Form validation failed.')
    return false;
  }
  // 其他的校验逻辑
  // 检查开始和结束日期
  if (timeData.value.length === 0) {
    message.warning('请选择活动开始和结束日期')
    return false;
  }

  // 判断限购数量
  if (ifLimit.value && formData.value.limitNumber && formData.value.limitNumber <= 0) {
    message.error('限购数量必须大于0件')
    return false;
  }

  // 判断预热时间
  if (preheat.value && formData.value.enableTime && formData.value.enableTime <= 0) {
    message.error('预热时间必须大于0分钟')
    return false;
  }

  return true;
}
// 添加商品规格校验
const validateDetails = () => {
  // 检查是否有选中的商品
  if (!selectProductList.value.length) {
    message.error('请添加参与活动的商品')
    return false;
  }
  for (let product of selectProductList.value) {
    if (product.specType === 1) {
      let hasValidPrice = product.skus.some(sku => sku.price > 0);
      if (!hasValidPrice) {
        message.error(`所选商品${product.storeName}未选择规格参与活动`)
        return false;
      }
    } else {
      if (product.skus[0].price <=0 || product.skus[0].stock <=0) {
        message.error(`${product.storeName}该商品拼团价或库存必须大于0`)
        return false;
      }
    }
  }
  return true;
}
/** 重置表单 */
const resetForm: () => void = () => {
  timeData.value = []
  formData.value = initForm()
  formRef.value?.resetFields()
}

// 切换开关
const changeSwitch = (type: string) => {
  switch (type) {
    case 'ifVirtual':
      formData.value.isVirtually = ifVirtual.value ? 1 : 0 // 是否虚拟成团
      break;
    case 'ifLimit':
      formData.value.ifLimit = ifLimit.value ? 2 : 1 // 是否限购
      break;
    case 'preheat':
      formData.value.ifEnable = preheat.value ? 2 : 1 // 是否开启活动预热
      break;
    // default:
    //   formData.value.ifAdd = ifAdd.value ? 1 : 0 // 是否叠加优惠券
    //   break;
  }
}

// 选择商品选择器
const chooseProduct: () => void = () => {
  selectProductRef.value.open(selectProductList.value, visitDetail.value)
}
// 打开规格选择器
const setSpecifications = (item: ActivityProduct) => {
  currentProductId.value = item.id
  setProductRef.value.open(item, visitDetail.value, formData.value.type)
}

// 获取子组件提供的产品列表
const saveProduct = (list: ActivityProduct[]) => {
  let updatedSelectProductList = list.map(item2 => {
    return selectProductList.value.find(item1 => item1.id === item2.id) || item2;
  });
  selectProductList.value = updatedSelectProductList.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.id === item.id
      ))
  )
}

// 获取修改的规格
const changeSpecification = (data) => {
  selectProductList.value = selectProductList.value.map(product => {
    if (product.id === currentProductId.value) {
      product.skus = data
    }
    return product;
  });
}
const handleDelete = (id: number)  => {
  selectProductList.value = selectProductList.value.filter(item => item.id !== id);
}

// 日期格式化
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 过滤出已设置规格活动金额大于0的数据
const filterSkus = (skus: SkuResp[]) => {
  return skus.filter(item => item.price > 0)
}
</script>
<style lang="scss" scoped>
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
.describe {
  color: #999999;
  font-size: 12px;
  margin-left: 10px;
}
.limited {
  margin-left: 10px;
}
</style>
