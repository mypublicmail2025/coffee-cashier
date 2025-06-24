<script setup lang="ts" name="OrderDetail">
import { ref } from "vue";
import * as DistributorOrderApi from "@/api/distributor/order";
import { DistributorOrderDetail } from "@/types/distributor";
const dialogVisible = ref<boolean>(false)
const distributorDetail = ref({} as DistributorOrderDetail)

// 打开详情
const open = async (id: number) => {
  dialogVisible.value = true
  distributorDetail.value = await DistributorOrderApi.getDistributorOrderDetail(id)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<template>
  <Dialog title="订单详情" v-model="dialogVisible" width="50%">
    <div class="distributor">
      <h3>分销商信息</h3>
      <el-row>
        <el-col :span="12">
          <div class="distributor-item">一级分销商：{{distributorDetail.superiorNameP1}}</div>
          <div class="distributor-item">佣金比例：{{distributorDetail.firstWages ? distributorDetail.firstWages : 0}}%</div>
          <div class="distributor-item">佣金金额：￥{{distributorDetail.firstAmount ? distributorDetail.firstAmount : 0}}</div>
        </el-col>
        <el-col :span="12">
          <div class="distributor-item">二级分销商：{{distributorDetail.superiorNameP2}}</div>
          <div class="distributor-item">佣金比例：{{distributorDetail.secondWages ? distributorDetail.secondWages : 0}}%</div>
          <div class="distributor-item">佣金金额：￥{{distributorDetail.secondAmount ? distributorDetail.secondAmount : 0}}</div>
        </el-col>
      </el-row>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.distributor {
  h3 {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    margin: 10px 0 15px 0;
  }
  h4 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 15px;
    padding-left: 15px;
  }
  .avatar {
    margin-bottom: 15px;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 1px solid #eeeeee;
      margin-right: 10px;
    }
    .name {
      font-size: 16px;
      color: #666666;
    }
  }
  .distributor-item {
    font-size: 14px;
    color: #666666;
    margin-bottom: 10px;
    padding-left: 25px;
    .checkAndReturn {
      color: #00a0e9;
      margin-left: 10px;
      cursor: pointer;
      height: 25px;
      line-height: 25px;
    }
  }
}
</style>
