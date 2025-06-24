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
          v-hasPermi="['shop:canvas:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="页面名称" align="center" prop="name" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
<!--      <el-table-column-->
<!--        label="状态"-->
<!--        align="center"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          <el-switch v-model="scope.row.state" :active-value="1" :inactive-value="0" @change="handleSetState(scope.row)" />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="是否首页"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.isIndex === 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['shop:canvas:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDecoration(scope.row.id)"
            v-hasPermi="['shop:canvas:decoration']"
          >
            装修
          </el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.isIndex ===0"
            @click="handleSetIndex(scope.row.id)"
            v-hasPermi="['shop:canvas:setIndex']"
          >
            设为首页
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['shop:canvas:delete']"
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
  <CanvasForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts" name="Express">
import { dateFormatter } from '@/utils/formatTime'
import * as CanvasApi from '@/api/mall/decoration/canvas'
import CanvasForm from './canvasForm.vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter()
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
    const data = await CanvasApi.getCanvasPage(queryParams)
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
    await CanvasApi.deleteCanvas(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 装修按钮操作 */
const handleDecoration = (id) =>{
  push('/decoration/canvasPage?id=' + id)
}

/** 设为首页按钮操作 */
const handleSetIndex = async (id: number) =>{
  try {
    // 二次确认
    await message.confirm( t('common.setIndexMessage'))
    // 发起请求
    await CanvasApi.setCanvasIndex(id)
    message.success(t('common.success'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 修改状态按钮操作 */
// const handleSetState = async (row) =>{
//   try {
//     // 发起请求
//     await CanvasApi.setCanvasState(row.id)
//     // 刷新列表
//     await getList()
//   } catch {}
// }



/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
