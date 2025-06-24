<template>
  <div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="250px"
      v-loading="formLoading"
    >
      <h3 class="title">会员成长任务配置</h3>
      <el-form-item label="下单获得经验" prop="consumeGrowthValue">
        <div>
          <el-input-number v-model="formData.consumeGrowthValue" :controls="false" :precision="0" :min="1" placeholder="请输入获得经验值" />
          <p class="text">用户实际支付1元，可以获得多少经验值</p>
        </div>
      </el-form-item>
      <el-form-item label="邀请新用户获得经验" prop="inviteGrowthValue">
        <div>
          <el-input-number v-model="formData.inviteGrowthValue" :controls="false" :precision="0" :min="1" placeholder="请输入获得经验值" />
          <p class="text">邀请一个新用户注册，赠送多少经验值</p>
        </div>
      </el-form-item>
    </el-form>
    <el-button class="btn-submit" @click="submitForm" type="primary">确 定</el-button>
  </div>
</template>
<script setup lang="ts">
import * as UserLevelGrowthValueConfigApi from '@/api/member/userLevelGrowthValueConfig'


const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
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
  formLoading.value = true
  try {
    const data = formData.value
    await UserLevelGrowthValueConfigApi.saveGrowthValueConfig(data)
    message.success(t('common.updateSuccess'))
  } finally {
    formLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getMemberTaskConfig()
})

const getMemberTaskConfig = async () => {
  const data = await UserLevelGrowthValueConfigApi.getGrowthValueConfig()
  if (data) {
    formData.value = data
  }
}
</script>

<style lang="scss" scoped>
.text{
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
.title{
  margin: 60px 0 30px 60px;
  &:first-child{
    margin-top: 0;
  }
}
.el-input{
  width: 300px;
}
.btn-submit{
  margin-left: 250px;
}
</style>
