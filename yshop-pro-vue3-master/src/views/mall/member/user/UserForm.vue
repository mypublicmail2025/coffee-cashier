<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="用户ID" prop="id">
        <el-input disabled v-model="formData.id" placeholder="请输入用户账户" />
      </el-form-item>
<!--      <el-form-item label="用户账户" prop="username">-->
<!--        <el-input v-model="formData.username" placeholder="请输入用户账户" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户昵称" prop="nickname">-->
<!--        <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />-->
<!--      </el-form-item>-->
      <el-form-item label="手机号码" prop="mobile">
        <el-input disabled v-model="formData.mobile" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="addres">
        <el-input v-model="formData.addres" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="用户备注" prop="mark">
        <el-input v-model="formData.mark" placeholder="请输入用户备注" />
      </el-form-item>
      <el-form-item label="等级" prop="level">
        <el-select v-model="formData.level" placeholder="请选择等级">
          <el-option
            v-for="item in userLevelList"
            :key="item.level"
            :label="item.levelName"
            :value="item.level"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="level">
        <el-select v-model="formData.tagIdList" multiple placeholder="请选择等级">
          <el-option
            v-for="item in userTagList"
            :key="item.id"
            :label="item.tagName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否为推广员" prop="isPromoter">
        <el-input v-model="formData.isPromoter" placeholder="请输入是否为推广员" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as UserApi from '@/api/member/user'
import * as UserLevelConfigApi from '@/api/member/userLevelConfig'
import * as UserTagApi from '@/api/member/userTag'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  username: undefined,
  password: undefined,
  realName: undefined,
  birthday: undefined,
  cardId: undefined,
  mark: undefined,
  partnerId: undefined,
  groupId: undefined,
  nickname: undefined,
  avatar: undefined,
  mobile: undefined,
  addIp: undefined,
  lastIp: undefined,
  nowMoney: undefined,
  brokeragePrice: undefined,
  integral: undefined,
  signNum: undefined,
  status: undefined,
  level: undefined,
  spreadUid: undefined,
  spreadTime: undefined,
  userType: undefined,
  isPromoter: undefined,
  payCount: undefined,
  spreadCount: undefined,
  addres: undefined,
  adminid: undefined,
  loginType: undefined,
  wxProfile: undefined
})
const formRules = reactive({
  username: [{ required: true, message: '用户账户不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  mobile: [{ required: true, message: '佣手机号码不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await UserApi.getUser(id)
      formData.value.tagIdList = formData.value.tagList.map(v=> v.tagId)
    } finally {
      formLoading.value = false
    }
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
  delete formData.value.mobile
  try {
    const data = formData.value as unknown as UserApi.UserVO
    if (formType.value === 'create') {
      await UserApi.createUser(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserApi.updateUser(data)
      message.success(t('common.updateSuccess'))
    }
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
    id: undefined,
    username: undefined,
    password: undefined,
    realName: undefined,
    birthday: undefined,
    cardId: undefined,
    mark: undefined,
    partnerId: undefined,
    groupId: undefined,
    nickname: undefined,
    avatar: undefined,
    mobile: undefined,
    addIp: undefined,
    lastIp: undefined,
    nowMoney: undefined,
    brokeragePrice: undefined,
    integral: undefined,
    signNum: undefined,
    status: undefined,
    level: undefined,
    spreadUid: undefined,
    spreadTime: undefined,
    userType: undefined,
    isPromoter: undefined,
    payCount: undefined,
    spreadCount: undefined,
    addres: undefined,
    adminid: undefined,
    loginType: undefined,
    wxProfile: undefined
  }
  formRef.value?.resetFields()
}

// 获取等级列表
const userLevelList = ref<UserLevelConfigApi.UserLevelConfigVO[]>([])
const getUserLevelConfigList = async () => {
  userLevelList.value = await UserLevelConfigApi.getUserLevelConfigList()
  userLevelList.value.unshift({
    id: 0,
    level: 0,
    levelName: '无等级',
    iconUrl: '',
    backgroundUrl: '',
    growthValue: 0,
    remarks: '',
    status: true
  })
}

// 获取标签
const userTagList = ref<UserTagApi.UserTagVO[]>([])
const getUserTagList = async () => {
  userTagList.value = await UserTagApi.getUserTagList()
}


onMounted(()=>{
  getUserLevelConfigList()
  getUserTagList()
})
</script>
