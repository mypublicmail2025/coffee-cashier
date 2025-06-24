<!--
    @name: TableTab
    @author: kahu4
    @date: 2024-02-02 17:19
    @description：TableTab
    @update: 2024-02-02 17:19
-->
<script
  setup
  name="TableTab"
  lang="ts">
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import { Ref, ref } from "vue";
import { getList } from "@/api/finance/recharge";
import { RechargeQuery, RechargeStatusEnum, RechargeVO } from "@/api/finance/recharge/index.model";
import { dateFormatter } from "@/utils/formatTime";


const loading = ref(false)
const searchForm: Ref<RechargeQuery> = ref({
  pageNo: 1, // 当前页数
  pageSize: 10, // 每页显示多少条
  createTime: [],
  status: undefined,
  id: undefined,
  nickname: ""
})
const total = ref(0)
const list: Ref<RechargeVO[]> = ref([])

async function doGetList() {
  try {
    loading.value = true
    const res = await getList(searchForm.value);
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}
const searchFormRef = ref() // 搜索的表单
function reset() {
  searchFormRef.value.resetFields()
  searchForm.value.createTime = []
  searchForm.value.status = undefined
  doGetList()
}

onMounted(() => {
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
        :model="searchForm">
        <el-form-item label="用户名" prop="nickname">
          <el-input
            placeholder="请输入用户名"
            v-model="searchForm.nickname" />
        </el-form-item>
        <el-form-item label="订单号" prop="id">
          <el-input
            placeholder="请输入订单号"
            v-model="searchForm.id" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="searchForm.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间" />
        </el-form-item>
        <el-form-item class="flex gap-[10px]">
          <el-button
            type="primary"
            @click="doGetList">搜索
          </el-button>
          <el-button
            type="danger"
            @click="reset">重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </ContentWrap>
  <!-- table -->
  <ContentWrap>
    <el-table :data="list">
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column
        label="昵称"
        prop="nickname" />
      <el-table-column
        label="订单号"
        prop="id" />
      <el-table-column label="充值金额">
        <template #default="{row}">
          ￥{{ row.rechargeAmount }}
        </template>
      </el-table-column>
      <el-table-column label="支付状态">
        <template #default="{row}">
          <el-tag
            type="danger"
            v-if="row.status === RechargeStatusEnum.PENDING"> 未支付
          </el-tag>
          <el-tag
            type="success"
            v-if="row.status === RechargeStatusEnum.SUCCESS"> 已支付
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="充值时间"
        prop="createTime"
        :formatter="dateFormatter" />
    </el-table>
    <div class="w-full flex justify-end mt-[10px]">
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="searchForm.pageNo"
        v-model:limit="searchForm.pageSize"
        @pagination="doGetList"
      />
    </div>
  </ContentWrap>
</template>

<style
  scoped
  lang="scss">

</style>
