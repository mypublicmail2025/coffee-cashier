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
      <el-form-item label="活动名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入活动名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ACTIVITY_STATUS)"
            :key="String(dict.value)"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" prop="createTime">
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
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>

  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="活动名称" align="center" prop="name" width="190" :show-overflow-tooltip="true" />
      <el-table-column label="活动时间" align="center" width="320">
        <template #default="scope">
          <span>{{formatTime(scope.row.startTime, 'yyyy-MM-dd HH:mm:ss')}}-{{formatTime(scope.row.endTime, 'yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼团订单" align="center" prop="orderQuantity"  />
      <el-table-column label="拼团销售额" align="center" prop="salesAmount"  />
      <el-table-column label="拼团销量" align="center" prop="salesQuantity"  />
      <el-table-column align="center" label="活动状态" prop="state">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ACTIVITY_STATUS" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-if="[1,2,3].includes(scope.row.state)"
            @click="openForm('detail', scope.row.id)"
          >
            详情
          </el-button>
          <el-button
            link
            v-if="[0].includes(scope.row.state)"
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            link
            v-if="[0].includes(scope.row.state)"
            type="primary"
            @click="confirmActivity(scope.row.id)"
          >
            开始活动
          </el-button>
          <el-button
            link
            type="primary"
            v-if="[1,3].includes(scope.row.state)"
            @click="endActivity(scope.row.id)"
          >
            结束活动
          </el-button>
          <el-button
            link
            type="danger"
            v-if="[0, 2].includes(scope.row.state)"
            @click="deleteActivity(scope.row.id)"
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
  <GroupBuyForm  ref="formRef" @success="getList"/>
</template>

<script setup lang="ts" name="StoreOrder">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as StoreActivityApi from '@/api/marketing'
import GroupBuyForm from "@/views/marketing/groupBuy/groupBuyForm.vue";
import {ref, reactive} from "vue";
import { ActivityList, QueryParams } from "@/types/activity";
import {dateFormatter} from "@/utils/formatTime";
import {formatTime} from "@/utils";
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref<boolean>(true);
const total = ref<number>(0);
const list = ref<ActivityList[]>([]);
const queryParams: QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: "",
  type: 1,
  createTime: [],
  state: undefined
})

/** 查询列表 */
const getList: ()=> Promise<void> = async () => {
  loading.value = true
  try {
    const data = await StoreActivityApi.getActivityPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const queryFormRef = ref() // 搜索的表单
/** 搜索按钮操作 */
const handleQuery: () => void = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery: () => void = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
/** 编辑 **/
const formRef = ref()
const openForm: (type: string, id?: number) => void = (type, id) => {
  formRef.value?.open(type, id, id ? true : false)
}

// 删除活动
const deleteActivity = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StoreActivityApi.deleteStoreActivity(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

// 确认活动
const confirmActivity = async (id: number) => {
  try {
    // 结束的二次确认
    await message.confirm('是否确认开始此活动')
    // 发起结束
    await StoreActivityApi.confirmationActivity(id)
    message.success(t('common.success'))
    // 刷新列表
    await getList()
  } catch {}
}

// 结束活动
const endActivity = async (id: number) => {
  try {
    // 结束的二次确认
    await message.confirm('是否确认结束此活动')
    // 发起结束
    await StoreActivityApi.endingActivity(id)
    message.success(t('common.success'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
</style>
