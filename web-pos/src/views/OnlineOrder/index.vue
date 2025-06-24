<template>
  <div class="online-order-container">

    <!-- Main Tab Bar Navigation -->
    <div class="main-tab-bar h-full flex flex-col">
      <el-tabs v-model="activeMainTab" class="main-tabs">
        <el-tab-pane v-for="tab in orderTypeCountTabs" :key="tab.name" :label="tab.label" :name="tab.name">

          <template #label v-if="tab.count > 0">
            <el-badge :value="tab.count" class="flex flex-row items-center justify-center">
              <span>{{ tab.label }}</span>
            </el-badge>
          </template>
          <template #label v-else>
            <span>{{ tab.label }}</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="flex-1 order-list-container-wrapper">
        <order-list
:current-page="currentPage" @print-receipt="handlePrintReceipt" @complete="handleCompleteOrder"
          @view-shansong-location="handleViewShansongLocation" @write-off="handleVerify"
          :active-main-tab="activeMainTab" :loading="loading" :orders="orders" :total-count="totalCount"
          @accept-order="handleAcceptOrder" @reject-order="handleRejectOrder" @view-order-detail="handleViewOrderDetail"
          @make-finish="handleMakeFinish" @page-change="handlePageChange" />
      </div>

    </div>


    <!-- 扫码组件 -->
    <QRCodeScanner :visible="scannerVisible" @close="closeScanner" @scan-success="handleScanSuccess" />
    <!-- Order detail dialog -->
    <order-detail-dialog
:visible="detailDialogVisible" :order="selectedOrder" @close="closeOrderDetail"
      @accept="handleAcceptOrderInDialog" @update-remark="handleUpdateRemark" />

    <delivery-map-dialog
:visible="shansongLocationVisible" :orderId="shansongLocationOrderId"
      @close="closeShansongLocation" />
  </div>

</template>

<script setup lang="ts">
import QRCodeScanner from '@/components/QRCodeScanner'
import DeliveryMapDialog from './components/DeliveryMapDialog.vue'
import OrderList from './components/OrderList.vue'
import OrderDetailDialog from './components/OrderDetailDialog.vue'
import { useOnlineOrder } from './hooks/useOnlineOrder'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const orderTypeMap = {
  'pending-order': 'pendingOrders',
  'make-finish-order': 'inProduction',
  'verify-order': 'pendingCancellation',
  'delivery-order': 'inDelivery',
}
const orderTypeCountTabs = computed(() => {
  return orderTypeTabs.map((tab) => {
    const count = appStore.eachStatusOrderCount[orderTypeMap[tab.name]]
    return {
      ...tab,
      count: count || 0
    }
  })
})
// to get all data and methods
const {
  // State
  orderTypeTabs,
  activeMainTab,
  loading,
  orders,
  totalCount,
  detailDialogVisible,
  selectedOrder,
  scannerVisible,
  currentPage,
  shansongLocationVisible,
  shansongLocationOrderId,
  handleVerify,
  closeScanner,
  handleScanSuccess,
  closeShansongLocation,
  handleViewShansongLocation,
  // Methods
  handlePageChange,
  handleMakeFinish,
  handleAcceptOrder,
  handleRejectOrder,
  handleViewOrderDetail,
  handleAcceptOrderInDialog,
  handleCompleteOrder,
  handleUpdateRemark,
  closeOrderDetail,
  handlePrintReceipt
  // handleOrderTypeTabClick,
  // handleSearch,
  // resetSearch
} = useOnlineOrder()
</script>

<style scoped>
.online-order-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
}

.order-list-container-wrapper {
  flex: 1;
  overflow: hidden;
  height: calc(100% - 48px);
}

.page-header {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.main-tab-bar {
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.main-tabs {
  padding: 0 24px;
}

.search-bar {
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

.order-tabs-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.center-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style> 