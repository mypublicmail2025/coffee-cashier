<template>
  <Dialog title="选择产品" v-model="dialogVisible">
    <div class="select-box">
      <!-- 搜索工作栏 -->
      <el-form
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
        @submit.enter.prevent
      >
        <el-form-item label="商品名称" prop="storeName">
          <el-input
            v-model="queryParams.storeName"
            placeholder="请输入商品名称"
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
          max-height="500"
          border
          row-key="id"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="" width="40" align="center">
            <template #default="scope">
              <el-radio v-model="tableRadio" :label="scope.row"><i /></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="产品主图" width="120" align="center">
            <template #default="scope">
              <el-image
                style="width: 80px; height: 80px"
                :src="scope.row.image"
                fit="contain"
              />
            </template>
          </el-table-column>
          <el-table-column prop="storeName" label="产品名称" width="180" />
          <el-table-column prop="price" label="售价" />
          <el-table-column prop="stock" label="库存" />
          <el-table-column prop="sales" label="销量" />
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
import * as ProductApi from '@/api/mall/product/product'
import {toRefs} from "vue";
const loading = ref(true) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const total = ref(0);
const list = ref([]);
const multipleSelection = ref([]);
const queryFormRef = ref() // 搜索的表单
const tableRef = ref()
const tableRadio = ref({})
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  isShow:1,
  stock:1,
  cateId:0,
  storeName: null
})
const props = defineProps({
  selectedId: {
    type: Number,
    default: 0,
  },
});
const { selectedId } = toRefs(props);

// 获取产品信息
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductApi.getStoreProductPage(queryParams)
    list.value = data.list
    total.value = data.total
    for(let i=0;i<data.list.length;i++){
      if(data.list[i].id === selectedId.value){
        tableRadio.value = data.list[i]
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

// 多选改变
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}

/** 打开弹窗 */
const open = async () => {
  getList();
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  dialogVisible.value = false
  console.log(tableRadio.value)
  emit('success', tableRadio.value)
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
