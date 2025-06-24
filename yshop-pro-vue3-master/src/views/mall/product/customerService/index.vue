<template>

  <!-- 列表 -->
  <ContentWrap>
    <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['product:customerService:create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button>
    <el-table v-loading="loading" :data="list" row-key="id" default-expand-all>
      <el-table-column label="客服id" prop="openKfid" />
      <el-table-column label="客服名称" prop="name" width="120" />
      <el-table-column label="客服头像" align="center" prop="avatarUrl" width="120">
        <template #default="scope">
          <img v-if="scope.row.avatar" :src="scope.row.avatarUrl" alt="客服头像" class="h-100px" />
        </template>
      </el-table-column>
      <el-table-column label="客服链接" prop="accountLink" />
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        align="center"-->
<!--        prop="createTime"-->
<!--        width="180"-->
<!--        :formatter="dateFormatter"-->
<!--      />-->
      <el-table-column label="接待人" align="center" prop="receiver" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="assignedReceiver(scope.row.openKfid)"
          >
            配置
          </el-button>
<!--          <div>-->
<!--            <span class="text">{{scope.row.openKfid}}</span>-->
<!--            <el-button-->
<!--              link-->
<!--              type="primary"-->
<!--            >-->
<!--              修改-->
<!--            </el-button>-->
<!--          </div>--></template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row)"
            v-hasPermi="['product:customerService:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.openKfid)"
            v-hasPermi="['product:customerService:delete']"
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
  <CustomerServiceForm ref="formRef" @success="getList" />
  <ReceiverDialog ref="receiverDialogRef" />
</template>
<script setup lang="ts" name="ProductBrand">
// import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// import { dateFormatter } from '@/utils/formatTime'
import * as CustomerServiceApi from '@/api/mall/product/customerService'
import CustomerServiceForm from './CustomerServiceForm.vue'
import ReceiverDialog from "@/views/mall/product/customerService/ReceiverDialog.vue";
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  createTime: []
})
const currentId = ref(0)
const receiverDialogRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerServiceApi.getKfPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 配置接待人 */
const assignedReceiver = (id) => {
  receiverDialogRef.value.open(id)
  currentId.value = id
}
/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, data?: object) => {
  formRef.value.open(type, data)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CustomerServiceApi.deleteKf({openKfid: id})
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
