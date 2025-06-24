<template>
  <ContentWrap>
     <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="全部" name=""/>
      <el-tab-pane label="微信小程序" name="wxapp"/>
      <el-tab-pane label="支付宝小程序" name="aliapp"/>
      <el-tab-pane label="微信公众号" name="wechat"/>
      <el-tab-pane label="H5" name="h5"/>
      <el-tab-pane label="PC" name="pc"/>
      <el-tab-pane label="APP" name="app"/>
    </el-tabs>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      @submit.enter.prevent
    >
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tagName">
        <el-input
          v-model="queryParams.tagName"
          placeholder="请输入标签名称"
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
<!--        <el-button type="primary" @click="openForm('create')" v-hasPermi="['member:user:create']">-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['member:user:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
                <el-button type="primary" @click="sendCoupon" v-hasPermi="['member:user:create']">
                  发送优惠券
                </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      ref="tableRef"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="会员信息" align="center">
        <template #default="scope">
          <div class="flex" style="align-items: center">
            <el-image style="width: 50px; height: 50px;margin-right: 10px" :src="scope.row.avatar" />
            <span>{{scope.row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" prop="mobile" />
      <el-table-column label="会员标签" align="center">
        <template #default="scope">
          <el-tag style="margin-right: 5px" v-for="tag in scope.row.tagList" :key="tag.id" type="success" size="small">{{ tag.tagName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="会员余额" align="center">
        <template #default="scope">
          <span>{{ scope.row.nowMoney ? `￥${scope.row.nowMoney}` : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆类型" align="center" prop="loginType">
        <template #default="scope">
          <span>{{ scope.row.loginType == 'wxapp' ? '小程序' : 'h5' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="上次登录时间"
        align="center"
        prop="loginDate"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div class="flex justify-center items-center">
            <el-button
              link
              type="primary"
              @click="openForm('userDetail', scope.row.id)"
              v-hasPermi="['member:user:update']"
            >
              详情
            </el-button>
              <el-button
                link
                type="primary"
                @click="openTagForm(scope.row)"
                v-hasPermi="['member:user:update']"
              >
                加标签
              </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['member:user:update']"
            >
              编辑
            </el-button>
<!--            <el-dropdown>-->
<!--              <el-button type="primary" link>更多</el-button>-->
<!--              <template #dropdown>-->
<!--                <el-dropdown-menu>-->
<!--&lt;!&ndash;                  <el-dropdown-item @click="openForm('update', scope.row.id)">编辑</el-dropdown-item>&ndash;&gt;-->
<!--                  <el-dropdown-item @click="openForm('yue', scope.row.id)">积分余额</el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
<!--              </template>-->
<!--            </el-dropdown>-->
          </div>
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
  <UserForm ref="formRef" @success="getList" />
  <UserDetail ref="formRef1" />
  <Yue ref="formRef2" @success="getList" />
  <UserTagForm ref="formTagRef" @success="getList" />
  <SendCouponForm ref="sendCouponFormRef" />
</template>

<script setup lang="ts" name="User">
import { dateFormatter } from '@/utils/formatTime'
import { ref, reactive } from 'vue'

import download from '@/utils/download'
import * as UserApi from '@/api/member/user'
import UserForm from './UserForm.vue'
import type { TabsPaneContext } from 'element-plus'
import UserDetail from './UserDetail/index.vue'
import Yue from './yue.vue'
import UserTagForm from "@/views/mall/member/user/UserTagForm.vue";
import SendCouponForm from "@/views/mall/member/user/sendCouponForm.vue";
const message = useMessage() // 消息弹窗
// const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: null,
  realName: null,
  tagName: null,
  nickname: null,
  mobile: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const activeName = ref('')

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPage(queryParams)
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

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  queryParams.pageNo = 1
  queryParams.loginType = tab.paneName
  getList()
}

/** 添加/修改操作 */
const formRef = ref()
const formRef1 = ref()
const formRef2 = ref()
const openForm = (type: string, id?: number) => {
  if (type == 'update' || type == 'create') {
    formRef.value.open(type, id)
  } else if (type == 'userDetail') {
    formRef1.value.open(type, id)
  } else if (type == 'yue') {
    formRef2.value.open(type, id)
  }

}



/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await UserApi.exportUser()
    download.excel(data, '用户.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 打开标签添加
const formTagRef = ref()
const openTagForm = (item) => {
  let ids = item.tagList.map(tag => tag.tagId);
  formTagRef.value.open(item.id, ids)
}

/** 当表格选择项发生变化时会触发该事件  */
const selectedIds = ref<number[]>([]) // 表格的选中 ID 数组
const handleSelectionChange = (array: NotifyMessageApi.NotifyMessageVO[]) => {
  selectedIds.value = []
  if (!array) {
    return
  }
  array.forEach((row) => selectedIds.value.push(row.id))
}

// 发送优惠券
const sendCouponFormRef = ref()
const sendCoupon = async () => {
  if(selectedIds.value.length === 0){
    message.warning('请选择用户')
    return
  }
  sendCouponFormRef.value.open(selectedIds.value)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
