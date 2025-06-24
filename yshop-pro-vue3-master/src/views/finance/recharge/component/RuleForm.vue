<!--
    @name: RuleForm
    @author: kahu4
    @date: 2024-02-02 17:27
    @description：RuleForm
    @update: 2024-02-02 17:27
-->
<script
  setup
  name="RuleForm"
  lang="ts">

import { getRechargeRule, setRechargeRule } from "@/api/finance/recharge";
import { Ref } from "vue";
import {Plus} from "@element-plus/icons-vue"
import { RechargeConfigModel } from "@/api/finance/recharge/index.model";
import { Editor } from "@/components/Editor";
import { ElMessage, ElMessageBox } from "element-plus";

const loading = ref(false)

const rechargeRule: Ref<RechargeConfigModel> = ref({
  customSwitch: 1, //自定义金额开关 0-关闭 1-开启
  customMin: 0,//自定义金额最小值
  content: '', //自定义金额内容
  rechargePackageBaseVOS: []
})

function openOne(){
  const find = rechargeRule.value.rechargePackageBaseVOS.find(i=>i.status===0);
  if(find){
    find.giftAmount = find.rechargeAmount = 0
    find.status =1
  }
}

function deleteOne(item){
  ElMessageBox.confirm("确认要删除吗？", "警告", {
    confirmButtonText:"删除",
    cancelButtonText: "取消",
    type: 'warning'
  }).then(()=>{
    item.giftAmount = item.rechargeAmount = 0
    item.status =0
  })
}


async function doGetRechargeRule() {
  try {
    loading.value = true
    rechargeRule.value = await getRechargeRule()
    rechargeRule.value.content =  rechargeRule.value.content || ''
  } finally {
    loading.value = false
  }
}

async function doUpdateRechargeRule(){
  try {
    loading.value = true
    await setRechargeRule(rechargeRule.value)
    ElMessage.success('保存成功')
    await doGetRechargeRule()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  doGetRechargeRule()
})
</script>

<template>
  <div v-loading="loading">
    <h2> 充值规则 </h2>
    <el-form class="w-[900px]" :model="rechargeRule" label-width="120px">
      <el-form-item label="充值套餐">
        <template v-for="(item,index) in rechargeRule.rechargePackageBaseVOS.filter(i=>i.status===1)" :key="index">
          <div class="flex w-full gap-[20px] mb-[10px] relative">
            <div
style="transform: translate(50%,-50%)"
              class=" cursor-pointer right-[0] top-[0] close absolute w-[20px] h-[20px] rounded-[50%] bg-[red] text-[#fff] flex justify-center items-center"
              @click="deleteOne(item)">
              x
            </div>
            <div class="label text-right w-[80px]">规则{{ index + 1}}</div>
            <div class="value p-[20px] box-content bg-[#f4f4f4] flex-grow flex items-center gap-[20px]">
              <div class="item flex items-center  gap-[20px]">
                <div class="">单笔充值满</div>
                <div class="">
                  <el-input-number v-model="item.rechargeAmount" :min="0" :controls="false" />
                  元
                </div>
              </div>
              <div class="item flex items-center  gap-[20px]">
                <div class="">充值奖励</div>
                <div class="">
                  <el-input-number v-model="item.giftAmount" :min="0" :controls="false" />
                  元
                </div>
              </div>
              <div class="item flex items-center  gap-[20px]">
                <div class="">图片</div>
                <div class="">
                  <Materials v-model="item.image" :num="1" type="image" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="flex justify-end w-full">
          <el-button
@click="openOne" class="w-full"
            :disabled="rechargeRule.rechargePackageBaseVOS.filter(i=>i.status===1).length>=10"> <el-icon
              class="mr-[15px]">
              <Plus />
            </el-icon>添加规则 </el-button>
        </div>
      </el-form-item>
      <el-form-item label="自定义金额充值">
        <el-switch v-model="rechargeRule.customSwitch" :active-value="1" :inactive-value="0" />
        <el-form-item label="最低充值金额" v-if="rechargeRule.customSwitch === 1">
          <div class="">
            <el-input-number v-model="rechargeRule.customMin" :min="0" :controls="false" />
            元
          </div>
        </el-form-item>
      </el-form-item>
      <el-form-item label="充值说明">
        <Editor v-model="rechargeRule.content" />
      </el-form-item>
      <div class="flex justify-end">
        <el-button type="primary" :disabled="loading" @click="doUpdateRechargeRule">保存</el-button>
      </div>
    </el-form>

  </div>
</template>

<style
  scoped
  lang="scss">

</style>
