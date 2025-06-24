<script setup lang="ts">
import * as UserLevelConfigApi from '@/api/member/userLevelConfig'
import * as UserLevelEquityApi from '@/api/member/userLevelEquity'
import * as DiscountCouponApi from '@/api/mall/product/discountCoupon'
import {ref} from "vue";
import {dateFormatter} from "@/utils/formatTime";

interface EquityItem {
  id: number;
  typeName: string;
  type: string;
  selected: boolean;
  equityValue: number;
}

interface EquityArrayItem {
  equityId: number;
  equityValue: number;
}

interface CouponItem {
  id?: number,
  couponName: string
}

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  levelName: undefined,
  level: undefined,
  growthValue: undefined,
  iconUrl: undefined,
  backgroundUrl: undefined,
  status: false,
  remarks: undefined,
  levelEquityList: [] as EquityArrayItem[]
})
const formRules = reactive({
  levelName: [{ required: true, message: '等级名称不能为空', trigger: 'blur' }],
  level: [{ required: true, message: '等级不能为空', trigger: 'blur' }],
  growthValue: [{ required: true, message: '成长值不能为空', trigger: 'blur' }],
  iconUrl: [{ required: true, message: '请上传图标', trigger: 'blur' }],
  backgroundUrl: [{ required: true, message: '请上传背景图', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  getAllEquityList()
  dialogVisible.value = true
  tableRadio.value = {
    couponName: ''
  }
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const resData = await UserLevelConfigApi.getUserLevelConfig(id)
      console.log(resData, 'resData')
      equityList.value.forEach(listItem => {
        let foundItem = resData.levelEquityList.find(resItem => resItem.equityId === listItem.id);
        if (foundItem) {
          listItem.selected = true;
          listItem.equityValue = foundItem.equityValue;
          if(listItem.type === 'coupon'){
            getCouponInfo(listItem.equityValue)
          }
        }
      });
      formData.value = resData
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取当前优惠券数据
const getCouponInfo = async (id) => {
  tableRadio.value = await DiscountCouponApi.getDiscountCoupon(id)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  let equityArray: EquityArrayItem[] = []
  let errorMessageMap = {
    'integral': '积分需大于0',
    'discount': '折扣需大于0',
    'coupon': '请选择权益优惠券'
  };
  for (let i = 0; i < equityList.value.length; i++) {
    let item = equityList.value[i];
    if (item.selected) {
      if ((item.type === 'integral' || item.type === 'discount') && item.equityValue <= 0) {
        message.error(errorMessageMap[item.typeName]);
      } else if (item.type === 'coupon') {
        if (tableRadio.value?.id) {
          item.equityValue = tableRadio.value.id
          equityArray.push({
            equityId: item.id,
            equityValue: item.equityValue
          });
        } else {
          message.error('请选择优惠券');
          return false
        }
      } else {
        equityArray.push({
          equityId: item.id,
          equityValue: item.equityValue
        });
      }
    }
  }
  formData.value.levelEquityList = equityArray
  console.log(formData.value, 'formData')
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as UserLevelConfigApi.UserLevelConfigVO
    if (formType.value === 'create') {
      await UserLevelConfigApi.createUserLevelConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserLevelConfigApi.updateUserLevelConfig(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}


// 优惠券逻辑
const couponVisible =  ref(false)
const visitDetail =  ref(false)
// const couponId = ref([])
const multipleSelection = ref([])
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponName: null
})

// 优惠券选择器弹窗
const oponCoupon = () => {
  getCouponList()
  couponVisible.value = true
}

/** 查询列表 */
const getCouponList = async () => {
  loading.value = true
  try {
    const data = await DiscountCouponApi.getDiscountCouponPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  getCouponList()
}
const handleCurrentChange = (val) => {
  queryParams.pageNo = val
  getCouponList()
}

// 选中商品
const multipleTableRef = ref()
const handleSelectionChange = (val) => {
  if (val.length > 1) {
    let del_row = val.shift();
    multipleTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
  }
  multipleSelection.value = val
}
// 保存选择优惠券ID
const tableRadio = ref<CouponItem>({
  couponName: ''
})
const saveIdList = () => {
  tableRadio.value = multipleSelection.value[0]
  console.log(multipleSelection.value, 'multipleSelection', tableRadio.value, 'tableRadio')
  couponVisible.value = false
}


//获取所有权益列表
const equityList = ref<EquityItem[]>([])
const getAllEquityList = async () => {
  loading.value = true
  try {
    let data = await UserLevelEquityApi.getAllLevelEquityPage()
    equityList.value = data.map(item => ({
      ...item,
      selected: false
    }));
  } finally {
    loading.value = false
  }
}
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    levelName: undefined,
    level: undefined,
    growthValue: undefined,
    iconUrl: undefined,
    backgroundUrl: undefined,
    status: false,
    remarks: undefined,
    levelEquityList: []
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
      label-width="100px"
      class="level-config"
      v-loading="formLoading"
    >
      <h3>会员等级</h3>
      <el-form-item label="等级名称" prop="levelName">
        <el-input v-model="formData.levelName" placeholder="请输入等级名称" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="等级" prop="level">
            <el-input-number
              placeholder="请输入等级"
              v-model="formData.level"
              :min="1"
              :step="1"
              :precision="0"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成长值" prop="growthValue">
            <el-input-number
              placeholder="请输入成长值"
              v-model="formData.growthValue"
              :min="1"
              :step="1"
              :precision="0"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图标" prop="iconUrl">
            <Materials v-model="formData.iconUrl" :num="1" type="image" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="背景" prop="backgroundUrl">
            <Materials v-model="formData.backgroundUrl" :num="1" type="image" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" />
      </el-form-item>
      <el-form-item label="说明" prop="remarks">
        <el-input type="textarea" show-word-limit rows="5" v-model="formData.remarks" placeholder="请输入说明" />
      </el-form-item>
      <h3>等级权益</h3>
      <div class="checkbox-item mb-1" v-for="item of equityList" :key="item.id">
        <div v-if="item.type === 'free_shipping'">
          <el-checkbox v-model="item.selected" :label="item.typeName" size="large" />
        </div>
        <div class="mb-1" v-else-if="item.type === 'integral'">
          <el-checkbox v-model="item.selected" :label="item.typeName" />
          <el-input-number
            v-model="item.equityValue"
            :min="0"
            :step="1"
            :precision="0"
            :controls="false"
          />
          <span>积分</span>
        </div>
        <div class="mb-1" v-else-if="item.type === 'discount'">
          <el-checkbox v-model="item.selected" :label="item.typeName"/>
          <el-input-number
            v-model="item.equityValue"
            :min="0"
            :max="9.9"
            :step="1"
            :precision="1"
            :controls="false"
          />
          <span>折扣</span>
        </div>
        <div class="flex items-center mb-1" v-else-if="item.type === 'coupon'">
          <el-checkbox v-model="item.selected" :label="item.typeName" />
          <span class="select-coupon-btn mr-1" @click="oponCoupon">选择优惠券</span>
          <span v-if="tableRadio.id">已选优惠券：{{tableRadio.couponName}}</span>
        </div>
        <div class="flex items-center mb-1" v-else>
          <el-checkbox v-model="item.selected" :label="item.typeName" />
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!--    选择优惠券列表-->
  <el-dialog
    v-model="couponVisible"
    :title="visitDetail ? '查看优惠券' : '选择优惠券'"
    width="50%"
    top="50px"
    class="group-dialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
  >
    <!-- 表格 -->
    <div class="tableBox">
      <el-table
        ref="multipleTableRef"
        :data="list"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="600"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="!visitDetail"
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column label="优惠券名称" align="center" prop="couponName" />
        <el-table-column label="优惠券类型" align="center">
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
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
        />
      </el-table>
      <div class="fenye">
        <el-pagination
          :current-page="queryParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <template #footer>
      <div class="footBtnBox">
          <span class="dialog-footer">
            <el-button
              v-if="!visitDetail"
              type="primary"
              @click="saveIdList"
            >确 定</el-button>
            <el-button @click="couponVisible = false">取 消</el-button>
          </span>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.level-config {
  h3 {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
    margin: 15px 0;
  }
  .checkbox-item {
    display: flex;
    align-items: center;
    padding-left: 20px;
    .el-input-number {
      margin-left: 5px;
    }
    span {
      margin: 0 5px;
      font-size: 14px;
      color: #999999;
    }
    .select-coupon-btn {
      cursor: pointer;
      color: #409eff;
      font-weight: 500;
    }
  }
}
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>


