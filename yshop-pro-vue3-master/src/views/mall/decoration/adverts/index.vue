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
      <el-form-item label="页面名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入页面名称"
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
          v-hasPermi="['shop:popup:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="广告id" align="center" prop="id" />
      <el-table-column label="广告图片" align="center" >
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.popupImage"
            :zoom-rate="1.2"
            :preview-src-list="[scope.row.popupImage]"
            :initial-index="0"
            :z-index="900"
            :hide-on-click-modal="true"
            :preview-teleported="true"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="广告名称" align="center" prop="name" />
      <el-table-column label="跳转类型" align="center" >
        <template #default="scope">
          <span v-if="scope.row.type===0">不跳转</span>
          <span v-if="scope.row.type===1">商品</span>
          <span v-if="scope.row.type===2">分类</span>
          <span v-if="scope.row.type===3">优惠券</span>
          <span v-if="scope.row.type===4">小程序</span>
          <span v-if="scope.row.type===5">URL</span>
        </template>
      </el-table-column>
      <el-table-column
        label="启用时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
      />
      <el-table-column label="状态" align="center" >
        <template #default="scope">
          <span v-if="scope.row.state===1">开启</span>
          <span v-else>关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['shop:popup:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['shop:popup:delete']"
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
  <AdvertsForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts" name="Express">
import { dateFormatter } from '@/utils/formatTime'
import * as AdvertsApi from '@/api/mall/decoration/adverts'
import AdvertsForm from './advertsForm.vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AdvertsApi.getAdvertsPage(queryParams)
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
    await AdvertsApi.deleteAdverts(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
