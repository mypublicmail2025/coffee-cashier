<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      @submit.enter.prevent
    >
      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMISSION_STATUS)"
            :key="String(dict.value)"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>

  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column label="订单号" align="center" prop="orderId" width="190" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="下单用户" align="center" prop="userName"  />
      <el-table-column label="结算时间" align="center" prop="settlementTime" :formatter="dateFormatter" width="190" />
      <el-table-column label="商品实付金额" align="center" prop="productPrice"  />
      <el-table-column label="推广分销商" align="center" prop="superiorNameP1"  />
      <el-table-column label="佣金金额" align="center" prop="firstAmount"  />
      <el-table-column label="佣金状态" align="center">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMISSION_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" prop="createTime" :formatter="dateFormatter" width="190"/>
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm(scope.row.id)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <order-detail ref="detailRef" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as DistributorOrderApi from "@/api/distributor/order";
import { ref, reactive } from "vue";
import {DistributorList} from "@/types/distributor";
import OrderDetail from "./components/OrderDetail.vue";
interface QueryParams {
  pageNo: number
  pageSize: number
  status?: number
  orderId?: number
  createTime: any
}
const detailRef = ref()
const loading = ref<boolean>(true);
const total = ref<number>(0);
const list = ref<DistributorList[]>([]);
const queryParams: QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  status: undefined,
  createTime: [],
  orderId: undefined
})
const queryFormRef = ref() // 搜索的表单
/** 查询列表 */
const getList: ()=> Promise<void> = async () => {
  loading.value = true
  try {
    const data = await DistributorOrderApi.getDistributorOrderPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
/** 搜索按钮操作 */
const handleQuery: () => void = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery: () => void = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
// 详情页
const openForm = (id:number) => {
  detailRef.value.open(id)
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.tableBox {
  margin-bottom: 50px;
}
</style>
