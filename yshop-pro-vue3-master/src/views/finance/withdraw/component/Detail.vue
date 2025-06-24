<!--
    @name: Detail
    @author: kahu4
    @date: 2024-01-29 12:00
    @description：Detail
    @update: 2024-01-29 12:00
-->
<script
  setup
  lang="ts">
import { Ref, ref } from 'vue'
import { WithdrawVO } from "@/api/finance/withdraw/index.model";
import { getById } from "@/api/finance/withdraw";
import { formatTime } from "@/utils";
const showDialog = ref(false)
const detail:Ref<WithdrawVO|undefined> = ref()
async function open(row:WithdrawVO){
  detail.value = await getById({id:row.id});
  showDialog.value = true
}

function close(){
  showDialog.value = false
}
defineExpose({open,close})
</script>

<template>
  <el-dialog v-model="showDialog" title="详情" width="50%">
    <div class="w-full" v-if="detail">
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="会员昵称">{{ detail.distributorName }}</el-descriptions-item>
        <el-descriptions-item label="账号">{{ detail.accountNum }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">￥{{ detail.amount }}</el-descriptions-item>
        <el-descriptions-item label="提现方式">{{['余额','支付宝'][detail.methodType] }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ formatTime(detail.createTime, 'yyyy-MM-dd')}}</el-descriptions-item>
        <el-descriptions-item label="审核备注">{{ detail.content }}</el-descriptions-item>
        <el-descriptions-item label="提现状态">{{ ['待入账','已入账','已取消','提现中','提现成功','提现失败'][detail.type] }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </template>
  </el-dialog>
</template>

<style
  scoped
  lang="scss">

</style>
