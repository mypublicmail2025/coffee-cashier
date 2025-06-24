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
        <el-form-item label="服务名称" prop="name">
          <el-input
              v-model="queryParams.name"
              placeholder="请输入服务名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
          />
        </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
          <el-button
              type="primary"
              plain
              @click="openForm('create')"
          >
        <Icon icon="ep:plus" class="mr-5px"/>
        新增
      </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="服务名称" align="center" prop="name"/>
      <el-table-column label="服务内容" align="center" prop="content"/>
      <el-table-column label="使用商品" align="center" prop="id" />
      <el-table-column label="排序" align="center" prop="sorted" />
<!--      <el-table-column label="状态" align="center" prop="status"/>-->
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeSwitch(scope.row)" />
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
  <StoreProductAssureForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts" name="StoreProductAssure">
  import {dateFormatter} from '@/utils/formatTime'
  import * as StoreProductAssureApi from '../../../api/storeProductAssure'
  import StoreProductAssureForm from './StoreProductAssureForm.vue'

  interface ListItem {
    name: string;
    content: string;
    sorted: number;
    status: number;
    id: number;
    createTime: string;
  }

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化

  const loading = ref(true) // 列表的加载中
  const total = ref(0) // 列表的总页数
  const list = ref<ListItem[]>([]); // 列表的数据
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    name: null,
    content: null,
    sorted: null,
    status: null,
    createTime: []
  })
  const queryFormRef = ref() // 搜索的表单


  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await StoreProductAssureApi.getStoreProductAssurePage(queryParams)
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
      await StoreProductAssureApi.deleteStoreProductAssure(id)
      message.success(t('common.delSuccess'))
      // 刷新列表
      await getList()
    } catch {
    }
  }
  // 切换开关
  const changeSwitch = async(status) => {
    console.log(status)
    await StoreProductAssureApi.updateStoreProductAssure(status)
    message.success('操作成功')
  }

  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
