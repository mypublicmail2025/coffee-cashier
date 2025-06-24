<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="优惠券名称" prop="name">
        <el-input
          v-model="queryParams.couponName"
          placeholder="请输入优惠券名称"
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
          v-hasPermi="['product:discount-coupon:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
<!--      <el-table-column label="优惠券ID" align="center" prop="id" />-->
      <el-table-column label="优惠券名称" align="center" prop="couponName" />
      <el-table-column label="类型" align="center">
        <template #default="scope">
          <span v-if="scope.row.couponType == 1">满减券</span>
          <span v-else-if="scope.row.couponType == 2">折扣券</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换码类型" align="center">
        <template #default="scope">
          <span v-if="scope.row.getType == 0">无码</span>
          <span v-else-if="scope.row.getType == 1">通用码</span>
          <span v-else-if="scope.row.getType == 2">一卡一码</span>
        </template>
      </el-table-column>
      <el-table-column label="发放总量" align="center">
        <template #default="scope">
          <span v-if="scope.row.getType == 2" @click="openRecordForm(scope.row.id)" class="link">{{scope.row.totalNumber}}</span>
          <span v-else>{{scope.row.totalNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已领取" align="center" prop="couponName" >
        <template #default="scope">
          <span>{{scope.row.totalNumber - scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用" align="center" prop="usedNum" />
      <el-table-column label="优惠金额" align="center">
        <template #default="scope">
          <span v-if="scope.row.couponType == 1">满减{{scope.row.couponValue}}元</span>
          <span v-else-if="scope.row.couponType == 2">打{{scope.row.discount}}折</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-if="scope.row.status === '已结束' || scope.row.status === '进行中'"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['product:discount-coupon:update']"
          >
            查看详情
          </el-button>
          <el-button
            link
            type="primary"
            v-else-if="scope.row.status === '未开始'"
            @click="openForm( 'update', scope.row.id)"
            v-hasPermi="['product:discount-coupon:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            @click="openRecordForm(scope.row.id, 'detail')"
            v-hasPermi="['product:discount-coupon:update']"
          >
            发放记录
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['product:discount-coupon:delete']"
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
  <DiscountCouponForm ref="formRef" @success="getList" />
  <RecordForm ref="recordFormRef" @success="getList" />
</template>

<script setup lang="ts" name="DiscountCoupon">
import { dateFormatter } from '@/utils/formatTime'
import * as DiscountCouponApi from '@/api/mall/product/discountCoupon'
import DiscountCouponForm from './DiscountCouponForm.vue'
import RecordForm from './RecordForm.vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponName: null
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DiscountCouponApi.getDiscountCouponPage(queryParams)
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
  queryParams.couponName = ''
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
    await DiscountCouponApi.deleteDiscountCoupon(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 发放记录 */
const recordFormRef = ref()
const openRecordForm = (id?: number, type?:string) => {
  recordFormRef.value.open(id,type)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style>
.link{
  color: #00a0e9;
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}
</style>
