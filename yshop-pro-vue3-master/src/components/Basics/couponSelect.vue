<template>
  <Dialog title="选择优惠券" v-model="dialogVisible" width="800px">
    <div class="select-box">
      <!-- 搜索工作栏 -->
      <el-form
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
        @submit.enter.prevent
      >
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input
            v-model="queryParams.couponName"
            placeholder="请输入优惠券名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table-warp">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="list"
          max-height="550"
          border
          style="width: 100%"
          row-key="id"
          @select="handleSelectionSelect"
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
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { uniqBy, findIndex } from 'lodash-es'
import * as CouponApi from '@/api/mall/product/discountCoupon/index'
import { dateFormatter } from '@/utils/formatTime'
const loading = ref(true) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const tableRef = ref()
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponName: null
})
const total = ref(0)
const list = ref([]);
const multipleSelection = ref<CouponApi.DiscountCouponVO[]>([])
const props = defineProps({
  selectedItems: {
    type: Array,
    default: ()=>[],
  },
});
const { selectedItems } = toRefs(props);

// watchEffect(() => {
//   if(!dialogVisible.value){
//     multipleSelection.value = []
//   }
// })
// 获取优惠券列表
const getList = async () => {
  loading.value = true
  try {
    const data = await CouponApi.getCanvasCouponPage(queryParams)
    list.value = data.list
    total.value = data.total
    for(let i=0;i<data.list.length;i++){
      if(findIndex(multipleSelection.value,['id', data.list[i].id]) >=0){
        tableRef.value!.toggleRowSelection(data.list[i],true)
      }
    }
  } finally {
    loading.value = false
  }
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 多选选择
const handleSelectionSelect = (selection, row)=>{
  // 取消选中而且selectedItems包含row
  const selectedIndex = findIndex(selectedItems.value, row)
  if(findIndex(selection, row) < 0 && selectedIndex >=0){
    selectedItems.value = selectedItems.value.splice(selectedIndex,1)
  }
}

// 多选改变
const handleSelectionChange = (val) => {
  multipleSelection.value = uniqBy(val.concat(selectedItems.value),'id')
}

/** 打开弹窗 */
const open = async () => {
  multipleSelection.value = selectedItems.value
  getList()
  dialogVisible.value = true

}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  dialogVisible.value = false
  emit('success',multipleSelection.value)
}


</script>

<style lang="scss" scoped>
.select-box{
  .table-warp{
    margin-top: 10px;
    &::after{
      content: "";
      display: table;
      clear: both;
    }
    :deep(.el-radio){
      .el-radio__label{
        display: none;
      }
    }
  }
}
</style>
