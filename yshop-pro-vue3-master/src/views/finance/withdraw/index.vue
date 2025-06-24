<!--
    @name: index
    @author: kahu4
    @date: 2024-01-29 11:30
    @description：index
    @update: 2024-01-29 11:30
-->
<script
  setup
  lang="ts">
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import { Ref, ref } from "vue";
import Detail from "@/views/finance/withdraw/component/Detail.vue";
import Audit from "@/views/finance/withdraw/component/Audit.vue";
import { exportExcel, getList } from "@/api/finance/withdraw";
import {
  WidthType,
  WithdrawQuery,
  WithdrawVO
} from "@/api/finance/withdraw/index.model";
import { dateFormatter } from "@/utils/formatTime";
import download from "@/utils/download";

const loading = ref(false)
const searchForm:Ref<WithdrawQuery> = ref({
  pageNo: 1, // 当前页数
  pageSize: 10, // 每页显示多少条
  createTime:[],
  type:undefined,
  distributorName:undefined
})
const total = ref(0)
const list:Ref<WithdrawVO[]> = ref([])

async function doGetList(){
  try {
    loading.value = true
    const res = await getList(searchForm.value);
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function reset(){
  searchForm.value.createTime = []
  searchForm.value.type=undefined
  searchForm.value.distributorName = ""
  doGetList()
}

const exportLoading = ref(false)
/** 导出按钮操作 */
async function handleExport () {
  try {
    // 发起导出
    exportLoading.value = true
    const data = await exportExcel()
    download.excel(data, '提现列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// ====================== 详情 ============================
const detailRef = ref()

/**
 * 详情
 * @param row
 */
function handleDetail(row:WithdrawVO){
  detailRef.value.open(row)
}

// ====================== 审核 =============================
const auditRef = ref()

/**
 * 审核
 * @param id
 */
function handleAudit(id:any){
  auditRef.value.open(id)
}



onMounted(()=>{
})
doGetList()
</script>

<template>
  <!-- 搜索 -->
  <ContentWrap>
    <el-row
      :gutter="20"
      class="w-full">
      <el-form
        class="w-full flex flex-wrap gap-10"
        ref="searchFormRef"
        :mode="searchForm">
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="searchForm.distributorName" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.type" clearable>
            <el-option
              label="待入账"
              :value="WidthType.WAIT" />
            <el-option
              label="已入账"
              :value="WidthType.COMPLETE" />
            <el-option
              label="已取消"
              :value="WidthType.CANCEL" />
            <el-option
              label="提现中"
              :value="WidthType.WITHDRAW_WAIT" />
            <el-option
              label="提现成功"
              :value="WidthType.WITHDRAW_COMPLETE" />
            <el-option
              label="提现失败"
              :value="WidthType.WITHDRAW_FAIL" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="searchForm.createTime"
            clearable
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间" />
        </el-form-item>
        <el-form-item class="flex gap-[10px]">
          <el-button type="primary" @click="doGetList">搜索</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
          <el-button @click="handleExport" :loading="exportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </ContentWrap>
  <!-- table -->
  <ContentWrap>
    <el-table :data="list">
      <el-table-column label="ID" prop="id" />
      <el-table-column label="会员信息" prop="distributorName" />
      <el-table-column label="提现金额">
        <template #default="{row}">
          ￥{{ row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="提现方式">
        <template #default="{row}">
          {{ ['余额','支付宝'][row.methodType] }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template #default="{row}">
          {{ ['待入账','已入账','已取消','提现中','提现成功','提现失败'][row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="提现时间" prop="createTime" :formatter="dateFormatter" />
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{row}">
          <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" link @click="handleAudit(row.id)" v-if="row.type===3">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="w-full flex justify-end mt-[10px]">
      <el-pagination
        v-model:current-page="searchForm.pageNo"
        v-model:page-size="searchForm.pageSize"
        @size-change="doGetList"
        @current-change="doGetList"
        :page-sizes="[10, 20, 50, 100]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </ContentWrap>

  <Detail ref="detailRef" />
  <Audit ref="auditRef" @confirm="doGetList" />
</template>

<style
  scoped
  lang="scss">

</style>
