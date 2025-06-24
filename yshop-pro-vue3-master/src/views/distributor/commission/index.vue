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
      <el-form-item label="订单号" prop="realName">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="用户" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.type" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ENTRYSTATUS)"
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
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="订单号" align="center" prop="orderId" width="190" />
      <el-table-column label="分销用户" align="center" prop="userName"  />
      <el-table-column label="分销金额" align="center" prop="amount"  />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <span v-if="scope.row.type === 0">待入账</span>
          <span v-if="scope.row.type === 1">已入账</span>
          <span v-if="scope.row.type === 2">已取消</span>
          <span v-if="scope.row.type === 3">提现中</span>
          <span v-if="scope.row.type === 4">提现成功</span>
          <span v-if="scope.row.type === 5">提现失败</span>
        </template>
      </el-table-column>
      <el-table-column label="入账方式" align="center">
        <template #default>
          <span>佣金钱包</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分佣时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="190"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as DistributorApi from "@/api/distributor/merchant";
import { ref, reactive } from "vue";
import {DistributorData} from "@/types/distributor";
interface QueryParams {
  pageNo: number
  pageSize: number
  type?: number;
  userName?: string;
  orderId?: number | null
  createTime: any
}

const loading = ref<boolean>(true);
const total = ref<number>(0);
const list = ref<DistributorData[]>([]);
const queryParams: QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: undefined,
  userName: "",
  orderId: null,
  createTime: []

})
const queryFormRef = ref() // 搜索的表单
/** 查询列表 */
const getList: ()=> Promise<void> = async () => {
  loading.value = true
  try {
    const data = await DistributorApi.getWagesLogPage(queryParams)
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
  queryParams.orderId = null
  queryParams.type=undefined
  handleQuery()
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
