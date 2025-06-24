<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200px">
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
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商品名称" maxlength="50" show-word-limit />
          </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item class="is-required" label="活动时间">
            <el-date-picker
              v-model="timeData"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled='unlimitedTime'
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
          <el-switch v-model="unlimitedTime" @change="changeSwitch"/>
          <p class="describe">无限制时间</p>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="商品简介">
        <el-input type="textarea" rows="4"  v-model="formData.remark" placeholder="请输入商品简介" maxlength="255" show-word-limit />
      </el-form-item>

      <div class="select-product">
        <h3>活动商品</h3>
        <div class="title flex">
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
              row-key="skuId"
              max-height="400"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                v-if="!visitDetail"
                type="selection"
                :reserve-selection="true"
                width="55"
              />
              <el-table-column label="规格信息" width="330" align="center">
                <template #default="scope">
                  <div class="flex items-center">
                    <img height="80" width="80" :src="scope.row.image" alt="" />
                    <div class="product-info">
                      <h4>{{ scope.row.sku }}</h4>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格">
                <template #default="scope">
                  <span>{{ scope.row.originalPrice }}</span>
                </template>
              </el-table-column>
              <el-table-column label="兑换价" width="180" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.price"
                    :min="0"
                    :step="1"
                    controls-position="right"
                  />
                </template>
              </el-table-column>
              <el-table-column label="积分" width="180" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.integral"
                    :min="0"
                    :step="1"
                    controls-position="right"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="originalStock"
                label="库存"
              />
              <el-table-column label="活动库存" width="180" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.stock"
                    :min="1"
                    :step="1"
                    controls-position="right"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="select-product" style="margin-top: 30px">
        <h3>活动规则</h3>
      </div>
      <el-form-item class="flex-item" label="">
        <div class="flex">
            <div>用户兑换数量限制</div>
            <div>
              <el-input-number style="margin-left:10px" v-model="formData.limitNumber" placeholder="请输限购数量" :precision="0" :controls="false" :min="1" />
              <p class="describe">每个用户可购买该商品总数限制。例如设置为1，表示本活动,每个用户最多可兑换总数1个</p>
            </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" v-if="!visitDetail" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <select-product ref="selectProductRef" :type="1" @saveProduct="saveProduct"/>
</template>
<script setup lang="ts">
import * as StoreActivityApi from '@/api/marketing'
import SelectProduct from "@/views/marketing/components/SelectProduct.vue";
import {ActivityProduct, CreateActivity} from "@/types/activity";
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
const visitDetail = ref<boolean>(false)
const unlimitedTime = ref<boolean>(false)
const formRules = reactive({
  name: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const selectProductList = ref<ActivityProduct[]>([])
const multipleSelection = ref<ActivityProduct[]>([])
const initForm = (): CreateActivity => {
  return {
    name: '', // 活动名称
    type: 4, //  活动类型：1、拼团，2、秒杀，3、限时折扣， 4、积分兑换
    startTime: null, // 活动开始时间
    endTime: null, // 活动结束时间
    ifLimit: 2, // 是否限购
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
const ifLimit = ref<boolean>(formData.value.ifLimit === 2) // 是否开启限购
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
      selectProductList.value = data.details[0].skus
      selectProductList.value.forEach(row=>{
        multiple.value!.toggleRowSelection(row, true)
        row.image = row.image || data.details[0].image
      })
      if (formData.value.startTime && formData.value.endTime) {
        timeData.value = [
          formatTimestamp(formData.value.startTime),
          formatTimestamp(formData.value.endTime)
        ];
        unlimitedTime.value = false
      } else {
        unlimitedTime.value = true
      }
    } finally {
      formLoading.value = false
    }
  }
  preheat.value = formData.value.ifEnable === 2
  // ifAdd.value = !!formData.value.ifAdd
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
  timeData.value = unlimitedTime.value?[]:timeData.value
  if(timeData.value.length>0){
    let date1 = new Date(timeData.value[0]);
    let date2 = new Date(timeData.value[1]);
    formData.value.startTime = date1.getTime();
    formData.value.endTime = date2.getTime();
  }

  // 组合所有商品的规格详情
  formData.value.details = multipleSelection.value
  console.log(formData.value,'formData')
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
  if (timeData.value.length === 0 && !unlimitedTime.value) {
    message.warning('请选择活动开始和结束日期')
    return false;
  }

  // 判断限购数量
  if (!formData.value.limitNumber || formData.value.limitNumber <= 0) {
    message.error('限购数量必须大于0件')
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
  if(!multipleSelection.value.length) {
    message.error('请添加要参与活动的规格')
    return false;
  }
  for (let sku of multipleSelection.value) {
      console.log(sku,!sku.price && String(sku.price) !== '0',sku.integral && sku.integral <=0,'multipleSelection.value')
      if (!sku.price && String(sku.price) !== '0') {
        message.error(`${sku.sku}该规格兑换价不能为空`)
        return false;
      }
    if (!sku.stock || sku.stock <=0) {
      message.error(`${sku.sku}该规格活动库存必须大于0`)
      return false;
    }
    if (!sku.integral || sku.integral <=0) {
      message.error(`${sku.sku}该规格积分必须大于0`)
      return false;
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
const changeSwitch = () => {

}

// 选择商品
const chooseProduct: () => void = () => {
  selectProductRef.value.open(selectProductList.value, visitDetail.value)
}

// 获取子组件提供的产品列表
const saveProduct = (list: ActivityProduct[]) => {
  selectProductList.value = list.filter(item=> item.originalStock > 0)
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

const handleSelectionChange = (val: ActivityProduct[]): void => {
  multipleSelection.value = val;
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
    margin-left:5px;
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
:deep(.flex-item){
  .el-form-item__content{
    display: flex;
    align-items: flex-start;
    margin-left: 0 !important;
    &:before{
      content: "*";
      color: var(--el-color-danger);
      margin-right: 4px;
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

:deep(.el-date-editor){
  overflow: hidden;
}
</style>
