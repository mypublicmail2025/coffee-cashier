<template>
  <div class="offline-order-container">
    <!-- 左侧产品展示区 -->
    <div class="left-container flex-1">
      <product-display
:search-keyword="searchKeyword" :products="products" :product-tabs="productTabs"
        :categories="categories" :active-tab-index="activeTabIndex" :active-category-index="activeCategoryIndex"
        @search="handleSearch" @clear="handleClear" @switch-tab="switchTab" @switch-category="switchCategory"
        @click-product="openProductSpecDialog" @open-scanner="openScanner" />
    </div>

    <!-- 右侧购物车区域 -->
    <div class="right-container cart-container flex-col justify-between">
      <shopping-cart
:shop-cart-items="shopCartItems" :active-payment-method="activePaymentMethod"
        :total-order-amount="totalOrderAmount" :total-amount="totalAmount" :discount-amount="discountAmount"
        :payment-methods="paymentMethods" :nick-name="nickName" :cart-loading="cartLoading" :order-remark="orderRemark"
        :current-custom-user="currentCustomUser" @increase-quantity="increaseQuantity"
        @decrease-quantity="decreaseQuantity" @remove-item="removeFromCart" @select-payment-method="selectPaymentMethod"
        @show-pending-orders="showPendingOrders" @save-as-pending-order="saveAsPendingOrder"
        @confirm-payment="confirmPayment" @update-remark="(val) => orderRemark = val"
        @open-switch-user-dialog="openUserSelectDialog" @clear-user-association="clearUserAssociation"
        @open-coupon-dialog="openCouponDialog" @open-user-scan-dialog="openUserScanDialog"
        @open-cash-payment="showCashPayment" />
    </div>
  </div>

  <!-- 商品规格选择弹窗 -->
  <product-spec-dialog
:visible="specDialogVisible" :product="selectedProduct" @close="closeProductSpecDialog"
    @confirm="handleAddToCart" />

  <!-- 挂单列表弹窗 -->
  <pending-orders-dialog
@delete-pending-order="deletePendingOrder" :visible="pendingOrdersVisible"
    :pending-orders="pendingOrders" :current-cart="shopCartItems" @close="closePendingOrdersDialog"
    @load-order="loadPendingOrder" @swap-order="swapPendingOrder" />

  <!-- 扫码组件 -->
  <QRCodeScanner :visible="scannerVisible" @close="closeScanner" @scan-success="handleScanSuccess" />

  <!-- User selection dialog -->
  <user-select-dialog :visible="userSelectDialogVisible" @close="closeUserSelectDialog" @select-user="selectUser" />

  <!-- 优惠券选择弹窗 -->
  <coupon-select-dialog
:visible="couponDialogVisible" :order-amount="totalOrderAmount" :total-amount="totalAmount"
    @close="closeCouponDialog" @apply-discount="applyDiscount" @apply-coupon="applyCoupon" />

  <!-- 现金结算弹窗 -->
  <cash-payment-dialog
:visible="cashPaymentVisible" :total-amount="totalOrderAmount"
    @close="closeCashPayment" @confirm="handleCashPayment" />
  <!-- 支付成功弹窗 -->
  <payment-success-dialog
@clear-cart="clearCart" :visible="paymentSuccessDialogVisible"
    :current-pay-order="payOrderResponse?.result" @print-receipt="printReceipt" @close="closePaymentSuccessDialog" />
  <!-- 支付失败弹窗 -->
  <payment-failed-dialog
@clear-cart="clearCart" @retry-payment="retryPayment" :visible="paymentFailedDialogVisible"
    @close="closePaymentFailedDialog" />
</template>

<script setup>
import ProductDisplay from './components/ProductDisplay.vue'
import PaymentSuccessDialog from './components/PaymentSuccessDialog.vue'
import PaymentFailedDialog from './components/PaymentFailedDialog.vue'
import ProductSpecDialog from './components/ProductSpecDialog.vue'
import PendingOrdersDialog from './components/PendingOrdersDialog.vue'
import QRCodeScanner from '@/components/QRCodeScanner'
import ShoppingCart from './components/ShoppingCart.vue'
import UserSelectDialog from './components/UserSelectDialog.vue'
import CouponSelectDialog from './components/CouponSelectDialog.vue'
import CashPaymentDialog from './components/CashPaymentDialog.vue'
import { useOfflineOrder } from './hooks/useOfflineOrder'

// 使用自定义hook获取所有数据和方法
const {
  // 状态op
  searchKeyword,
  activeTabIndex,
  activeCategoryIndex,
  productTabs,
  categories,
  products,
  shopCartItems,
  activePaymentMethod,
  discountAmount,
  pendingOrders,
  pendingOrdersVisible,
  payOrderResponse,
  specDialogVisible,
  selectedProduct,
  paymentMethods,
  nickName,
  scannerVisible,
  cartLoading,
  paymentSuccessDialogVisible,
  paymentFailedDialogVisible,
  orderRemark,
  // 会员相关
  userSelectDialogVisible,
  currentCustomUser,
  openUserSelectDialog,
  closeUserSelectDialog,
  selectUser,
  clearCart,
  clearUserAssociation,
  closePaymentSuccessDialog,
  closePaymentFailedDialog,
  
  // showPaymentSuccessDialog,
  
  // 优惠券相关
  couponDialogVisible,
  totalOrderAmount,
  totalAmount,
  openCouponDialog,
  openUserScanDialog,
  closeCouponDialog,
  applyDiscount,
  applyCoupon,
  deletePendingOrder,
  // 方法
  switchTab,
  switchCategory,
  handleSearch,
  handleClear,
  openProductSpecDialog,
  closeProductSpecDialog,
  handleAddToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  selectPaymentMethod,
  showPendingOrders,
  closePendingOrdersDialog,
  saveAsPendingOrder,
  loadPendingOrder,
  swapPendingOrder,
  confirmPayment,
  openScanner,
  retryPayment,
  closeScanner,
  handleScanSuccess,
  cashPaymentVisible,
  closeCashPayment,
  handleCashPayment,
  showCashPayment,
} = useOfflineOrder()

</script>

<style scoped>
.offline-order-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  height: 100%;
  background-color: #f5f7fa;
}

.left-container {
  grid-column: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-container {
  grid-column: 2;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 360px;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .offline-order-container {
    grid-template-columns: 1.5fr 1fr;
  }
}

@media (max-width: 768px) {
  .offline-order-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  
  .left-container {
    grid-column: 1;
    grid-row: 1;
  }
  
  .right-container {
    grid-column: 1;
    grid-row: 2;
  }
}
</style>