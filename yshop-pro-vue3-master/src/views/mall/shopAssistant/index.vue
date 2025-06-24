<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="店员名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入店员名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="开启" :value="true" />
          <el-option label="关闭" :value="false" />
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 添加人员
        </el-button>
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="userId" />
      <el-table-column label="昵称" align="center" prop="nickname" />
      <el-table-column label="店员姓名" align="center" prop="name" />
      <el-table-column label="所属门店" align="center" prop="storeName" />
      <el-table-column label="联系电话" align="center" prop="phoneNo" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status"
            type="success"
            size="small"
          >开启</el-tag>
          <el-tag
            v-else
            type="danger"
            size="small"
          >关闭</el-tag>
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
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
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
  <ShopAssistantForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts" name="ShopAssistant">
import { dateFormatter } from '@/utils/formatTime'
import { ref, reactive } from 'vue'
import * as ShopAssistantApi from '@/api/mall/shopAssistant'
import ShopAssistantForm from './ShopAssistantForm.vue'

interface QueryParams {
  pageNo: number;
  pageSize: number;
  storeId: string | undefined;
  userId: string | undefined;
  name: string | undefined;
  phoneNo: string | undefined;
  status: string | undefined;
  createTime: any;
}

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams:QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  storeId: undefined,
  userId: undefined,
  name: undefined,
  phoneNo: undefined,
  status: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
// const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShopAssistantApi.getShopAssistantPage(queryParams)
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
    await ShopAssistantApi.deleteShopAssistant(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
// const handleExport = async () => {
//   try {
//     // 导出的二次确认
//     await message.exportConfirm()
//     // 发起导出
//     exportLoading.value = true
//     const data = await ShopAssistantApi.exportShopAssistant(queryParams)
//     download.excel(data, '门店店员.xls')
//   } catch {
//   } finally {
//     exportLoading.value = false
//   }
// }

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
