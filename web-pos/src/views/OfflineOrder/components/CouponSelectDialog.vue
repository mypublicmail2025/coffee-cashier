<template>
  <el-dialog v-model="dialogVisible" title="选择优惠券" width="500px" destroy-on-close>
    <div class="coupon-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      <!-- 手动折扣输入 -->
      <div class="manual-discount-section">
        <el-radio-group v-model="discountType" @change="handleDiscountTypeChange">
          <el-radio :checked="discountType === '1'" label="1">折扣</el-radio>
          <el-radio :checked="discountType === '2'" label="2">立减</el-radio>
        </el-radio-group>
        <div class="discount-inputs">
          <div class="discount-input-group">
            <div class="input-label">折扣 (折)</div>
            <el-input-number
v-model="discount" :disabled="discountType !== '1'" type="number" placeholder="请输入" min="0"
              max="10" />
          </div>
          <div class="discount-input-group">
            <div class="input-label">立减 (元)</div>
            <el-input-number
v-model="fixedAmount" :disabled="discountType !== '2'" type="number" placeholder="请输入" min="0"
              :max="props.totalAmount" />
          </div>
        </div>
        <div class="remark-section">
          <div class="input-label">备注</div>
          <el-input v-model="remark" type="textarea" placeholder="请输入备注" :rows="3" />
        </div>
      </div>

      <!-- 优惠券列表 -->
       <div class="coupon-info">
        <div>应付金额：<span class="amount">{{ orderAmount.toFixed(2) }}</span></div>
        <div v-if="discountType === '1'&&discount" class="coupon-info-item">原价：<span class="">{{ props.totalAmount }}</span>元,手动折扣<span class="amount">{{ discount||0 }}</span>折</div>
        <div v-if="discountType === '2'&&fixedAmount" class="coupon-info-item">原价：<span class="">{{ props.totalAmount }}</span>元,手动立减<span class="amount">{{ fixedAmount||0 }}</span>元</div>
       </div>

    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="applyDiscount" :loading="applyLoading">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  // orderAmount: {
  //   type: Number,
  //   default: 0
  // },
  totalAmount: {
    type: Number,
    default: 0
  },
  couponInfo: {
    type: Object,
    default: () => {}
  },
  // 传入的优惠券列表（如果已有接口获取）
  availableCoupons: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'apply-discount', 'apply-coupon'])

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) emit('close')
  }
})
const orderAmount = computed(() => {
  if(discountType.value === '1'&&discount.value){
    return  discount.value*props.totalAmount*0.1
  }else if(discountType.value === '2'){
    return props.totalAmount - fixedAmount.value
  }else{
    return props.totalAmount
  }
})
// 本地状态
const loading = ref(false)
const applyLoading = ref(false)
const discount = ref('')
const discountType = ref('1')
const fixedAmount = ref('')
const remark = ref('')
const selectedCouponId = ref(null)



const handleDiscountTypeChange = (value) => {
  discountType.value = value
  if (value === '1') {
    discount.value = ''
    fixedAmount.value = ''
  } else {
    discount.value = ''
    fixedAmount.value = ''
  }
}



// 关闭弹窗
const closeDialog = () => {
  emit('close')
  
}


// 应用优惠
const applyDiscount = () => {
  applyLoading.value = true
  
  try {
    if (selectedCouponId.value) {
      // 应用优惠券
      const selectedCoupon = coupons.value.find(c => c.id === selectedCouponId.value)
      if (selectedCoupon) {
        emit('apply-coupon', selectedCoupon)
      }
    } else if (discount.value) {
      // 应用折扣
      const discountValue = parseFloat(discount.value)
      if (discountValue > 0 && discountValue <= 10) {
        emit('apply-discount', {
          type: 'discount',
          value: discountValue,
          remark: remark.value
        })
      }
    } else if (fixedAmount.value) {
      // 应用立减
      const amount = parseFloat(fixedAmount.value)
      if (amount > 0) {
        emit('apply-discount', {
          type: 'fixed',
          value: amount,
          remark: remark.value
        })
      }
    }
    
    // 关闭弹窗
    closeDialog()
  } finally {
    applyLoading.value = false
  }
}
</script>

<style scoped>
.coupon-container {
  max-height: 60vh;
  overflow-y: auto;
}

.loading-container, .empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 8px;
}

.manual-discount-section {
  margin-bottom: 24px;
}

.discount-inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.discount-input-group {
  flex: 1;
}

.input-label {
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.remark-section {
  margin-top: 16px;
}

.coupon-list {
  margin-top: 24px;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.coupon-info{
  color:#16191F;
  font-size: 14px;
  font-weight: 400;
  .amount{
    color:#F74829;
    font-size: 16px;
    font-weight: 600;
  }
}

.coupon-item.selected {
  border-color: var(--el-color-primary);
  background-color: rgba(64, 158, 255, 0.1);
}

.coupon-left {
  width: 100px;
  text-align: center;
  border-right: 1px dashed #dcdfe6;
  padding-right: 16px;
}

.coupon-amount {
  font-size: 20px;
  font-weight: bold;
  color: #F56C6C;
  margin-bottom: 4px;
}
.coupon-info{
  background: #F7F8FA;
  border-radius: 4px 4px 4px 4px;
  padding: 16px;
  margin-top: 10px;
}
.coupon-info-item{
  color:var(--el-color-primary);
}

.coupon-condition {
  font-size: 12px;
  color: #606266;
}

.coupon-center {
  flex: 1;
  padding: 0 16px;
}

.coupon-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.coupon-validity {
  font-size: 12px;
  color: #909399;
}

.coupon-right {
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style> 