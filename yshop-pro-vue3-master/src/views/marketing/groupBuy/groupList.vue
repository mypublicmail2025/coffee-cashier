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
      <el-form-item label="活动名称" prop="campaignName">
        <el-input
          v-model="queryParams.campaignName"
          placeholder="请输入用户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.GROUP_STATUS)"
            :key="String(dict.value)"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
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
      <el-table-column label="活动名称" align="center" prop="name" width="190" />
      <el-table-column label="拼团商品" width="330">
        <template #default="scope">
          <div class="flex">
            <img height="80" width="80" :src="scope.row.image" alt="" />
            <p>{{ scope.row.productName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="团长" align="center" prop="regimentalCommander"  />
      <el-table-column label="成团人数" align="center" prop="person"  />
      <el-table-column label="参团人数" align="center" prop="joinNumber"  />
      <el-table-column label="拼团状态" align="center">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.GROUP_STATUS" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column
        label="开团时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="190"
      />
      <el-table-column label="操作" align="center" fixed="right" width="60">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="showGroupDetail(scope.row.id)"
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
  <!--    选择商品列表-->
  <el-dialog
    v-model="groupVisible"
    title="查看详情"
    width="60%"
    top="50px"
    class="group-dialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
  >
    <div class="tableBox">
      <el-table
        ref="multipleTableRef"
        :data="groupDetail"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        style="width: 100%"
        max-height="600"
      >
        <el-table-column prop="nickname" label="用户名称" />
        <el-table-column label="用户头像">
          <template #default="scope">
            <img height="80" width="80" :src="scope.row.avatar" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单编号" />
        <el-table-column prop="price" label="金额" />
      </el-table>
      <div class="fenye">
        <!-- 分页 -->
        <Pagination
          :total="userTotal"
          v-model:page="queryParamsDetail.pageNo"
          v-model:limit="queryParamsDetail.pageSize"
          @pagination="getGroupInfoList"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="StoreOrder">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as StoreActivityApi from "@/api/marketing";
import { ref, reactive } from "vue";
import {GroupData, GroupUserData} from "@/types/activity";
interface QueryParams {
  pageNo: number
  pageSize: number
  state?: number | null;
  campaignName?: string;
  createTime: any
  status: string
}

interface QueryParamsDetail {
  pageNo: number
  pageSize: number
  id: number | null
}

const loading = ref<boolean>(true);
const total = ref<number>(0);
const list = ref<GroupData[]>([]);
const userTotal = ref<number>(10)
const queryParams: QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  state: null,
  campaignName: "",
  createTime: [],
  status: ""

})
const queryParamsDetail: QueryParamsDetail = reactive({
  pageNo: 1,
  pageSize: 10,
  id: null
})
const queryFormRef = ref() // 搜索的表单
const groupVisible = ref(false) // 拼团信息显示
/** 查询列表 */
const getList: ()=> Promise<void> = async () => {
  loading.value = true
  try {
    const data = await StoreActivityApi.getGroupPage(queryParams)
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
const showGroupDetail = async (id:number) => {
  queryParamsDetail.id = id
  await getGroupInfoList()
  groupVisible.value = true
}

// 获取拼团详情数据
const groupDetail = ref<GroupUserData[]>([])
const getGroupInfoList = async () => {
  let data = await StoreActivityApi.getGroupInfoList(queryParamsDetail)
  groupDetail.value = data.list
  userTotal.value = data.total
  groupVisible.value = true
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
