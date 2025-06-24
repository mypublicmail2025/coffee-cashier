<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="handleClose" width="1200">
    <ContentWrap v-if="!visitDetail">
      <el-button
        type="primary"
        plain
        @click="handleExport"
        v-hasPermi="['product:brand:create']"
        :loading="exportLoading"
      >
        导出优惠码
      </el-button>
      <el-button
        type="primary"
        plain
        @click="handleDelete('multiple')"
        v-hasPermi="['product:brand:create']"
      >
        批量删除
      </el-button>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table ref="multipleTableRef" v-loading="loading" :data="list" row-key="id" @selection-change="handleSelectionChange">
        <el-table-column
          v-if="!visitDetail"
          type="selection"
          :reserve-selection="true"
          width="55"
          :selectable="selectableStatus"
        />
        <el-table-column label="优惠券名称" prop="couponName" />
        <el-table-column label="优惠券码" prop="code" />
        <el-table-column label="领取用户" prop="username" />
        <el-table-column label="使用状态" prop="stateName" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column
          label="领取时间"
          align="center"
          prop="receiveTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column label="操作" align="center" v-if="!visitDetail">
          <template #default="scope">
            <el-button
              link
              type="danger"
              @click="handleDelete('single',scope.row.id)"
              v-hasPermi="['product:brand:delete']"
              v-if="scope.row.stateName !== '已删除'"
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
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts" name="ProductBrandForm">
import * as DiscountCouponApi from '@/api/mall/product/discountCoupon'
import {dateFormatter} from "@/utils/formatTime";
import download from '@/utils/download'
import {ref} from "vue";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const multipleTableRef = ref()
const dialogVisible = ref(false) // 弹窗的是否展示
const visitDetail = ref(false)
const multipleSelection = ref([])
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(true) // 列表的加载中
const exportLoading = ref(false) // 导出的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponId: 0
})

/** 打开弹窗 */
const open = async (id?: number, type?: string) => {
  dialogVisible.value = true
  visitDetail.value = type === 'detail'
  dialogTitle.value = type === 'detail'?'发放记录':'发送总量'
  // 修改时，设置数据
  if (id) {
    queryParams.couponId = id
    try {
      getList()
    } finally {
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['close']) // 定义 success 事件，用于操作成功后的回调
const handleClose = ()=>{
  emit('close')
  dialogVisible.value =false
}

const handleSelectionChange = (val: any[]): void => {
  multipleSelection.value = val;
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DiscountCouponApi.getCouponRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await DiscountCouponApi.exportCdkeyExcel(queryParams)
    download.excel(data, '发放记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 删除按钮操作 */
const handleDelete = async (type:string,id?: number) => {
  if(type==='multiple' && multipleSelection.value.length === 0){
    message.warning('请选择要批量删除的数据')
    return
  } else if(type==='multiple' && multipleSelection.value.length > 0){
    let ids = multipleSelection.value.map(v=>{
      return v.id
    })
    id = ids.join(',')
  }
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DiscountCouponApi.delCouponCdkey(id)
    message.success(t('common.delSuccess'))
    multipleTableRef.value?.clearSelection()
    multipleSelection.value = []
    // 刷新列表
    await getList()
  } catch {}
}

const selectableStatus = (row) =>{
  return row.stateName !== '已删除'
}
</script>
