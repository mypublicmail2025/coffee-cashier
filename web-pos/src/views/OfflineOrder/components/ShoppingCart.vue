<template>
  <div class="cart-container flex-col justify-between">
    <div class="cart-header">
      <div class="user-info">
        <img v-if="currentCustomUser" :src="currentCustomUser.avatar" class="user-avatar" />
        <div class="user-details" v-if="currentCustomUser">
          <div class="username">{{ currentCustomUser.nickname }} <el-link
type="danger" @click="clearUserAssociation"
              class="small-link">解除关联</el-link></div>
          <div class="balance">余额 <span class="balance-value">{{ currentCustomUser.nowMoney || 0 }}</span>元，积分
            <span class="balance-value">{{ currentCustomUser.integral || 0 }} 分</span>
          </div>
        </div>
        <div class="user-details" v-else>
          <div class="username">未关联会员</div>
          <div class="balance">关联会员可享受积分与折扣</div>
        </div>
      </div>
      <div class="flex flex-row items-center justify-end">
        <el-button type="primary" size="small" class="switch-user-btn" @click="openUserScanDialog">{{ currentCustomUser
          ? '会员码' :
          '会员码' }}</el-button>
        <el-button type="primary" size="small" class="switch-user-btn" @click="openSwitchUserDialog">{{
          currentCustomUser ? '切换会员' :
          '关联会员' }}</el-button>
      </div>
    </div>

    <div class="cart-items-container flex-1">
      <!-- 购物车商品列表 -->
      <div v-if="cartLoading" class="cart-loading">
        <el-skeleton :rows="3" animated />
      </div>
      <div v-else-if="shopCartItems.length === 0" class="empty-cart">
        <el-empty description="购物车为空" />
      </div>
      <div v-else class="cart-items">
        <div v-for="(item, index) in shopCartItems" :key="item.uniqueId || index" class="cart-item">
          <div class="item-info">
            <img :src="item.image" alt="商品图片" class="item-image" />
            <div class="item-details">
              <div class="item-name">{{ item.storeName }}</div>
              <div class="item-spec">{{ item.spec }}</div>
              <div class="item-price">¥{{ item.price }}</div>
              <div class="item-stock" v-if="item.stock">库存: {{ item.stock }}</div>
            </div>
          </div>
          <div class="delete-icon-container"></div>
          <div class="delete-icon">
            <el-icon @click="removeItem(index)">
              <Delete />
            </el-icon>
          </div>

          <div class="item-quantity">
            <quantity-control
v-model="item.quantity" :min="1" :max="item.stock || 99999"
              @increase="() => handleIncrease(index)" @decrease="() => handleDecrease(index)" />
          </div>
        </div>
      </div>
    </div>

    <div class="payment-section">
      <div class="payment-header flex flex-row align-center ">
        <span>支付结算</span>
        <el-button :icon="Setting" :disabled="shopCartItems.length===0" @click="handleOpenCouponDialog" class="coupon-button"/>
      </div>
      <div class="payment-amount flex flex-row">
        <div class="amount-label">应付金额</div>
        <div class="amount-value">¥{{ totalOrderAmount }}</div>
      </div>
      <div class="payment-summary flex flex-row justify-between">
        <div class="">共计{{ totalItems }}件商品</div>
        <div class="discount-info" v-if="discountAmount > 0">
          <span> 优惠: </span>
          <span class="discount-amount">¥{{ discountAmount }}</span>
        </div>
      </div>



      <!-- 支付方式 -->
      <div class="payment-methods">
        <div
v-for="(method, index) in paymentMethodList" :key="index"

          :class="['payment-method flex flex-row align-center', {active: activePaymentMethod === index,disabled: method.disabled}]"
          @click="selectPaymentMethod(index)">
          <img :src="method.img" class="payment-method-icon" />
          <span>{{ method.name }}</span>
        </div>
      </div>
      <el-divider />

      <!-- 收银操作 -->
      <div class="cashier-actions flex flex-row items-center justify-between">
        <div class="receipt-info">
          <span>收银员：{{ nickName }}</span>
        </div>
        <div class="action-buttons">
          <el-button @click="showPendingOrders" :disabled="cartLoading">取单</el-button>
          <el-button @click="saveAsPendingOrder" :disabled="cartLoading || shopCartItems.length === 0">挂单</el-button>
          <el-button
type="primary" class="confirm-button" @click="confirmPayment" :loading="paymentLoading"
            :disabled="cartLoading || shopCartItems.length === 0">
            确认收款
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Delete,  Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import QuantityControl from '../components/QuantityControl.vue'

const props = defineProps({
  shopCartItems: {
    type: Array,
    required: true
  },
  activePaymentMethod: {
    type: Number,
    default: 0
  },
  totalOrderAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  }, 
  totalAmount: {
    type: Number,
    default: 0
  },
  paymentMethods: {
    type: Array,
    default: () => [
      
    ]
  },
  nickName: {
    type: String,
    default: '收银员'
  },
  cartLoading: {
    type: Boolean,
    default: false
  },
  orderRemark: {
    type: String,
    default: ''
  },
  currentCustomUser: {
    type: Object,
    default: null
  }
})

// 本地状态
const paymentLoading = ref(false)



const totalItems = computed(() => {
  return props.shopCartItems.reduce((sum, item) => sum + item.quantity, 0)
})

const emit = defineEmits([
  'increase-quantity', 
  'decrease-quantity', 
  'remove-item', 
  'select-payment-method',
  'show-pending-orders',
  'save-as-pending-order',
  'confirm-payment',
  'update-remark',
  'open-switch-user-dialog',
  'clear-user-association',
  'open-coupon-dialog',
  'open-user-scan-dialog',
  'open-cash-payment'
])

// 处理商品数量增加
const handleIncrease = (index) => {
  emit('increase-quantity', index)
}

// 处理商品数量增加
const openSwitchUserDialog = () => {
  emit('open-switch-user-dialog')
}

// 处理商品数量增加
const openUserScanDialog = () => {
  emit('open-user-scan-dialog','user')
}

// 处理商品数量减少
const handleDecrease = (index) => {
  emit('decrease-quantity', index)
}

// 处理商品数量减少
const handleOpenCouponDialog = () => {
  emit('open-coupon-dialog')
}

// 移除商品
const removeItem = (index) => {
  emit('remove-item', index)
}

const paymentMethodList = computed(() => {
  return props.paymentMethods.map(method => {
    const disabled = method.payType === 'yue' && (props.currentCustomUser?.nowMoney < props.totalOrderAmount || props.currentCustomUser?.nowMoney === 0)
    return {
      ...method,
      disabled: disabled
    }
  })
})
// 选择支付方式
const selectPaymentMethod = (index) => {
  if(props.paymentMethods[index].disabled){
    return
  }
  emit('select-payment-method', index)
}

// 显示挂单列表
const showPendingOrders = () => {
  emit('show-pending-orders')
}

// 保存为挂单
const saveAsPendingOrder = () => {
  emit('save-as-pending-order')
}

// 确认支付
const confirmPayment = async () => {
  if (props.shopCartItems.length === 0) return
  
  // 判断支付方式
  if (props.activePaymentMethod === 3) { // 现金支付
    emit('open-cash-payment')
    return
  }

  // 其他支付方式
  paymentLoading.value = true
  try {
    await emit('confirm-payment')
  } finally {
    paymentLoading.value = false
  }
}

// 清除会员关联
const clearUserAssociation = () => {
  emit('clear-user-association')
}

</script>

<style scoped>
.cart-container {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.user-avatar{
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 8px;
}
.coupon-button{
  display: flex;
  align-items: center;
  color: var(--el-color-primary);
  padding: 0 8px;
  cursor: pointer;
  border: none;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
}

.cart-items-container {
  overflow-y: auto;
}

.cart-loading, .empty-cart {
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
}

.payment-coupon {
  font-size: 12px;
  color: var(--el-color-primary);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 8px;
  border-bottom: 1px solid #eee;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
}

.item-spec {
  font-size: 12px;
  color: #909399;
}

.item-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 8px;
}

.item-quantity {
  display: flex;
  align-items: center;
}
.item-stock{
  font-size: 12px;
}
.order-remark {
  margin: 12px 0;
}

.payment-section {
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.payment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #16191F;
  font-size: 16px;
  font-weight: 600;
}

.payment-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.payment-methods {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  justify-content: center;
  border: 1px solid #DFE2E6;
  .payment-method-icon{
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
}

.payment-method i {
  font-size: 24px;
  margin-bottom: 4px;
  
}

.payment-method.active {
  background: rgba(1, 120, 96, 0.1);
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #017860;
}
.payment-method.disabled{
  background: #f0f2f5;
  color: #909399;
  cursor: not-allowed;
}

.cashier-actions {
  margin-top: 8px;
}

.receipt-info {
  margin-bottom: 8px;
}
.balance{
  font-size: 12px;
  color: #909399;
}
.balance-value{
  font-size: 12px;
  color: var(--el-color-primary);
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.delete-icon-container {
  width: 50px;
  height: 50px;
  position: absolute;
  right: -25px;
  top: -25px;
  border-radius: 99px;
  background: #f748291a;
}

.delete-icon {
  padding: 10px;
  font-size: 12px;
  position: absolute;
  top: -6px;
  right: -6px;
  cursor: pointer;
  color: #f74829;
}

.small-link {
  font-size: 12px;
  margin-left: 8px;
}

.username {
  font-weight: bold;
  display: flex;
  align-items: center;
}
</style> 