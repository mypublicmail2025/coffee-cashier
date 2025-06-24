<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="25%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="标签名称" prop="tagName">
        <el-input v-model="formData.tagName" placeholder="请输入标签名称" />
      </el-form-item>
      <el-form-item label="标签分组" prop="groupId">
        <el-select
          v-model="formData.groupId"
          clearable
          style="width: 100%"
          placeholder="请选择标签分组"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="效果展示">
        <el-radio-group v-model="formData.styleType">
          <el-radio :label="1">自定义</el-radio>
          <el-radio :label="2">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片上传" prop="picUrl" v-if="formData.styleType === 2 ">
        <Materials v-model="formData.imageUrl" num="1" type="image" />
        <div class="tip">建议尺寸：80px*30px，若未上传则为空白</div>
      </el-form-item>
      <div v-else>
        <el-form-item label="字体颜色" prop="fontColor">
          <el-color-picker
            v-model="formData.fontColor"
          />
          <div class="tip">若未设置颜色，则为默认色</div>
        </el-form-item>
        <el-form-item label="背景颜色" prop="bgColor">
          <el-color-picker
            v-model="formData.bgColor"
          />
          <div class="tip">若未设置颜色，则为默认色</div>
        </el-form-item>
        <el-form-item label="边框颜色" prop="borderColor">
          <el-color-picker
            v-model="formData.borderColor"
          />
          <div class="tip">若未设置颜色，则无边框</div>
        </el-form-item>
      </div>
      <el-form-item label="排序" prop="sort">
        <el-input-number :min="0" placeholder="请输入排序" v-model="formData.sort" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as TagApi from '@/api/mall/product/tag/index'
import * as TagGroupApi from "@/api/mall/product/tag/group";
import { ref, reactive } from 'vue'

interface GroupData {
  id: number
  groupName: string
}

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const list = ref<GroupData[]>([]) // 列表的数据
const formData = ref({
  id: undefined,
  tagName: '',
  groupId: undefined,
  styleType: 1,
  imageUrl: undefined,
  fontColor: '',
  bgColor: '',
  borderColor: '',
  sort: 1
})
const formRules = reactive({
  tagName: [{ required: true, message: '标签名不能为空', trigger: 'blur' }],
  groupId: [{ required: true, message: '标签分组不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (type: string, row?: TagApi.TagVO) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await getList()
  // 修改时，设置数据
  if (row) {
    formData.value = JSON.parse(JSON.stringify(row))
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
  try {
    const data = formData.value as unknown as TagApi.TagVO
    if (formType.value === 'create') {
      await TagApi.createTag(data)
      message.success(t('common.createSuccess'))
    } else {
      await TagApi.updateTag(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const getList = async () => {
  try {
    const data = await TagGroupApi.getTagGroupList()
    list.value = data
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    tagName: '',
    groupId: undefined,
    styleType: 1,
    imageUrl: undefined,
    fontColor: '',
    bgColor: '',
    borderColor: '',
    sort: 1
  }
  formRef.value?.resetFields()
}
</script>
<style lang="scss" scoped>
:deep(.el-color-picker){
  width: 50px;
  .el-color-picker__trigger{
    width: 100%;
  }
}
.tip{
   font-size: 12px;
   color: #8d8d8d;
   width: 100%;
 }
.el-input-number{
  width: 100%;
}
</style>
