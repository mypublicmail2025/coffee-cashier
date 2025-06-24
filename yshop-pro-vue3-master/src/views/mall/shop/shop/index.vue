<script setup lang="ts" name="Shop">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ShopApi from '@/api/mall/shop/shop'
import ShopForm from './ShopForm.vue'
import {formatTime} from "@/utils";
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  storeName: null,
  storeIntro: null,
  storePhone: null,
  iconUrl: null,
  address: null,
  lon: null,
  lat: null,
  writeOffStartTime: [],
  writeOffEndTime: [],
  businessStartTime: [],
  businessEndTime: [],
  status: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShopApi.getShopPage(queryParams)
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
    await ShopApi.deleteShop(id)
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
    const data = await ShopApi.exportShop(queryParams)
    download.excel(data, '门店.xls')
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
      <el-form-item label="门店名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入门店名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
        <el-button type="primary" @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mall:shop:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="门店名称" align="center" prop="storeName" />
      <el-table-column label="门店电话" align="center" prop="storePhone" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="门店logo" align="center">
        <template #default="scope">
          <el-image :src="scope.row.iconUrl" style="width: 60px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="核销有效期" align="center" width="320">
        <template #default="scope">
          <span>{{formatTime(scope.row.writeOffStartTime, 'yyyy-MM-dd HH:mm:ss')}}-{{formatTime(scope.row.writeOffEndTime, 'yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="营业时间"-->
<!--        align="center"-->
<!--        prop="businessStartTime"-->
<!--        :formatter="dateFormatter"-->
<!--      />-->
      <el-table-column label="营业时间" align="center" width="320">
        <template #default="scope">
          <span>{{scope.row.businessStartTime}} - {{scope.row.businessEndTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status"
            type="success"
            size="mini"
          >开启</el-tag>
          <el-tag
            v-else
            type="danger"
            size="mini"
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
  <ShopForm ref="formRef" @success="getList" />

</template>
