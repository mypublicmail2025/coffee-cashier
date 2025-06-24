<script setup lang="ts">
import { ref } from 'vue'
import {
  getDistributionDictConfig,
  updateDistributionDictConfig
} from "@/api/system/dict/dict.type";
import { DICT_TYPE } from "@/utils/dict";
import { ElMessage } from "element-plus";
const formData = ref({
  isDistribution: 1,
  date: 0,
  distributionPurchase: 0,
  description: ''
})
const formLoading = ref<boolean>(false)

const formRules = reactive({
  image: [{ required: true, message: '商品图片不能为空', trigger: 'blur' }]
})
const myConfig = reactive( {
  autoHeightEnabled: false, // 编辑器不自动被内容撑高
  initialFrameHeight: 500, // 初始容器高度
  initialFrameWidth: '100%', // 初始容器宽度
  UEDITOR_HOME_URL: '/UEditor/',
  serverUrl: '',
  zIndex: 9999,
  toolbars: [
    [
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'underline',
      'fontborder',
      'strikethrough',
      'superscript',
      'subscript',
      'removeformat',
      'formatmatch',
      'autotypeset',
      'blockquote',
      'pasteplain',
      '|',
      'forecolor',
      'backcolor',
      'insertorderedlist',
      'insertunorderedlist',
      'selectall',
      'cleardoc',
      '|',
      'rowspacingtop',
      'rowspacingbottom',
      'lineheight',
      '|',
      'customstyle',
      'paragraph',
      'fontfamily',
      'fontsize',
      '|',
      'directionalityltr',
      'directionalityrtl',
      'indent',
      '|',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'justifyjustify',
      '|',
      'touppercase',
      'tolowercase',
      '|',
      'imagenone',
      'imageleft',
      'imageright',
      'imagecenter',
    ],
  ],
})

const addCustomDialog  = () => {
  window.UE.registerUI('yshop', function (editor, uiName) {
    let dialog = new window.UE.ui.Dialog({
      iframeUrl: '/yshop/materia/index',
      editor: editor,
      name: uiName,
      title: '上传图片',
      cssRules: 'width:1200px;height:650px;padding:20px;'
    });

    var btn = new window.UE.ui.Button({
      name: 'dialog-button',
      title: '上传图片',
      cssRules: `background-image: url(../../../assets/imgs/icons.png);background-position: -726px -77px;`,
      onclick: function () {
        dialog.render();
        dialog.open();
      }
    });

    return btn;
  }, 37);
}

const expireRadio = ref(0)

function handleExpireRadioChange(e){
  if(e===0){
    // 永久
    findOptionConfig(DICT_TYPE.DISTRIBUTOR_USER_EXPIRE).value = "-1"
  }else{
    findOptionConfig(DICT_TYPE.DISTRIBUTOR_USER_EXPIRE).value = "0"
  }
}

const loading = ref(false)
// 配置列表
const configList = ref([])

async function getOptionConfig(){
  try {
    loading.value = true
    configList.value = await getDistributionDictConfig();
    if(findOptionConfig(DICT_TYPE.DISTRIBUTOR_USER_EXPIRE).value==='-1'){
      expireRadio.value = 0
    }else{
      expireRadio.value = 1
    }
  } finally {
    loading.value = false
  }
}

function findOptionConfig(key:string):any{
  return configList.value.find((item:any) => item.dictType === key)
}

async function save(){
  try {
    loading.value = true
    await updateDistributionDictConfig(configList.value)
    await getOptionConfig()
    ElMessage.success('修改成功')
  } finally {
    loading.value = false
  }
}

getOptionConfig()

</script>

<template>
  <el-form
    v-if="configList.length>0"
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >
    <el-form-item label="客户保护期">
      <el-radio-group class="radio" v-model="expireRadio" @change="handleExpireRadioChange">
        <el-radio :label="0">永久</el-radio>
        <el-radio :label="1">
          自定义
        </el-radio>
      </el-radio-group>
      <template v-if="expireRadio===1">
        <el-input-number
          v-model="findOptionConfig(DICT_TYPE.DISTRIBUTOR_USER_EXPIRE).value"
          :min="0"
          :step="1"
          :precision="0"
          controls-position="right"
          class="ml-[5px]"
        />
        <span class="ml-[5px]">天</span>
      </template>
    </el-form-item>
    <el-form-item label="自动审核">
      <el-radio-group class="radio" v-model="findOptionConfig(DICT_TYPE.DISTRIBUTOR_APPLY).value">
        <el-radio label="1">开启</el-radio>
        <el-radio label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="自购返佣">
      <el-radio-group class="radio" v-model="findOptionConfig(DICT_TYPE.DISTRIBUTOR_PURCHASE).value">
        <el-radio label="1">开启</el-radio>
        <el-radio label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="分销协议">
      <vue-ueditor-wrap v-model="findOptionConfig(DICT_TYPE.DISTRIBUTOR_AGREEMENT).value" :config="myConfig" @before-init="addCustomDialog" style="width: 90%;" />
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="save" :loading="loading"> 保存 </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>
