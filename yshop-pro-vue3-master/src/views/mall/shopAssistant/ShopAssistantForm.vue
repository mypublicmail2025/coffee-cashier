<script setup lang="ts">
import * as ShopAssistantApi from '@/api/mall/shopAssistant'
import * as UserApi from '@/api/system/user'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  storeId: undefined,
  userId: undefined,
  name: undefined,
  phoneNo: undefined,
  status: true
})
const formRules = reactive({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '关联用户不能为空', trigger: 'blur' }],
  storeId: [{ required: true, message: '关联自提门店不能为空', trigger: 'blur' }],
  phoneNo: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const userList = ref([]) // 用户列表

// 获取用户列表
const getUserId = async (query: string) => {
  if (query) {
    userList.value = (await UserApi.getUserPage({username: query, pageSize: 100, pageNo: 1})).list
    // setTimeout(() => {
    //   userList.value = userList.value.filter((item) => {
    //     return item.nickname.toLowerCase().includes(query.toLowerCase())
    //   })
    // }, 200)
  } else {
    userList.value = []
  }
}

// 获取门店列表
const shopList = ref([]) // 门店列表
const getStoreList = async (query: string) => {
  console.log(query, 'query')
  if (query) {
    shopList.value = await ShopAssistantApi.getShopList({storeName: query})
    setTimeout(() => {
      shopList.value = shopList.value.filter((item) => {
        return item.storeName.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    shopList.value = []
  }
}

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
      formData.value = await ShopAssistantApi.getShopAssistant(id)
      getUserId(formData.value.nickname)
      getStoreList(formData.value.storeName)
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
  try {
    const data = formData.value as unknown as ShopAssistantApi.ShopAssistantVO
    if (formType.value === 'create') {
      await ShopAssistantApi.createShopAssistant(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShopAssistantApi.updateShopAssistant(data)
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
    storeId: undefined,
    userId: undefined,
    name: undefined,
    phoneNo: undefined,
    status: true
  }
  formRef.value?.resetFields()
}
</script>
<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" style="width: 300px" />
      </el-form-item>
      <el-form-item label="关联用户" prop="userId">
        <el-select
          v-model="formData.userId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入用户名称"
          remote-show-suffix
          :remote-method="getUserId"
          :loading="loading"
          style="width: 300px"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <p style="font-size: 12px;color: #999999;margin:10px 0 15px 130px">选择商城用户(请搜索触发)，核销员可在商城个人中心进行订单核销</p>
      <el-form-item label="关联自提门店" prop="storeId">
        <el-select
          v-model="formData.storeId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入门店名称"
          remote-show-suffix
          :remote-method="getStoreList"
          :loading="loading"
          style="width: 300px"
        >
          <el-option
            v-for="item in shopList"
            :key="item.id"
            :label="item.storeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <p style="font-size: 12px;color: #999999;margin:10px 0 15px 130px">选择门店(请搜索触发)</p>
      <el-form-item label="联系电话" prop="phoneNo">
        <el-input v-model="formData.phoneNo" style="width: 300px" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status" class="ml-4">
          <el-radio :label="true" size="large">开启</el-radio>
          <el-radio :label="false" size="large">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
