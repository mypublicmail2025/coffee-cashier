<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="80%">
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
      </el-form-item>
    </el-form>
      <div class="tableBox">
        <el-table
          ref="multipleTableRef"
          v-loading="loading"
          :data="list"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
          max-height="600"
        >
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column label="优惠券名称" align="center" prop="couponName" />
          <el-table-column label="类型" align="center">
            <template #default="scope">
              <span v-if="scope.row.couponType == 1">满减券</span>
              <span v-else-if="scope.row.couponType == 2">折扣券</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额" align="center">
            <template #default="scope">
              <span v-if="scope.row.couponType == 1">满减{{scope.row.couponValue}}元</span>
              <span v-else-if="scope.row.couponType == 2">打{{scope.row.discount}}折</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250" fixed="right">
            <template #default="scope">
              <el-button
                v-loading="scope.row.loading"
                link
                type="primary"
                @click="handleSend(scope.row)"
                v-hasPermi="['product:discount-coupon:update']"
              >
                发送
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
  </Dialog>
</template>
<script setup lang="ts">
import * as DiscountCouponApi from '@/api/mall/product/discountCoupon'
import { ref} from "vue";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('发送优惠券') // 弹窗的标题
const loading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref({
  couponId: 0,
  userIdList: []
})

const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (ids: any) => {
  dialogVisible.value = true
  resetForm()
  formData.value.userIdList = ids
  await getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const handleSend = async (row) => {
  // 提交请求
  row.loading = true
  formData.value.couponId = row.id
  try {
    await DiscountCouponApi.sendCoupon(formData.value)
    message.success(t('common.sendSuccess'))
  } finally {
    row.loading = false
  }
}
/** 查询列表 */

// 标签列表
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponName: null
})

const getList = async () => {
  loading.value = true
  try {
    const data = await DiscountCouponApi.getCanvasCouponPage(queryParams)
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
const queryFormRef = ref()
const resetQuery = () => {
  queryParams.value.couponName = ''
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 重置表单 */
const resetForm = () => {
  queryParams.pageNo = 1
  formData.value = {
    couponId: 0,
    userIdList: []
  }
  formRef.value?.resetFields()
}
</script>
<style lang="scss" scoped>
.tableBox {
  padding-bottom: 50px;
}
</style>
