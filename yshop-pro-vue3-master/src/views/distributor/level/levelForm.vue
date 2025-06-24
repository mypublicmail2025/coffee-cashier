<script setup lang="ts">
import {ref} from "vue";
import {CreateLevel} from "@/types/distributor";
import * as DistributionLevelApi from "@/api/distributor/level"
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogTitle = ref<string>('添加等级') // 弹窗的标题
const dialogVisible = ref<boolean>(false)
const formLoading = ref<boolean>(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref<string>('') // 表单的类型：create - 新增；update - 修改
const visitDetail = ref<boolean>(false) // 表单是否可以编辑

const selectUser = ref<boolean>(false) // 人数
const selectAmount = ref<boolean>(false) // 金额
const selectWages = ref<boolean>(false) // 佣金

const initForm = (): CreateLevel => {
  return {
    level: null, // 等级，范围为 1-10
    name: '', // 等级名称
    firstWages: 0, // 一级佣金比例
    secondWages: 0, // 二级佣金比例
    upType: 0, // 升级类型，0表示满足任意条件，1表示满足全部条件
    userCount: 0, // 人数，-1表示未选中
    amount: 0, // 金额，-1表示未选中
    wages: 0 // 佣金，-1表示未选中
  }
}
const formData = ref<CreateLevel>(initForm())

const levelList = ref<number[]>([1,2,3,4,5,6,7,8,9,10])
const currentLevel = ref<number | null>(0) // 当前选择等级
const existingLevel = ref<number[]>([]) // 已有分销商等级
const formRules = reactive({
  name: [{ required: true, message: '等级名称不能为空', trigger: 'blur' }],
  firstWages: [{ required: true, message: '一级分销佣金不能为空', trigger: 'blur' }],
  secondWages: [{ required: true, message: '二级分销佣金不能为空', trigger: 'blur' }]
})
const formRef = ref()

// 打开窗口
const open = async (type: string, id?: number) => {
  formType.value = type
  existingLevel.value = await DistributionLevelApi.getHaveLevelApi()
  dialogVisible.value = true
  resetForm()
  dialogTitle.value = id ? '编辑等级' : '添加等级'
  if (id) {
    const data = await DistributionLevelApi.getLevelDetail(id);
    visitDetail.value = data.level === 1
    const index = existingLevel.value.indexOf(data.level);
    if (index > -1) existingLevel.value.splice(index, 1);
    currentLevel.value = data.level;
    formData.value = {
      ...data,
      userCount: sanitizeValue(data.userCount),
      amount: sanitizeValue(data.amount),
      wages: sanitizeValue(data.wages)
    }
    selectUser.value = selectValue(data.userCount)
    selectAmount.value = selectValue(data.amount)
    selectWages.value = selectValue(data.wages)
  }
}
// 选择等级
const selectionLevel = (level: number) => {
  if (!existingLevel.value.includes(level)) {
    currentLevel.value = level
    formData.value.level = level
  }
}

// 新增等级
const addLevel = async () => {
  formRef.value.validate(async (valid:unknown) => {
    if (valid) {
      formLoading.value = true
      if (!selectUser.value && !selectAmount.value && !selectWages.value) {
        message.error('只少选择一个升级条件');
        formLoading.value = false
        return false
      }
      try {
        const { level, name, firstWages, secondWages, upType, userCount, amount, wages, id } = formData.value;
        let data: CreateLevel = {
          id,
          level,
          name,
          firstWages,
          secondWages,
          upType,
          userCount: selectUser.value ? userCount : -1,
          amount: selectAmount.value ? amount : -1,
          wages: selectWages.value ? wages : -1
        }
        if (formType.value === 'create') {
          await DistributionLevelApi.createLevelApi(data)
          message.success(t('common.createSuccess'))
        } else {
          await DistributionLevelApi.updateLevelApi(data)
          message.success(t('common.updateSuccess'))
        }
        formLoading.value = false
        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
      } catch (err) {
        formLoading.value = false
      } finally {
        formLoading.value = false
      }
    } else {
      return false
    }
  })
}

/** 重置表单 */
const resetForm: () => void = () => {
  selectUser.value = false
  selectAmount.value = false
  selectWages.value = false
  formData.value = initForm()
  formRef.value?.resetFields()
}
// 返回对应的值
const sanitizeValue = (value: number): number => value === -1 ? 0 : value
// 返回对应的开关 true false
const selectValue = (value: number): boolean => value !== -1
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="40%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
    >
      <el-form-item label="选择等级" class="is-required" v-if="!visitDetail">
        <div class="levelList flex flex-wrap">
          <div class="level-item" :class="{notChoose: existingLevel.includes(item), selected: currentLevel === item}" v-for="item in levelList" :key="item" @click="selectionLevel(item)">{{item}}级</div>
        </div>
      </el-form-item>
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入等级名称" />
      </el-form-item>
      <div class="level-title">
        <h3>等级佣金</h3>
      </div>
      <el-form-item label="一级分销佣金" prop="firstWages">
        <el-input-number
          v-model="formData.firstWages"
          :min="0"
          :max="99.99"
          :step="1"
          :precision="2"
          controls-position="right"
        />
        <span style="margin-left: 10px">%</span>
      </el-form-item>
      <el-form-item label="二级分销佣金" prop="secondWages">
        <el-input-number
          v-model="formData.secondWages"
          :min="0"
          :max="99.99"
          :step="1"
          :precision="2"
          controls-position="right"
        />
        <span style="margin-left: 10px">%</span>
      </el-form-item>
      <div class="level-title" v-if="!visitDetail">
        <h3>等级升级</h3>
        <el-form-item label="升级条件" class="is-required">
          <el-radio-group class="radio" v-model="formData.upType" >
            <el-radio :label="0">满足以下任意条件</el-radio>
            <el-radio :label="1">满足以下全部条件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox v-model="selectUser">团队人数</el-checkbox>
            <el-input-number
              v-model="formData.userCount"
              :min="0"
              :max="999999999"
              :step="1"
              :precision="0"
              controls-position="right"
              style="margin:0 10px"
            />
            <span>人</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox v-model="selectAmount">销售金额</el-checkbox>
            <el-input-number
              v-model="formData.amount"
              :min="0"
              :max="999999999"
              :step="1"
              :precision="0"
              controls-position="right"
              style="margin:0 10px"
            />
            <span>元</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox v-model="selectWages">累计佣金</el-checkbox>
            <el-input-number
              v-model="formData.wages"
              :min="0"
              :max="999999999"
              :step="1"
              :precision="0"
              controls-position="right"
              style="margin:0 10px"
            />
            <span>元</span>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        @click="addLevel"
      >保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.levelList {
  width: 520px;
  .level-item {
    width: 90px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    font-size: 14px;
    color: #666666;
  }
  .level-item:hover {
    background-color: #3f9eff;
    color: #ffffff;
  }
  .level-item:nth-child(5n) {
    margin-right: 0;
  }
  .selected {
    background-color: #3f9eff;
    color: #ffffff;
  }
  .notChoose {
    cursor: not-allowed;
    background: #CCCCCC;
    color: #666666;
    opacity: 0.4;
  }
  .notChoose:hover {
    background: #CCCCCC;
    color: #666666;
  }
}
.level-title {
  h3 {
    color: #333333;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 500;
  }
}
</style>
