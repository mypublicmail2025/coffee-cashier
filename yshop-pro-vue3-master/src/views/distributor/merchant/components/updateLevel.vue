<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="等级" prop="levelId">
        <el-select v-model="formData.levelId" placeholder="请选择等级" style="width: 100%">
          <el-option
            v-for="item in levelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as DistributorApi from "@/api/distributor/merchant";
import * as DistributorLevelApi from "@/api/distributor/level";
import {ref} from "vue";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const levelList = ref<LevelListItem[]>([]);
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('修改分销等级') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: 0,
  levelId: undefined,
})
const formRules = reactive({
  levelId: [{ required: true, message: '请选择等级', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = (data) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = data.id
  formData.value.levelId = data.levelId
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
  try {
    const data = formData.value as unknown as UserApi.UserVO
    await DistributorApi.updateDistributor(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: 0,
    levelId: undefined,
  }
  formRef.value?.resetFields()
}

// 获取分销等级
const getLevelList = async () => {
  levelList.value = await DistributorLevelApi.getLevelListAll()
}

/** 初始化 **/
onMounted(() => {
  getLevelList()
})
</script>
