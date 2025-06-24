<script setup lang="ts">
import * as ShopApi from '@/api/mall/shop/shop'
import BdMap from '@/components/BMap/index.vue'
import BdElectronicFence from '@/components/BdElectronicFence/index.vue'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
const emit = defineEmits(['success'])

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const timeData = ref([])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  storeName: undefined,
  storeIntro: undefined,
  storePhone: undefined,
  iconUrl: undefined,
  address: undefined,
  lon: undefined,
  lat: undefined,
  writeOffStartTime: 0,
  writeOffEndTime: 0,
  businessStartTime: '',
  businessEndTime: '',
  receiptSn: '',
  receiptKey: '',
  labelSn: '',
  labelKey: '',
  status: true,
  fence: '' // 围栏字符串: "经度_纬度,经度_纬度,..."
})
const formRules = reactive({
  storeName: [{ required: true, message: '门店名称不能为空', trigger: 'blur' }],
  storeIntro: [{ required: true, message: '门店简介不能为空', trigger: 'blur' }],
  storePhone: [{ required: true, message: '门店手机不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '门店地址不能为空', trigger: 'blur' }],
  lon: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  lat: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
  businessStartTime: [{ required: true, message: '营业开始时间不能为空', trigger: 'blur' }],
  businessEndTime: [{ required: true, message: '营业结束时间不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  receiptSn: [{ required: true, message: '小票打印机Sn不能为空', trigger: 'blur' }],
  receiptKey: [{ required: true, message: '小票打印机Key不能为空', trigger: 'blur' }],
  labelSn: [{ required: true, message: '标签打印机Sn不能为空', trigger: 'blur' }],
  labelKey: [{ required: true, message: '标签打印机Key不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

// 多边形围栏点位
const polygonPoints = ref([])

// 将点位数组转换为字符串格式
function pointsToString(points) {
  if (!points || points.length === 0) return ''
  return points.map((point) => `${point[0]}_${point[1]}`).join(',')
}

// 将字符串格式转换为点位数组
function stringToPoints(str) {
  if (!str) return []
  return str.split(',').map((item) => {
    const [lon, lat] = item.split('_')
    return [parseFloat(lon), parseFloat(lat)]
  })
}

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
      formData.value = await ShopApi.getShop(id)

      // 处理围栏数据
      if (formData.value.fence) {
        polygonPoints.value = stringToPoints(formData.value.fence)
      } else {
        polygonPoints.value = []
      }

      if (formData.value.writeOffStartTime && formData.value.writeOffEndTime) {
        timeData.value = [
          formatTimestamp(formData.value.writeOffStartTime),
          formatTimestamp(formData.value.writeOffEndTime)
        ]
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const aMapRef = ref()

function openAMap() {
  if (formData.value.lon) {
    aMapRef.value.open({
      lnglat: [formData.value.lon, formData.value.lat]
    })
  } else {
    aMapRef.value.open()
  }
}

// 打开地图进行围栏编辑
function openFenceMap(options) {
  if (!formData.value.lon || !formData.value.lat) {
    ElMessage.warning('请先选择门店位置')
    return
  }

  aMapRef.value.open({
    lnglat: [formData.value.lon, formData.value.lat],
    ...options,
    title: '编辑电子围栏'
  })
}

// 处理地图选择确认
async function handleAMapConfirm(data) {
  // 设置表单数据
  formData.value.lon = data.longitude
  formData.value.lat = data.latitude
  formData.value.address = data.address
}

async function handleConfirmPoints(points) {
  polygonPoints.value = points
  formData.value.fence = pointsToString(polygonPoints.value)
}

/** 表单提交 */
const submitForm = async () => {
  // 表单校验
  const valid = await formRef.value.validate()
  if (!valid) return

  // 处理围栏数据
  if (polygonPoints.value.length > 0 && polygonPoints.value.length < 3) {
    ElMessage.warning('多边形围栏至少需要3个点')
    return
  }

  // 将点位数组转换为字符串格式
  formData.value.fence = pointsToString(polygonPoints.value)

  // 提交请求
  formLoading.value = true
  try {
    const data = cloneDeep(formData.value)
    if (formType.value === 'create') {
      await ShopApi.createShop(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShopApi.updateShop(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
  emit('success')
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    storeName: undefined,
    storeIntro: undefined,
    storePhone: undefined,
    iconUrl: undefined,
    address: undefined,
    lon: undefined,
    lat: undefined,
    writeOffStartTime: 0,
    writeOffEndTime: 0,
    businessStartTime: '',
    businessEndTime: '',
    receiptSn: '',
    receiptKey: '',
    labelSn: '',
    labelKey: '',
    status: true,
    fence: ''
  }
  polygonPoints.value = []
  formRef.value?.resetFields()
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 处理日期变化
// function changeDate() {
//   // 更新核销时间
//   if (timeData.value && timeData.value.length === 2) {
//     formData.value.writeOffStartTime = new Date(timeData.value[0]).getTime()
//     formData.value.writeOffEndTime = new Date(timeData.value[1]).getTime()
//   }
// }

// 监听时间数据变化
watch(timeData, (newValue) => {
  if (newValue && newValue.length === 2) {
    formData.value.writeOffStartTime = new Date(newValue[0]).getTime()
    formData.value.writeOffEndTime = new Date(newValue[1]).getTime()
  }
})
</script>

<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <div class="shop-form-container">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="formData.storeName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店简介" prop="storeIntro">
          <el-input v-model="formData.storeIntro" placeholder="请输入门店简介" />
        </el-form-item>
        <el-form-item label="门店手机" prop="storePhone">
          <el-input v-model="formData.storePhone" placeholder="请输入门店手机" />
        </el-form-item>
        <el-form-item label="门店logo" prop="iconUrl">
          <Materials v-model="formData.iconUrl" :num="1" type="image" />
          <p class="ml-1">建议尺寸：100*100， jpg，jpeg，png格式</p>
        </el-form-item>
        <el-form-item label="选择地址">
          <el-button type="primary" @click="openAMap">打开地图</el-button>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="formData.address" placeholder="请选择地址" disabled />
        </el-form-item>
        <el-form-item label="经度" prop="lon">
          <el-input v-model="formData.lon" placeholder="请选择地址" disabled />
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input v-model="formData.lat" placeholder="请选择地址" disabled />
        </el-form-item>

        <el-form-item label="围栏区域">
          <BdElectronicFence
@confirm:points="handleConfirmPoints" v-model:points="polygonPoints"
            :center="formData.lon && formData.lat ? [formData.lon, formData.lat] : []" @open-map="openFenceMap" />
        </el-form-item>

        <el-form-item class="is-required" label="核销时间">
          <el-date-picker
v-model="timeData" type="datetimerange" :popper-options="{
              placement: 'top',
              boundariesPadding: 10
            }" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item class="is-required" label="营业时间">
          <div class="demo-time-range">
            <el-time-select
v-model="formData.businessStartTime" :max-time="formData.businessEndTime" class="mr-4"
              placeholder="开始时间" start="00:00" step="00:15" end="24:00" />
            至
            <el-time-select
v-model="formData.businessEndTime" :min-time="formData.businessStartTime" placeholder="结束时间"
              start="00:00" step="00:15" end="24:00" />
          </div>
        </el-form-item>
        <el-form-item label="小票机Sn" prop="lat">
          <el-input v-model="formData.receiptSn" placeholder="请输入小票打印机Sn"  />
        </el-form-item>
        <el-form-item label="小票机Key" prop="lat">
          <el-input v-model="formData.receiptKey" placeholder="请输入小票打印机Key"  />
        </el-form-item>
        <el-form-item label="标签机Sn" prop="lat">
          <el-input v-model="formData.labelSn" placeholder="请输入标签打印机Sn"  />
        </el-form-item>
        <el-form-item label="标签机Key" prop="lat">
          <el-input v-model="formData.labelKey" placeholder="请输入标签打印机Key"  />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <BdMap ref="aMapRef" @confirm="handleAMapConfirm" />
</template>

<style scoped>
.shop-form-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.el-divider {
  margin: 24px 0;
}
</style>
