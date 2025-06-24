<script setup lang="ts">
import * as CustomerServiceApi from '@/api/mall/product/customerService'
import ReceiverTree from "@/views/mall/product/customerService/ReceiverTree.vue";
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

interface SelectedItem {
  userId: number | string;
  [key: string]: any; // 可以包含其他属性
}

interface ReceiverItem {
  userId: number | string;
  [key: string]: any; // 可以包含其他属性
}

const receiverVisible = ref(false)
const formLoading = ref(false)
const currentId = ref(0)
const userIdList = ref<string[]>([]);
const multipleTableRef = ref()
const multipleSelection = ref<SelectedItem[]>([])
const loading = ref(true) // 列表的加载中
const list = ref<SelectedItem[]>([]);
const receiverList = ref<ReceiverItem[]>([]);
const queryParams = reactive({
  departId: null
})
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
/** 打开弹窗 **/
const open = (id) => {
  getReceiverList(id)
  currentId.value = id
}
const getDefaultDepartment = (departentId) => {
  queryParams.departId = departentId
  loading.value = true
  getList()
}
/** 查询接待人列表 */
const getReceiverList = async (id) => {
  receiverVisible.value = true
  try {
    const data = await CustomerServiceApi.getReceiverPage(id)
    receiverList.value = data
    getList()
  } finally {
  }
}
/** 提交选择接待人 **/
const submitReceiver = async () => {
  formLoading.value = true
  userIdList.value = multipleSelection.value.map(item => String(item.userId))
  try {
    // 提交选择
    await CustomerServiceApi.assignedReceiver({openKfid: currentId.value, userIdList: userIdList.value})
    message.success(t('common.updateSuccess'))
    receiverVisible.value = false
  } catch {
  } finally {
    formLoading.value = false
  }
}

/** 处理部门被点击 */
const handleDeptNodeClick = async (row) => {
  queryParams.departId = row.id
  await getList()
}

/** 查询列表 */
const getList = async () => {
  try {
    const data = await CustomerServiceApi.getlistUser(queryParams)
    list.value = data
    nextTick(() => {
      const selectedUserIds = new Set(receiverList.value.map(item => String(item.userId)))
      list.value.forEach((item) => {
        if (selectedUserIds.has(String(item.userId))) {
          multipleTableRef.value?.toggleRowSelection(item, true)
        }
      })
    })
  } finally {
    loading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<template>
  <Dialog title="接待人配置" v-model="receiverVisible" width="50%">
    <el-row :gutter="20">
      <!-- 左侧部门树 -->
      <el-col :span="6" :xs="24">
        <ContentWrap class="h-1/1">
          <ReceiverTree @node-click="handleDeptNodeClick" @get-default-department="getDefaultDepartment" />
        </ContentWrap>
      </el-col>
      <el-col :span="18" :xs="24">
        <!-- 搜索 -->
        <ContentWrap>
          <el-table style="height: 500px; overflow: auto;" ref="multipleTableRef" v-loading="loading" :data="list" @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="接待人编号" align="center" key="userId" prop="userId" />
            <el-table-column
              label="接待人姓名"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="职位" align="center" prop="position" />
          </el-table>
        </ContentWrap>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="submitReceiver" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="receiverVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">

</style>
