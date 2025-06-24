<template>
  <Dialog :title="dialogTitle" width="800px" v-model="dialogVisible">
    <el-form
ref="formRef" class="dialog-form" :model="formData" :rules="formRules" label-width="80px"
      v-loading="formLoading">
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="formData.name" maxlength="20" />
      </el-form-item>
      <!-- <el-form-item label="上线时间" prop="onlineTime">
        <el-date-picker
          v-model="formData.onlineTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="x"
        />
      </el-form-item> -->
      <el-form-item label="弹窗图片" prop="popupImage">
        <Materials v-model="formData.popupImage" :num="1" type="image" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title"  />
      </el-form-item>
      <el-form-item label="子标题" prop="subTitle">
        <el-input v-model="formData.subTitle"  />
      </el-form-item>
      <!--      <el-form-item label="关闭按钮" prop="buttonImage">-->
      <!--        <Materials v-model="formData.buttonImage" :num="1" type="image" />-->
      <!--      </el-form-item>-->
      <el-form-item label="跳转类型" prop="type">
        <el-radio-group v-model="formData.type" class="radio-link-type" @change="typeChange">
          <el-radio class="radio" :label="0">不跳转</el-radio>
          <el-radio class="radio" :label="1">商品</el-radio>
          <el-radio class="radio" :label="2">分类</el-radio>
          <el-radio class="radio" :label="3">优惠券</el-radio>
          <el-radio class="radio" :label="4">小程序</el-radio>
          <el-radio class="radio" :label="5">URL</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="弹框分组" prop="group">
        <el-select v-model="formData.group" clearable placeholder="请选择弹框分组">
          <el-option v-for="item in groupList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.type !== 0" label="链接配置" prop="linkData">
        <LinkConfig :data="linkData" :link-type="formData.type" @update:data="updateData" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as AdvertsApi from '@/api/mall/decoration/adverts'
import LinkConfig from './linkConfig.vue'
import { DICT_TYPE } from '@/utils/dict'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const linkData = ref({})
const formData = ref({
  name: '',
  // onlineTime: [],
  popupImage: '',
  buttonImage: '',
  type: 0,
  link: '',
  group: 'index',
  startTime: '',
  endTime: '',
  title: '',
  subTitle: ''
})
const formRules = reactive({
  name: [{ required: true, message: '广告名称不能为空', trigger: 'blur' }],
  // onlineTime: [{ required: true, message: '上线时间不能为空', trigger: 'blur' }],
  popupImage: [{ required: true, message: '弹窗图片不能为空', trigger: 'none' }],
  group: [{ required: true, message: '弹框分组不能为空', trigger: 'none' }],
  buttonImage: [{ required: true, message: '关闭按钮不能为空', trigger: 'none' }]
})
import { getStrDictOptions} from '@/utils/dict'

const formRef = ref() // 表单 Ref
const groupList = ref(getStrDictOptions(DICT_TYPE.ADVERTS_TYPE))
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AdvertsApi.getAdverts(id)
      // formData.value.onlineTime = [formData.value.startTime, formData.value.endTime]
      if(formData.value.type===5){
        linkData.value = {
          link: formData.value.link,
        }
      }else{
        linkData.value = JSON.parse(formData.value.link)
      }
      
    } finally {
      formLoading.value = false
    }
  } else {
    // formData.value.onlineTime = []
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
    // formData.value.startTime = formData.value.onlineTime[0]
    // formData.value.endTime = formData.value.onlineTime[1]
    // delete formData.value.onlineTime
    if(formData.value.type===5){
      formData.value.link = linkData.value.link
    }else{
      formData.value.link = JSON.stringify(linkData.value)
    }
    console.log(formData.value, linkData.value, 'formData')
    const data = formData.value as unknown as AdvertsApi.AdvertsVO
    if (formType.value === 'create') {
      await AdvertsApi.createAdverts(data)
      message.success(t('common.createSuccess'))
    } else {
      await AdvertsApi.updateAdverts(data)
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
    name: '',
    // onlineTime: [],
    popupImage: '',
    buttonImage: '',
    type: 0,
    link: '',
    group: '',
    startTime: '',
    endTime: '',
    title: '',
    subTitle: ''
  }
  formRef.value?.resetFields()
}

/** 类型切换 */
function typeChange() {
  linkData.value = {}
}
</script>

