<template>
  <div class="order-card flex justify-start flex-col">
    <!-- Order header with type tag and order number -->
    <div class="order-header flex flex-row ">
      <div class="order-tag" :class="orderTypeClass">{{ orderTypeText+ ' ' + orderIndex }}</div>
      <div class="order-number">{{ order.orderId }}</div>
      <!-- <div class="order-index justify-end">{{ orderIndex }}</div> -->
    </div>
    <div class="order-divider"></div>
    <!-- Order product list -->
    <div class="order-product-list mt-2 flex-1">
      <div ref="productListContainer" class="product-list-container">
        <div v-for="(item, index) in orderItems" :key="index" class="order-product-item">
          <img :src="item.productInfo?.image" alt="商品图片" class="product-image" />
          <div class="product-info">
            <div class="product-name">{{ item.productInfo?.storeName }}</div>
            <div class="product-spec">{{ item.productInfo?.attrInfo?.sku }}</div>
            <!-- <div class="product-price">¥{{ item.truePrice }}</div> -->
          </div>
          <div class="product-quantity">×{{ item.cartNum }}</div>
        </div>
      </div>
      <div v-if="hasOverflow" class="product-more flex items-center justify-center" @click="handleViewDetail">
        <Icon icon="ep:arrow-down" :size="20" />
      </div>
    </div>
    <div class="order-divider"></div>
    <!-- Order info -->
    <div class="order-info">
      <div class="info-item flex flex-row items-center">
        <span class="label">时间：</span>
        <span class="value">{{ formatDate(order.createTime) }}</span>
      </div>
      <div class="info-item flex flex-row items-center">
        <span class="label">备注：</span>
        <span :class="order.mark==='收银台下单' ? 'text-red-500 value' : 'value'" >{{ order.mark }}</span>
      </div>

    </div>

    <!-- Order actions -->
    <div v-if="props.order.status === 9" class="order-actions flex flex-end">
      <el-button v-if="showDetailButton" text size="small" @click="handleViewDetail" class="detail-btn">
        订单详情
      </el-button>
      <el-button size="small" @click="handleReject" class="reject-btn">
        拒 单
      </el-button>
      <el-button type="primary" size="small" @click="handleAccept" class="accept-btn">
        接 单
      </el-button>

    </div>
    <div v-else-if="props.order.status === 10" class="order-actions flex flex-end">

      <el-button v-if="showDetailButton" text size="small" @click="handleViewDetail" class="detail-btn">
        订单详情
      </el-button>
      <el-button size="small" @click="handlePrintReceipt" class="reject-btn">
        小票
      </el-button>
      <el-button size="small" @click="handleReject" class="reject-btn">
        拒 单
      </el-button>
      <el-button size="small" @click="handleMakeFinish" class="accept-btn">
        制作完成
      </el-button>

    </div>
    <div v-else-if="props.order.status === 11" class="order-actions flex flex-end">
      <el-button v-if="showDetailButton" text size="small" @click="handleViewDetail" class="detail-btn">
        订单详情
      </el-button>
      <el-button size="small" @click="handleComplete" class="reject-btn">
        完成
      </el-button>
      <el-button size="small" @click="handleWriteOff" class="accept-btn">
        核销
      </el-button>



    </div>
    <div
v-else-if="props.order.status === 12||props.order.status === 20||props.order.status === 30"
      class="order-actions flex flex-end">
      <el-button v-if="showDetailButton" size="small" @click="handleViewDetail" class="detail-btn">
        订单详情
      </el-button>
      <el-button size="small" @click="handleViewShansongLocation" class="accept-btn">
        查看位置
      </el-button>


    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import dayjs from 'dayjs';
const props = defineProps({
  orderIndex: {
    type: Number,
    default: 1
  },
  order: {
    type: Object,
    required: true
  },
  orderType: {
    type: String,
    default: 'self', // 'self', 'takeout', 'delivery'
  }
});

const emit = defineEmits(['accept','print-receipt', 'view-shansong-location', 'make-finish', 'reject', 'view-detail']);

// Computed properties for order type display
const orderTypeText = computed(() => {
  switch(props.order.shippingType) {
    case 2: return '自提';
    case 3: return '堂食';
    case 1: return '外卖';
    default: return '-';
  }
});

const orderTypeClass = computed(() => {
  return `type-${props.order.shippingType}`;
});

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};


const orderItems = computed(() => {
  const result = props.order.storeOrderCartInfoDOList.map(item => JSON.parse(item.cartInfo));
  return result;
});


const showDetailButton = computed(() => {
  // Always show detail button
  return true;
});

// Event handlers
const handleAccept = () => {
  emit('accept', [props.order.orderId]);
};

const handleReject = () => {
  emit('reject', [props.order.orderId]);
};

const handleMakeFinish = () => {
  emit('make-finish', [props.order.orderId]);
};


const handleComplete = () => {
  emit('complete', [props.order.orderId]);
};

const handlePrintReceipt = () => {
  emit('print-receipt', props.order.orderId);
};

const handleWriteOff = () => {
  emit('writeOff', props.order.orderId);
};

const handleViewDetail = () => {
  emit('view-detail', props.order.id);
};

const handleViewShansongLocation = () => {
  emit('view-shansong-location', props.order.orderId);
};

// DOM引用
const productListContainer = ref(null);
const hasOverflow = ref(false);

// 检查商品列表是否溢出
const checkOverflow = async () => {
  await nextTick();
  if (productListContainer.value) {
    const container = productListContainer.value;
    hasOverflow.value = container.scrollHeight > container.clientHeight;
  }
};

// 在组件挂载后和订单项变化时检查溢出
onMounted(() => {
  checkOverflow();
});

// 监听orderItems变化
watch(() => props.order.storeOrderCartInfoDOList, () => {
  checkOverflow();
}, { deep: true });
</script>

<style scoped>
.order-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  width: 282px;
  max-height: 340px;
  padding: 16px;
  background: #F1F3F6;
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
.order-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ebeef5;
  padding-bottom: 8px;
}

.order-tag {
  padding: 2px 8px;
  border-radius: 8px;
  margin-right: 4px;
  font-size: 12px;
}
.product-more {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 34px;
  z-index: 100;
  background: linear-gradient(180deg, rgba(241, 243, 246, 0) 0%, #F1F3F6 78%);
  cursor: pointer;
}
.type-2 {
  color: #409EFF;
  background-color: rgba(44, 128, 255, 0.1);
}

.type-1 {
  background-color: rgba(1, 120, 96, 0.1);
  color: var(--el-color-primary);
}

.type-3 {
  background-color: rgba(247, 154, 41, 0.1);
  color: #E6A23C;
}

.order-number {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
}

.order-product-list {
  min-height: 100px;
  max-height: 200px;
  position: relative;
  overflow: hidden;
}

.product-list-container {
  max-height: 180px;
  overflow-y: auto;
  padding-bottom: 10px;
}

.order-product-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.product-info {
  flex: 1;
}

.product-name {
  color: #16191F;
  margin-bottom: 4px;
  font-size: 14px;
}

.product-spec, .product-price {
  font-size: 12px;
  color: #909399;
}

.product-quantity {
  color: #303133;
}

.order-info {
  margin-bottom: 8px;
  border-top: 2px solid #ebeef5;
  padding-top: 12px;
}

.info-item {
  display: flex;
  color: #4D5567;
  margin-bottom: 4px;
}

.label {
  width: 50px;
  font-size: 14px;
}

.value {
  flex: 1;
  max-lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.status-0 {
  color: #909399;
}

.status-1, .status-10 {
  color: #E6A23C;
}

.status-2, .status-20, .status-30 {
  color: #67C23A;
}

.status-3, .status-4, .status-40 {
  color: #F56C6C;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
}

.reject-btn {
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #DFE2E6;
  margin-left: 6px;
}

.accept-btn {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.detail-btn {
  border-color: #909399;
  color: var(--el-color-primary);
}
</style> 