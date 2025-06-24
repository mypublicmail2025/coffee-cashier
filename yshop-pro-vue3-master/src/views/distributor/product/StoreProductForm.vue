<template>
  <Dialog :title="dialogTitle" append-to-body="true" v-model="dialogVisible" width="60%">
    <el-form
      ref="formRef"
      :model="formValidate"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <div class="form-box">
        <h3 class="title-h3">商品信息</h3>
        <el-form-item>
          <div class="product-box flex">
            <img :src="formValidate.image" alt="" style="width: 120px; height: 120px" />
            <span>{{formValidate.store_name}}</span>
          </div>
        </el-form-item>
        <h3 class="title-h3">佣金设置</h3>
        <el-form-item label="是否参与">
          <el-radio-group class="radio" v-model="formValidate.isDistribution"  @change="switchingRules">
            <el-radio :label="1">参与</el-radio>
            <el-radio :label="0">不参与</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="formValidate.isDistribution">
          <el-form-item label="佣金规则">
            <el-radio-group class="radio" v-model="formValidate.distributionRule" @change="switchingRules">
              <el-radio :label="0">默认规则</el-radio>
              <el-radio :label="1">自定义规则</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分销层级">
            <el-radio-group class="radio" v-model="formValidate.distributionLevel" :disabled="formValidate.distributionRule===0">
              <el-radio :label="1">一级</el-radio>
              <el-radio :label="2">二级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分销自购">
            <el-radio-group class="radio" v-model="formValidate.distributionPurchase" :disabled="formValidate.distributionRule===0">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
            <p>分销自购开启后，分销商自己购买时，下单可以给自己返佣</p>
          </el-form-item>
          <el-form-item label="商品结算方式">
            <el-radio-group class="radio" v-model="formValidate.distributionProductSettlement" :disabled="formValidate.distributionRule===0">
              <el-radio :label="0">实际支付价</el-radio>
              <el-radio :label="1">商品价</el-radio>
            </el-radio-group>
            <p>商品价: 商品实际售价/规格价，实际支付价:实际支付的费用(不含运费)</p>
          </el-form-item>
          <el-form-item label="佣金结算方式">
            <el-radio-group class="radio" v-model="formValidate.distributionWagesSettlement" :disabled="formValidate.distributionRule===0">
<!--              <el-radio :label="0">支付后结算</el-radio>-->
              <el-radio :label="1">确认收货结算</el-radio>
              <el-radio :label="2">订单完成结算</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 多规格设置-->
          <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" v-if="manyFormValidate.length && formValidate.header.length!==0 && attrs.length!==0 && formValidate.distributionRule === 1">
            <!-- 多规格表格-->
            <el-col :span="24">
              <el-form-item class="labeltop">
                <el-table v-if="showTable" :data="manyFormValidate" size="small" style="width: 90%;" max-height="300" border :header-cell-style="{ background: '#EEF3FF', color: '#333333' }" tooltip-effect="dark">
                  <el-table-column prop="pic" label="图片" align="center">
                    <template #default="scope">
                      <img :src="scope.row.pic" alt="" style="width: 60px; height: 60px; margin: 0 auto" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="sku" label="规格名称" align="center" />
                  <el-table-column prop="price" label="售价" align="center">
                    <template #default="scope">
                      <span>{{scope.row.price}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="firstWages" label="一级佣金比例" align="center">
                    <template #default="scope">
                      <div class="flex">
                        <el-input-number
                          v-model="scope.row.firstWages"
                          :min="0"
                          :step="1"
                          :precision="0"
                          controls-position="right"
                        />
                        <i style="font-style: normal;margin-left: 5px">%</i>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="secondWages" label="二级佣金比例" align="center" v-if="formValidate.distributionLevel === 2">
                    <template #default="scope">
                      <div class="flex">
                        <el-input-number
                          v-model="scope.row.secondWages"
                          :min="0"
                          :max="99"
                          :step="1"
                          :precision="0"
                          controls-position="right"
                        />
                        <i style="font-style: normal;margin-left: 5px">%</i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-col>
          <!-- 单规格表格-->
          <el-col :xl="23" :lg="24" :md="24" :sm="24" :xs="24" v-if="formValidate.spec_type === 0 && formValidate.distributionRule === 1">
            <el-form-item >
              <el-table :data="oneFormValidate"  size="small" style="width: 90%;" max-height="300" border :header-cell-style="{ background: '#EEF3FF', color: '#333333' }" tooltip-effect="dark">
                <el-table-column prop="pic" label="图片" align="center">
                  <template #default="scope">
                    <img :src="scope.row.pic" alt="" style="width: 60px; height: 60px; margin: 0 auto" />
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="售价" align="center">
                  <template #default="scope">
                    <span>{{scope.row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="firstWages" label="一级佣金比例" align="center">
                  <template #default="scope">
                    <div class="flex">
                      <el-input-number
                        v-model="scope.row.firstWages"
                        :min="0"
                        :step="1"
                        :precision="0"
                        controls-position="right"
                      />
                      <i style="font-style: normal;margin-left: 5px">%</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="secondWages" label="二级佣金比例" align="center" v-if="formValidate.distributionLevel === 2">
                  <template #default="scope">
                    <div class="flex">
                      <el-input-number
                        v-model="scope.row.secondWages"
                        :min="1"
                        :max="99"
                        :step="1"
                        :precision="0"
                        controls-position="right"
                      />
                      <i style="font-style: normal;margin-left: 5px">%</i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as StoreProductApi from '@/api/mall/product/product'
import {getDistributionDictConfig} from "@/api/system/dict/dict.type";
import {DICT_TYPE} from "@/utils/dict";
import {ref} from "vue";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formValidate = ref({
    imageArr:[],
    sliderImageArr: [],
    store_name: '',
    cate_id: '',
    keyword: '',
    unit_name: '',
    store_info: '',
    image: '',
    slider_image: [],
    description: '',
    ficti: 0,
    give_integral: 0,
    sort: 0,
    is_show: 1,
    price: 0,
    otPrice: 0,
    stock: 0,
    is_new: 0,
    postage: 0,
    is_postage: 0,
    is_sub: 0,
    is_integral: 0,
    id: 0,
    spec_type: 0,
    temp_id: '',
    attrs: [],
    items: [
      {
        pic: '',
        price: 0,
        cost: 0,
        ot_price: 0,
        stock: 0,
        bar_code: '',
        integral:0
      }
    ],
    header: [],
    selectRule: '',
    isDistribution: 0,
    distributionRule: 0,
    distributionPurchase: 1,
    distributionProductSettlement: 0,
    distributionWagesSettlement: 2,
    distributionLevel: 2
})

const manyFormValidate = ref([])
const oneFormValidate = ref([
  {
    imageArr: [],
    pic: '',
    price: 2,
    cost: 0,
    ot_price: 0,
    stock: 0,
    seckill_stock: 0,
    seckill_price: 0,
    pink_stock: 0,
    pink_price: 0,
    bar_code: '',
    weight: 0,
    volume: 0,
    brokerage: 0,
    brokerage_two: 0,
    integral: 0,
    firstWages:0,
    secondWages:0,
  }
])

const formRules = reactive({
  image: [{ required: true, message: '商品图片不能为空', trigger: 'blur' }],
  slider_image: [{ required: true, message: '轮播图不能为空', trigger: 'blur' }],
  store_name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
  store_info: [{ required: true, message: '商品简介不能为空', trigger: 'blur' }],
  keyword: [{ required: true, message: '关键字不能为空', trigger: 'blur' }],
  cate_id: [{ required: true, message: '分类id不能为空', trigger: 'blur' }],
  price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
})
const ruleList = ref([])
const attrs = ref([])
// 规格数据
const createBnt = ref(false)
const postageSet = ref(false) //false -固定  true 运费模板
const templateList = ref([])
// 批量设置表格data
const oneFormBatch = ref([
  {
    pic: '',
    price: 0,
    cost: 0,
    ot_price: 0,
    stock: 0,
    bar_code: '',
    seckill_stock: 0,
    seckill_price: 0,
    pink_stock: 0,
    pink_price: 0,
    weight: 0,
    volume: 0,
    integral:0
  }
])


const formRef = ref() // 表单 Ref
const activeName = ref('one')

/** 打开弹窗 */
const open = (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  activeName.value = 'one'
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = false
  } else {
    id = 0
  }
  getOptionConfig()
  getInfo(id)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
 // const valid = await formRef.value.validate()
  formRef.value.validate((valid, fields) => {
  if (valid) {
    console.log(fields)
  } else {
    return message.warning('请添加基本信息')
  }
  })
  // 检查分销层级并删除 secondWages
  if (formValidate.value.distributionLevel === 1) {
    const arr = formValidate.value.spec_type ? manyFormValidate.value : oneFormValidate.value;
    arr.forEach((item) => {
      item.secondWages = 0
    });
  }
  console.log(formValidate.value, 'formValidate.value')
  // 提交请求
  if (formValidate.value.isDistribution && formValidate.value.distributionRule) {
    let arr = formValidate.value.spec_type ? manyFormValidate.value : oneFormValidate.value


    formValidate.value.distributionLevel === 1
    if(!validateDetails(arr)) {
      return false
    }
  }
  formLoading.value = true
  try {
     if(formValidate.value.spec_type ===0 ){
        formValidate.value.attrs = oneFormValidate.value;
        formValidate.value.header = [];
        formValidate.value.items = [];
      }else{
        formValidate.value.items = attrs.value;
        formValidate.value.attrs = manyFormValidate.value;
      }
      if(formValidate.value.spec_type === 1 && manyFormValidate.value.length===0){
        return message.warning('请点击生成规格！');
      }
      if(postageSet.value && !formValidate.value.temp_id){
        return message.warning('请选择运费模板！');
      }
      await StoreProductApi.createStoreProduct(formValidate.value)
      dialogVisible.value = false
    // 发送操作成功的事件
    message.success('设置成功');
    emit('success')
  } finally {
    formLoading.value = false
  }
}
// 切换分销规则
const switchingRules = () => {
  if (!formValidate.value.distributionRule) {
    formValidate.value.distributionProductSettlement = 0
    formValidate.value.distributionPurchase = 1
    formValidate.value.distributionWagesSettlement = 2
    formValidate.value.distributionLevel = 2
  }
}
/** 重置表单 */
const resetForm = () => {
  formValidate.value = {
    imageArr: [],
    sliderImageArr: [],
    store_name: '',
    cate_id: '',
    keyword: '',
    unit_name: '',
    store_info: '',
    image: '',
    slider_image: [],
    description: '',
    ficti: 0,
    give_integral: 0,
    sort: 0,
    is_show: 1,
    price: 0,
    otPrice: 0,
    stock: 0,
    is_new: 0,
    postage: 0,
    is_postage: 0,
    is_sub: 0,
    is_integral: 0,
    id: 0,
    spec_type: 0,
    temp_id: '',
    attrs: [],
    items: [
      {
        pic: '',
        price: 0,
        cost: 0,
        ot_price: 0,
        stock: 0,
        bar_code: '',
        integral: 0
      }
    ],
    header: [],
    selectRule: '',
    isDistribution: 0,
    distributionRule: 0,
    distributionPurchase: 1,
    distributionProductSettlement: 0,
    distributionWagesSettlement: 0,
    distributionLevel: 2
  }
  attrs.value = []
  formRef.value?.resetFields()
}

 // 详情
const getInfo = (id) => {
     // let that = this;
      StoreProductApi.getStoreProductInfo(id).then(async res => {
      let data = res.productInfo;
        console.log('data:', data)
      postageSet.value = false
      if(data){
       // let cate_id = parseInt(data.cate_id) || 0;
        if(data.temp_id > 0) postageSet.value = true
        attrs.value = data.items || [];
        formValidate.value = data;
        formValidate.value.cate_id = data.cate_id;
        if (data.attr) {
          oneFormValidate.value = [data.attr];
        }
        formValidate.value.header = [];
        generate();
        if (data.attrs) {
          manyFormValidate.value = data.attrs;
        }
        console.log('data2:',formValidate.value.spec_type)
        if(data.spec_type === 0){
          manyFormValidate.value = [];
        }else {
          createBnt.value = true;
          oneFormValidate.value = [
            {
              imageArr: [],
              pic: '',
              price: 0,
              cost: 0,
              ot_price: 0,
              stock: 0,
              seckill_stock: 0,
              seckill_price: 0,
              pink_stock: 0,
              pink_price: 0,
              bar_code: '',
              weight:0,
              volume:0,
              brokerage:0,
              brokerage_two:0,
              integral:0,
              firstWages:0,
              secondWages:0,
            }
          ]

           console.log('spec_type2:',formValidate.value.spec_type)
        }
      }

      ruleList.value = res.ruleList;
      templateList.value = res.tempList;

    }).catch(res => {
      console.log('err:'+res)
    })
}

const route = useRoute()
const showTable = ref(true)
 // 立即生成
const generate = () => {
  StoreProductApi.isFormatAttr(formValidate.value.id, { attrs: attrs.value }).then(res => {
    showTable.value = false
    console.log(res)
    manyFormValidate.value = res.value;
    res.header.push(
      {
        title: '一级佣金比例',
        slot: 'firstWages',
        align: "center",
        key: "value2",
        minWidth: "100",
      },
      {
        title: '二级佣金比例',
        slot: 'secondWages',
        align: "center",
        key: "value2",
        minWidth: "100",
      }
    )
    let headerdel = {
      title: '操作',
      slot: 'action',
      fixed: 'right',
      width: 220
    };
    res.header.push(headerdel);
    formValidate.value.header = res.header;
    //this.formValidate.attrs = res.attr;
    let header = res.header;
    header.pop();
    if (!route.params.id && formValidate.value.spec_type === 1) {
      manyFormValidate.value.map((item) => {
        item.pic = formValidate.value.image
      });
      oneFormBatch.value[0].pic = formValidate.value.image;
    }
    showTable.value = true
  }).catch(res => {
   console.log('err:'+res)
  })
}
const validateDetails = (arr) => {
  console.log(arr, 'manyFormValidate')
  for (let item of arr) {
    const { firstWages, secondWages, sku } = item;
    // 字段缺失或者值小于等于0，抛出错误
    if (formValidate.value.distributionLevel === 1) {
      // 如果是一级分销，只校验一级佣金比例
      if (!(firstWages > 0)) {
        message.error(sku ? `规格名为${sku}的一级佣金比例未正常填写` : '该商品的一级佣金比例未正常填写');
        return false;
      }
    } else if (formValidate.value.distributionLevel === 2) {
      // 如果是二级分销，校验一级和二级佣金比例
      if (!(firstWages > 0) || !(secondWages > 0)) {
        message.error(sku ? `规格名为${sku}的一级佣金比例或二级佣金比例未正常填写` : '该商品的一级佣金比例或二级佣金比例未正常填写');
        return false;
      }
    }
  }

  // 验证全部通过，返回 true
  return true;
};
const configList = ref([])
async function getOptionConfig(){
  try {
    configList.value = await getDistributionDictConfig();
    if (formValidate.value.distributionRule === 0) {
      formValidate.value.distributionPurchase = findOptionConfig(DICT_TYPE.DISTRIBUTOR_USER_EXPIRE).value === '0' ? 0 : 1;
      console.log(formValidate.value.distributionPurchase, '---distributionPurchase')
    }
  } finally {
  }
}

function findOptionConfig(key:string):any{
  return configList.value.find((item:any) => item.dictType === key)
}

</script>

<style lang="scss" scoped>
.form-box {
  padding-left: 20px;
  p {
    margin-left: 20px;
    color: #999999;
  }
  .title-h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    margin: 20px 0 15px 0;
  }
  .product-box {
    margin-top: 15px;
    img {
      border: 1px solid #eeeeee;
      margin-right: 15px;
    }
  }
}
</style>
