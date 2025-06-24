<template>
  <div class="product-select">
    <el-form :inline="true" :model="formData">
      <el-form-item label="">
        <el-input
          v-model="formData.keyword"
          maxlength="20"
          placeholder="请输入优惠券名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="couponTable"
      :data="tableData"
      max-height="500"
      border
      style="width: 100%"
      row-key="productId"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        width="40"
        type="selection"
        :reserve-selection="true"
        fixed="left"
      />
      <el-table-column prop="couponName" label="优惠券名称" width="180" />
      <el-table-column prop="couponType" label="类型">
        <template #default="scope">
          <span v-if="scope.row.couponType == 1">满减券</span>
          <span v-else>折扣券</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠金额" align="center">
        <template #default="scope">
          <span v-if="scope.row.couponType == 1">满减{{scope.row.couponValue}}元</span>
          <span v-else-if="scope.row.couponType == 2">打{{scope.row.discount}}折</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :hide-on-single-page="true"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { dateFormatter } from '@/utils/formatTime'
import api from '@/components/canvas/components/canvasShow/config/api'
import { ref, onMounted } from 'vue';
import { sendReqMixin } from '@/components/canvas/components/canvasShow/config/mixin';
const { sendReq } = sendReqMixin();
// const props = defineProps({
//   selectedCoupon: {
//     type: Array,
//     default: () => [],
//   }
// });
// const { selectedCoupon } = toRefs(props);
const couponTable = ref()
const formData = ref({
  keyword: '',
})
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const multipleSelection = ref([])
const tableData = ref([
  {
    id: 100,
    name: '测试',
  },
])

onMounted(() => {
  getTableData()
})

// 获取优惠券
function getTableData () {
  let _url = `${api.getCoupons}?pageNo=${currentPage.value}&pageSize=${pageSize.value}`
  if (formData.value.keyword) {
    _url += `&couponName=${formData.value.keyword}`
  }
  const params = {
    url: _url,
    method: 'GET',
  }
  sendReq(params, (res) => {
    tableData.value = res.data.list
    total.value = res.data.total
  })
}
// 搜索
function onSubmit () {
  getTableData()
}
// 每页条数改变
function handleSizeChange (val) {
  pageSize.value = val
  getTableData()
}
// 当前页改变
function handleCurrentChange (val) {
  currentPage.value = val
  getTableData()
}
// 多选改变
function handleSelectionChange (val) {
  multipleSelection.value = val
}

defineExpose({
  multipleSelection
})
</script>

<style lang="scss" scoped>
.product-select {
  .el-pagination {
    padding: 0px;
    margin-top: 30px;
  }
  .el-table {
    .img {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
