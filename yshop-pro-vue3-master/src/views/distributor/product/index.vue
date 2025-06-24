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
      <el-form-item label="商品名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isDistribution">
        <el-select v-model="queryParams.isDistribution" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="item in distributionStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" align="center" width="50" prop="id" />
      <el-table-column label="商品图片" align="center" prop="image" >
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.image"
            :zoom-rate="1.2"
            :preview-src-list="[scope.row.image]"
            :initial-index="0"
            :z-index="900"
            :hide-on-click-modal="true"
            :preview-teleported="true"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="storeName" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="分销规则" align="center">
        <template #default="scope">
          <span v-if="scope.row.isDistribution">{{scope.row.distributionRule ? '自定义' : '默认'}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="isShow" >
        <template #default="scope">
          <span>{{scope.row.isDistribution ? '参与中' : '未参与'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            设置佣金
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
  <!-- 表单弹窗：添加/修改 -->
  <StoreProductForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts" name="StoreProduct">
import * as StoreProductApi from '@/api/mall/product/product'
import StoreProductForm from './StoreProductForm.vue'
// const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  storeName: null,
  isPostage: null,
  isShow: 1,
  stock: 1,
  isDistribution: undefined
})
const distributionStatus = ref([
  {
    label: '未参与',
    value: 0
  },
  {
    label: '参与中',
    value: 1
  }]
)
const queryFormRef = ref() // 搜索的表单
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StoreProductApi.getStoreProductPage(queryParams)
    list.value = data.list
    total.value = data.total
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}
/** 初始化 **/
onMounted(() => {


  getList()
})


</script>
