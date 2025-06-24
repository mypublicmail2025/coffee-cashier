<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="标签分组">
        <el-select
          v-model="queryParams.groupId"
          clearable
          style="width: 260px"
          placeholder="请选择标签"
          @change="changeGroup"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <div class="tableBox">
        <el-table
          ref="multipleTableRef"
          :data="tagList"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="id"
          max-height="600"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55"
          />
          <el-table-column prop="tagName" label="标签名称"/>
          <el-table-column prop="groupName" label="标签分组"/>
        </el-table>
        <Pagination
          :total="tagTotal"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getTagList"
        />
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as UserTagApi from '@/api/member/userTag'
import * as UserTagGroupApi from '@/api/member/userTagGroup'
import {nextTick, ref} from "vue";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('添加标签') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const list = ref([]) // 列表的数据
const formData = ref({
  id: 0,
  tagIdList: []
})
const formRules = reactive({
})

const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (id: number, ids) => {
  dialogVisible.value = true
  resetForm()
  tagIds.value = ids
  formData.value.id = id
  await getList()
  await getTagList()
  // 修改时，设置数据
  if (id) {
    tagIds.value = ids
    nextTick(() => {
      tagList.value.forEach((tag) => {
        if (tagIds.value.includes(tag.id)) {
          multipleTableRef.value.toggleRowSelection(tag);
        }
      })
    })
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  formData.value.tagIdList = multipleSelection.value.map(tag => tag.id);
  try {
    await UserTagApi.updateMemberTags(formData.value)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const getList = async () => {
  try {
    const data = await UserTagGroupApi.getAllGroupPage()
    list.value = data
  } finally {
  }
}
// 标签列表
const tagIds = ref([])
const tagTotal = ref(0) // 列表的总页数
const tagList = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tagName: null,
  groupId: null,
  createTime: []
})
const getTagList = async () => {
  try {
    const data = await UserTagApi.getUserTagPage(queryParams)
    tagList.value = data.list
    tagTotal.value = data.total
  } finally {
  }
}

// 切换分组
const changeGroup = () => {
  queryParams.pageNo = 1
  getTagList()
}


// 选择商品
const multipleSelection = ref([]);
const multipleTableRef = ref();

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

/** 重置表单 */
const resetForm = () => {
  queryParams.groupId = null
  queryParams.pageNo = 1
  formData.value = {
    id: 0,
    tagIdList: []
  }
  formRef.value?.resetFields()
}
</script>
<style lang="scss" scoped>
.tableBox {
  padding-bottom: 50px;
}
</style>
