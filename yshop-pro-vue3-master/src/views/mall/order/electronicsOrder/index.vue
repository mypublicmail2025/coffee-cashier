<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="75px"
      @submit.enter.prevent
    >
      <el-form-item label="面单名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入自定义名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="网点名称" prop="sendSite">
        <el-input
          v-model="queryParams.sendSite"
          placeholder="请输入网点名称"
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
          v-hasPermi="['express:electronics-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['express:electronics-order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="面单名称" align="center" prop="title" width="150" />
      <el-table-column label="快递公司" align="center" prop="shipperId" />
      <el-table-column label="运费支付方式" align="center" prop="paytype" width="150">
        <template #default="scope">
           <span v-if="scope.row.payType==1">现付</span>
           <span v-if="scope.row.payType==2">到付</span>
           <span v-if="scope.row.payType==3">月结</span>
           <span v-if="scope.row.payType==4">第三方付(仅SF支持)</span>
           <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="网点名称" align="center" prop="sendSite" />
      <el-table-column label="网点快递员" align="center" prop="sendStaff" width="150" />
      <el-table-column label="是否通知揽件" align="center" prop="isNotice" width="150">
        <template #default="scope">
           <span v-if="scope.row.payType==0">通知揽件</span>
           <span v-if="scope.row.payType==1">不通知揽件</span>
           <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="是否返回电子面单模板" align="center" prop="isReturnTemp" width="170">
        <template #default="scope">
           <span v-if="scope.row.payType==0">不返回</span>
           <span v-if="scope.row.payType==1">返回</span>
           <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="是否需要短信提醒" align="center" prop="isSendMessage" width="150">
        <template #default="scope">
           <span v-if="scope.row.payType==0">否</span>
           <span v-if="scope.row.payType==1">是</span>
           <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="上门揽件开始时间" align="center" prop="startDate" width="150" />
      <el-table-column label="上门揽件结束时间" align="center" prop="endDate" width="150" />
      <el-table-column label="是否要签回单" align="center" prop="isReturnSignBill" width="150">
        <template #default="scope">
           <span v-if="scope.row.payType==0">否</span>
           <span v-if="scope.row.payType==1">是</span>
           <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="发件人公司" align="center" prop="company" width="150" />
      <el-table-column label="发件人省" align="center" prop="provinceName" />
      <el-table-column label="发件人市" align="center" prop="cityName" />
      <el-table-column label="发件人区" align="center" prop="expAreaName" />
      <el-table-column label="发件人详细地址" align="center" prop="address"  width="150"/>
      <el-table-column label="发件人姓名" align="center" prop="name" width="150" />
      <el-table-column label="发件人电话" align="center" prop="tel" width="150" />
      <el-table-column label="发件人手机号码" align="center" prop="mobile" width="150" />
      <el-table-column label="发件地邮编" align="center" prop="postCode"  width="150" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="150"
      />
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['express:electronics-order:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['express:electronics-order:delete']"
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
  <ElectronicsOrderForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts" name="ElectronicsOrder">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ElectronicsOrderApi from '@/api/mall/order/electronicsOrder'
import ElectronicsOrderForm from './ElectronicsOrderForm.vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shipperId: null,
  paytype: null,
  customerName: null,
  customerPwd: null,
  sendSite: null,
  sendStaff: null,
  monthCode: null,
  isNotice: null,
  isReturnTemp: null,
  isSendMessage: null,
  templateSize: null,
  operateRequire: null,
  logisticCode: null,
  startDate: [],
  endDate: [],
  remark: null,
  expType: null,
  isReturnSignBill: null,
  company: null,
  provinceName: null,
  cityName: null,
  expAreaName: null,
  address: null,
  name: null,
  tel: null,
  mobile: null,
  postCode: null,
  title: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ElectronicsOrderApi.getElectronicsOrderPage(queryParams)
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
    await ElectronicsOrderApi.deleteElectronicsOrder(id)
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
    const data = await ElectronicsOrderApi.exportElectronicsOrder(queryParams)
    download.excel(data, '电子面单.xls')
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
