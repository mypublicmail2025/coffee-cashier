<script setup lang="ts">
import * as IntegralRuleApi from '@/api/member/integralRule'
import * as DictDataApi from '@/api/system/dict/dict.data'
import { FormData } from "@/types/member"
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { ref, reactive } from "vue"

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  label: '',
  status: undefined,
  dictType: 'integral_config'
})
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref<FormData>({
  integralName: '', // 自定义积分名称
  integralEnable: '1', // 积分是否开启抵扣
  integralDeductionRule: 0, // 积分抵扣规则值
  ruleList: [],
  integral: 0,
  attribute1: undefined,
  checkInScore: 0
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  let isUnique = checkDuplication(formData.value.ruleList);
  if (!isUnique) {
    message.error('连续签到天数不能重复!')
    return false
  }
  formLoading.value = true
  try {
    await IntegralRuleApi.saveIntegralRule(formData.value)
    message.success(t('common.updateSuccess'))
    // 发送操作成功的事件
  } finally {
    formLoading.value = false
  }
}


/** 查询列表 */
const loading = ref(false)
const list = ref([])
const total = ref(0)
const getList = async () => {
  loading.value = true
  try {
    const data = await DictDataApi.getDictDataPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 查询积分规则
const getIntegrationRule = async () => {
  const data = await IntegralRuleApi.getIntegrationRule()
  formData.value = data
}
// 新增签到积分规则
const addSignRule = () => {
  formData.value.ruleList.push({
    attribute1: '',
    enable: false,
    integral: 0,
    type: "sign",
    typeName: "连续签到"
  })
  console.log(formData.value.ruleList, 'ruleList')
}
// 校验连续签到是否有重复项
function checkDuplication(ruleList) {
  let checkedValues: any[] = [];
  for (let rule of ruleList) {
    if (rule.type === 'sign') {
      if (checkedValues.includes(rule.attribute1)) {
        return false; // duplication found
      }
      checkedValues.push(rule.attribute1);
    }
  }
  return true;
}
// 删除连续签到积分规则
const deleteSignRule = (index) => {
  formData.value.ruleList.splice(index, 1);
}
onMounted(() => {
  getIntegrationRule()
  getList()
})
/** 重置表单 */
// const resetForm = () => {
//   formData.value = {
//     id: undefined,
//     type: undefined,
//     integralName: undefined,
//     integral: undefined,
//     attribute1: undefined
//   }
//   formRef.value?.resetFields()
// }
</script>
<template>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      class="rule-form"
    >
      <h3>积分自定义</h3>
      <el-form-item label="自定义名称" prop="integralName">
        <el-input v-model="formData.integralName" placeholder="积分" class="!w-240px" />
        <p class="describe">替换客户端“积分”名称</p>
      </el-form-item>
      <h3>积分奖励</h3>
      <div v-for="(item, index) of formData.ruleList" :key="item.id">
        <div class="checkbox-item" v-if="item.type !=='sign'">
          <el-checkbox v-model="item.enable" :label="item.typeName" size="large" />
          <span v-if="item.type === 'share_products'">分享商品获得</span>
          <span v-if="item.type === 'comment'">评价商品获得</span>
          <span v-if="item.type === 'consume'">获得1积分</span>
          <span v-if="item.type === 'login'">当天登录获得</span>
          <span v-if="item.type === 'register'">注册获得</span>
          <el-input-number
            v-model="item.integral"
            :min="0"
            :step="1"
            :precision="0"
            :controls="false"
          />
          <span>{{item.type === 'consume'?'元':'积分'}}</span>
        </div>
        <div class="checkbox-item" v-else-if="item.type === 'sign' && item.attribute1 === '1'">
          <el-checkbox v-model="item.enable" label="签到获得" size="large" style="margin-right: 10px" />
          <el-input-number
            v-model="item.integral"
            :min="0"
            :step="1"
            :precision="0"
            :controls="false"
          />
          <span>积分</span>
          <span class="sign-btn ml-1" @click="addSignRule">添加</span>
        </div>
        <div class="checkbox-item" v-else>
          <el-checkbox v-model="item.enable" label="连续签到" size="large" style="margin-right: 10px" />
          <el-input-number
            v-model="item.attribute1"
            :min="1"
            :step="1"
            :precision="0"
            :controls="false"
          />
          <span>天</span>
          <span>获得</span>
          <el-input-number
            v-model="item.integral"
            :min="0"
            :step="1"
            :precision="0"
            :controls="false"
          />
          <span>积分</span>
          <span class="sign-btn ml-1" @click="deleteSignRule(index)">删除</span>
        </div>
      </div>
      <div class="flex point-deduction">
        <h3>积分抵扣</h3>
        <el-switch v-model="formData.integralEnable" active-value="1" inactive-value="0"/>
      </div>
      <div class="checkbox-item">
        <span>抵扣规则</span>
        <el-input-number
          v-model="formData.integralDeductionRule"
          :min="0"
          :step="1"
          :precision="0"
          :controls="false"
        />
        <span>抵扣￥1.00</span>
      </div>
      <el-form-item>
        <el-button style="margin-top: 50px" @click="submitForm" type="primary" :disabled="formLoading">保 存</el-button>
      </el-form-item>
    </el-form>
</template>

<style lang="scss" scoped>
.rule-form {
  h3 {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
    margin: 30px 0;
  }
  .describe {
    margin-left: 10px;
    color: #999999;
  }
  .checkbox-item {
    display: flex;
    align-items: center;
    padding-left: 20px;
    span {
      margin: 0 5px;
      font-size: 14px;
      color: #999999;
    }
    .sign-btn {
      color: #00a0e9;
      font-weight: 500;
      cursor: pointer;
    }
  }
  .point-deduction {
    align-items: center;
    h3 {
      margin-right: 10px;
    }
  }
}
</style>
