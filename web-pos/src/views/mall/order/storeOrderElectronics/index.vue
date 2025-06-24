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
      <el-form-item label="订单编号" prop="orderSn">
        <el-input
          v-model="queryParams.orderSn"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物流单号" prop="logisticCode">
        <el-input
          v-model="queryParams.logisticCode"
          placeholder="请输入物流单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['order:store-order-electronics:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['order:store-order-electronics:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订单编号" align="center" prop="orderSn" />
      <el-table-column label="物流单号" align="center" prop="logisticCode" />
      <el-table-column label="快递编号" align="center" prop="shipperCode" />
      <el-table-column label="线下网点客户号" align="center" prop="customerName" />
      <el-table-column label="线下网点密码" align="center" prop="customerPwd" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
           <span v-if="scope.row.status==0">正常</span>
           <span v-if="scope.row.status==1">已取消</span>
           <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['order:store-order-electronics:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['order:store-order-electronics:delete']"
          >
            删除
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
  <StoreOrderElectronicsForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts" name="StoreOrderElectronics">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as StoreOrderElectronicsApi from '@/api/mall/order/storeOrderElectronics'
import StoreOrderElectronicsForm from './StoreOrderElectronicsForm.vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderSn: null,
  printTemplate: null,
  kdnOrderCode: null,
  logisticCode: null,
  shipperCode: null,
  order: null,
  customerName: null,
  customerPwd: null,
  status: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StoreOrderElectronicsApi.getStoreOrderElectronicsPage(queryParams)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StoreOrderElectronicsApi.deleteStoreOrderElectronics(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await StoreOrderElectronicsApi.exportStoreOrderElectronics(queryParams)
    download.excel(data, '订单电子面单记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
