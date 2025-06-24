<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="50%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
    >
      <!-- <el-form-item label="模板名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="计费方式" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地域以及费用" prop="regionInfo">
        <el-input v-model="formData.regionInfo" placeholder="请输入地域以及费用" />
      </el-form-item>
      <el-form-item label="指定包邮开关" prop="appoint">
        <el-radio-group v-model="formData.appoint">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group> 
      </el-form-item>
      <el-form-item label="指定包邮内容" prop="appointInfo">
        <el-input v-model="formData.appointInfo" placeholder="请输入指定包邮内容" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入排序" />
      </el-form-item> -->

      <el-row :gutter="24" type="flex">
        <el-col :xl="18" :lg="18" :md="18" :sm="24" :xs="24">
          <el-form-item label="模板名称：" prop="name" >
            <el-input type="text" placeholder="请输入模板名称" v-model="formData.name"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex">
        <el-col :xl="18" :lg="18" :md="18" :sm="24" :xs="24">
          <el-form-item label="计费方式：" props="state" >
            <el-radio-group class="radio" v-model="formData.type" >
              <el-radio :label="1">按件数</el-radio>
              <el-radio :label="2">按重量</el-radio>
              <el-radio :label="3">按体积</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex">
        <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item class="label" label="配送区域及运费：" props="state">
            <el-table
              ref="table"
              :data="templateList"
              empty-text="暂无数据"
              border
            >
              <el-table-column prop="regionName" label="可配送区域" width="130" />
              <el-table-column prop="first" label="首件" width="120">
                <template #header>
                  <span v-if="formData.type == 1">首件</span>
                  <span v-else-if="formData.type == 2">首件重量(KG)</span>
                  <span v-else>首件体积(m³)</span>
                </template>
                <template #default="scope">
                  <span><el-input type="text" v-model="scope.row.first" /></span>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="运费（元）" width="110">
                <template #default="scope">
                  <span><el-input type="text" v-model="scope.row.price"/></span>
                </template>
              </el-table-column>
              <el-table-column prop="_continue" label="续件" width="120">
                <template #header>
                  <span v-if="formData.type == 1">续件</span>
                  <span v-else-if="formData.type == 2">续件重量(KG)</span>
                  <span v-else>续件体积(m³)</span>
                </template>
                <template #default="scope">
                  <span><el-input type="text" v-model="scope.row._continue"/></span>
                </template>
              </el-table-column>
              <el-table-column prop="continue_price" label="续费（元）" width="110">
                <template #default="scope">
                  <span><el-input type="text" v-model="scope.row.continue_price"/></span>
                </template>
              </el-table-column>
              <el-table-column  label="操作">
                <template #default="scope">
                  <el-button v-if="scope.row.regionName!=='默认全国'" @click="delCity(scope.$index,1)">删除</el-button>
                </template>
              </el-table-column>

            </el-table>
            <el-row type="flex" class="addTop">
              <el-col>
                <el-button type="primary" icon="md-add" @click="addCity(1)">单独添加配送区域</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex">
        <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <el-form-item label="指定包邮：" prop="store_name">
            <el-radio-group class="radio" v-model="formData.appoint_check">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <el-table
              ref="table"
              :data="appointList"
              empty-text="暂无数据"
              border
              v-if="formData.appoint_check === 1"
            >
              <el-table-column prop="placeName" label="选择地区" width="130" />
              <el-table-column prop="a_num" label="包邮件数" width="120" >
                <template #header>
                  <span v-if="formData.type == 1">包邮件数</span>
                  <span v-else-if="formData.type == 2">包邮重量(KG)</span>
                  <span v-else>包邮体积(m³)</span>
                </template>
                <template #default="scope">
                  <span><el-input type="text" v-model="scope.row.a_num"/></span>
                </template>
              </el-table-column>
              <el-table-column prop="a_price" label="包邮金额（元）" width="130">
                <template #default="scope">
                  <span><el-input type="text" v-model="scope.row.a_price"/></span>
                </template>
              </el-table-column>
              <el-table-column  label="操作">
                <template #default="scope">
                  <a v-if="scope.row.regionName!=='默认全国'" @click="delCity(index,2)">删除</a>
                </template>
              </el-table-column>

            </el-table>
            <el-row type="flex" v-if="formData.appoint_check === 1">
              <el-col>
                <el-button type="primary" icon="md-add" @click="addCity(2)">单独指定包邮</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex">
        <el-col :xl="18" :lg="18" :md="18" :sm="24" :xs="24">
          <el-form-item label="排序：" prop="store_name">
            <el-input-number :min="0" placeholder="输入值越大越靠前" v-model="formData.sort" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">{{id ? '立即修改':'立即提交'}}</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
    <city ref="cityRef" @select-city="selectCity" :type="type" />
  </Dialog>
</template>
<script setup lang="ts">
import * as ShippingTemplatesApi from '@/api/mall/product/shippingTemplates'
import city from './city.vue';

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRules = reactive({
  name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const formData = ref({
          type: 1,
          sort: 0,
          name: '',
          appoint_check: 0
})
const appointList = ref([])
const tempId = ref(0)


const templateList = ref([
    {
      region: [
        {
          name: '默认全国',
          city_id: 0
        }
      ],
      regionName: '默认全国',
      first: 1,
      price: 0,
      _continue: 1,
      continue_price: 0
    }
])
const type = ref(1)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    tempId.value = id
    formLoading.value = true
    try {
      let data = await ShippingTemplatesApi.getShippingTemplates(id)
      formData.value = data
      formData.value.appoint_check = data.appoint || 0
      appointList.value = data.appointInfo ? eval('(' + data.appointInfo + ')') : []
      templateList.value =  eval('(' + data.regionInfo + ')')

    } finally {
      formLoading.value = false
    }
  }else{
    tempId.value = 0
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 删除
const delCity  = (index,type) =>{
  //console.log('index:',index)
  //console.log('templateList:',templateList.value)
  if (type === 1) {
    templateList.value.splice(index, 1);
  } else {
    appointList.value.splice(index, 1);
  }
}
// 单独添加配送区域
const cityRef = ref()
const addCity = (param) => {
  type.value = param;
   cityRef.value.getCityList()
}
// 提交
const handleSubmit = () => {
  if (!formData.value.name) {
    message.error('请填写模板名称')
    return
  }
  for (let i = 0; i < templateList.value.length; i++) {
    if (templateList.value[i].first <= 0) {
      message.error('首件/重量/体积应大于0')
      return
    }
    if (templateList.value[i].price < 0) {
      message.error('运费应大于等于0')
      return
    }
    if (templateList.value[i].continue <= 0) {
      message.error('续件/重量/体积应大于0')
      return
    }
    if (templateList.value[i].continue_price < 0) {
      message.error('续费应大于等于0')
      return
    }
  }
  if (formData.value.appoint_check === 1) {
    for (let i = 0; i < appointList.value.length; i++) {
      if (appointList.value[i].a_num <= 0) {
        if (formData.value.type === 2) {
          message.error('包邮重量应大于0')
          return
        } else {
          message.error('包邮件数应大于0')
          return
        }
        return false
      }
      if (appointList.value[i].a_price < 0) {
        message.error('包邮金额应大于等于0')
        return false
      }
    }
  }
  let data = {
    appoint_info: appointList.value,
    region_info: templateList.value,
    sort: formData.value.sort,
    type: formData.value.type,
    name: formData.value.name,
    appoint: formData.value.appoint_check
  }

  return data
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true

  const data = handleSubmit()
  if (!data) {
    formLoading.value = false
    return false
  }
  try {
   await ShippingTemplatesApi.createShippingTemplates(data,tempId.value)
    if (formType.value === 'create') {
      message.success(t('common.createSuccess'))
    } else {
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
    name: undefined,
    type: 1,
    regionInfo: undefined,
    appoint: undefined,
    appointInfo: undefined,
    sort: 0,
    appoint_check: 0
  }
  formRef.value?.resetFields()
  appointList.value = [];
  templateList.value = [
    {
      region: [
        {
          name: '默认全国',
          city_id: 0
        }
      ],
      regionName: '默认全国',
      first: 1,
      price: 0,
      _continue: 1,
      continue_price: 0
    }
  ]


}

const selectCity = (data, type) => {
    let cityName = data.map(function (item) {
      return item.name;
    }).join(';');
    switch (type) {
      case 1:
        templateList.value.push({
          region: data,
          regionName: cityName,
          first: 1,
          price: 0,
          _continue: 1,
          continue_price: 0
        });
        break;
      case 2:
        appointList.value.push({
          place: data,
          placeName: cityName,
          a_num: 0,
          a_price: 0
        });
        break;
    }
  }

</script>
