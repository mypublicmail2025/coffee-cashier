<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="积分管理" name="integral">
        <ContentWrap>
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="68px"
          >
            <el-form-item label="会员信息" prop="nickname">
              <el-input
                v-model="queryParams.nickname"
                placeholder="请输入会员名称"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>
            <el-form-item label="添加时间" prop="createTime">
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
            </el-form-item>
          </el-form>
        </ContentWrap>
        <!-- 列表 -->
        <ContentWrap>
          <el-table v-loading="loading" :data="list">
            <el-table-column label="会员信息" align="center">
              <template #default="scope">
                <div class="flex" style="align-items: center">
                  <el-image style="width: 50px; height: 50px;margin-right: 10px" :src="scope.row.avatar" />
                  <span>{{scope.row.nickname}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="总积分" align="center" prop="balance" />
            <el-table-column label="收入 / 支出" align="center">
              <template #default="scope">
                <span>{{scope.row.pm ? '+' : '-'}}{{scope.row.number}}</span>
              </template>
            </el-table-column>
            <el-table-column label="收支说明" align="center" prop="title" />
            <el-table-column label="时间" align="center" prop="createTime" :formatter="dateFormatter" />
          </el-table>
          <!-- 分页 -->
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </ContentWrap>
      </el-tab-pane>
      <el-tab-pane label="积分规则" name="rule">
        <integral-rule-form />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script setup lang="ts" name="IntegralRule">
import { dateFormatter } from '@/utils/formatTime'
import { ref, reactive } from "vue";
import type { TabsPaneContext } from 'element-plus'
import * as UserBillApi from '@/api/member/userBill'
import IntegralRuleForm from "@/views/member/integralRule/IntegralRuleForm.vue";

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

interface QueryParams {
  pageNo: number
  pageSize: number
  nickname: string
  category: string
  createTime: any
}
const queryParams: QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickname: '',
  category: 'integral',
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserBillApi.getUserBillPage(queryParams)
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

// 切换tab
const activeName = ref('integral')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
