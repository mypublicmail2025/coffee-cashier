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
      <el-form-item label="标签名称" prop="tagName">
        <el-input
          v-model="queryParams.tagName"
          placeholder="请输入标签名称"
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
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增标签
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openGroupForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增分组
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <el-row :gutter="20">
  <!-- 列表 -->
    <el-col :span="4" :xs="24">
      <tag-group :groupList="groupList" @changeGroup="changeGroup" @success="refreshGrouping" />
    </el-col>
    <el-col :span="20" :xs="24">
      <ContentWrap>
        <el-table v-loading="loading" :data="list">
          <el-table-column label="标签名称" align="center" prop="tagName" />
<!--          <el-table-column label="会员数" align="center" prop="userCount" />-->
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row)"
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
    </el-col>
  </el-row>

  <!-- 表单弹窗：添加/修改 -->
  <TagForm ref="formRef" @success="getList" />
  <TagGroupForm ref="formGroupRef" @success="getGroupList" />
</template>

<script setup lang="ts">
import * as TagApi from '@/api/mall/product/tag/index'
import TagForm from './TagForm.vue'
import TagGroup from "./components/TagGroup.vue";
import { ref, reactive }  from 'vue'
import * as TagGroupApi from "@/api/mall/product/tag/group";
import TagGroupForm from "./components/TagGroupForm.vue";
import {GroupItem} from "@/types/member";
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const groupList = ref<GroupItem[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tagName: null,
  groupId: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    let data = await TagApi.getTagPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
// 获取分组列表
const getGroupList = async () => {
  try {
    let data = await TagGroupApi.getTagGroupList()
    groupList.value = data
  } finally {
  }
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
  getGroupList()
}
// 删除之后刷新分组
const refreshGrouping = () => {
  queryParams.groupId = null
  getGroupList()
  getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, row?: TagApi.TagVO) => {
  formRef.value.open(type, row)
}

/** 添加/修改操作 */
const formGroupRef = ref()
const openGroupForm = (type: string, id?: number) => {
  formGroupRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TagApi.deleteTag(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
// 切换分组
const changeGroup = (id) => {
  queryParams.groupId = id
  getList()
}
/** 初始化 **/
onMounted(() => {
  getList()
  getGroupList()
})
</script>
