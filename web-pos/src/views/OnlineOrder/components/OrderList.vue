<template>
  <div class="order-list-container flex flex-col">
    <!-- Loading state -->
    <div v-if="loading" class="flex-1 loading-container flex flex-start">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Empty state -->
    <div v-else-if="orders.length === 0" class="empty-container flex-1">
      <el-empty description="暂无订单" />
    </div>

    <!-- Orders list with scroll loading -->
    <div v-else ref="orderListRef" class="orders-list " @scroll="handleScroll">
      <order-card
:order-index="index + 1" @write-off="handleWriteOff" @print-receipt="handlePrintReceipt"
        @complete="handleComplete" @view-shansong-location="handleViewShansongLocation"
        @make-finish="handleBatchMakeFinish" v-for="(order,index) in orders" :key="order.id" :order="order"
        :order-type="getOrderType(order)" @accept="handleAcceptOrder" @reject="handleRejectOrder"
        @view-detail="handleViewOrderDetail" />


      <!-- Loading more indicator -->
      <div v-if="loadingMore" class="loading-more">
        <el-icon class="loading-icon">
          <loading />
        </el-icon>
        <span>加载更多...</span>
      </div>


      <!-- No more data indicator -->
      <div v-if="noMoreData" class="no-more-data">
        没有更多订单了
      </div>


    </div>
    <div class="click-loading-more flex flex-row justify-center items-center" v-if="orders.length <totalCount">
      <div class="" @click="loadMore">点击加载更多</div>
    </div>
    <div class="order-list-bottom flex flex-end flex-row  justify-space-between items-center">
      <div>订单共计:{{ totalCount }}单</div>
      <div class="flex flex-end" v-if="isPendingOrder">
        <el-button type="primary" @click="handleBatchAccept(orders.map(order => order.orderId))">一键接单</el-button>
      </div>
      <div class="flex flex-end " v-if="isMakeFinishOrder">
        <el-button type="primary" @click="handleBatchMakeFinish(orders.map(order => order.orderId))">一键完成</el-button>
      </div>
      <div class="flex flex-end " v-if="isWriteOffOrder">
        <el-button type="primary" @click="handleWriteOff(-1)">一键核销</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch, computed } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import OrderCard from './OrderCard.vue';
import { debounce } from 'lodash';
const props = defineProps({
  orderType: {
    type: String,
    default: 'self', // 'self', 'takeout', 'delivery'
  },
  activeMainTab: {
    type: Object,
    default: () => {
      return {
        name: 'pending-order'
      }
    }
  },
  loading: {
    type: Boolean,
    default: false
  },
  orders: {
    type: Array,
    default: () => []
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['accept-order', 'write-off', 'view-shansong-location','reject-order', 'load-list','view-order-detail', 'page-change', 'selection-change']);

const loadingMore = ref(false);
const orderListRef = ref(null);
const lastRequestTime = ref(0)
const intervalLoad = ref(null)
// 计算是否没有更多数据
const noMoreData = computed(() => {
  return props.orders.length >= props.totalCount && props.totalCount > 0;
});

const isPendingOrder = computed(() => {
  return props.activeMainTab === 'pending-order';
});


const isMakeFinishOrder = computed(() => {
  return props.activeMainTab === 'make-finish-order';
});

const isWriteOffOrder = computed(() => {
  return props.activeMainTab === 'verify-order'||props.activeMainTab === 'delivery-order';
});


// 获取订单类型
const getOrderType = (order) => {
  switch(order.shippingType) {
    case 0: return 'takeout'; // 堂食
    case 1: return 'self';    // 自提
    case 2: return 'delivery'; // 外送
    default: return 'self';
  }
};

// Event handlers
const handleAcceptOrder = (orderIds) => {
  emit('accept-order', orderIds);
};

const handleComplete = (orderIds) => {
  emit('complete', orderIds);
};

// Event handlers
const handlePrintReceipt = (orderId) => {
  emit('print-receipt', orderId);
};

const handleRejectOrder = (orderId) => {
  emit('reject-order', orderId);
};

const handleViewOrderDetail = (orderId) => {
  emit('view-order-detail', orderId);
};

const handleWriteOff = (orderId) => {
  emit('writeOff', orderId);
};

const handleBatchMakeFinish = (orderIds) => {
  emit('make-finish', orderIds);
};

const handleBatchAccept = (orderIds) => {
  emit('accept-order', orderIds);
};

const handleViewShansongLocation = (orderId) => {
  emit('view-shansong-location', orderId);
};

// 滚动加载更多
const handleScroll = (e) => {
  if (loadingMore.value || props.loading || noMoreData.value) return;
  
  const el = e.target;
  // 当滚动到距离底部20px以内时加载更多
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) {
    debounce(()=>{
      loadMore()
    },100)();
  }
};

onMounted(()=>{
  intervalLoad.value = setInterval(()=>{
    loadList()
  },30000)
})

const loadList = async () => {
  emit('page-change', 1);
}




const loadMore = async () => {
  if (loadingMore.value || props.loading || noMoreData.value) return;

  if (lastRequestTime.value > 0 && props.orders.length === props.totalCount && Date.now() - lastRequestTime.value < 10000){
    return
  }
  loadingMore.value = true;
  

  try {
    emit('page-change', props.currentPage + 1);
  } finally {
    // 延迟关闭加载状态，提供更好的用户体验
    setTimeout(() => {
      loadingMore.value = false;
    }, 300);
  }
};

// Watch for order type changes to reset pagination
watch(() => props.orderType, () => {
  emit('page-change', 1);
});

// Reset counter when component is mounted
onMounted(() => {
  if (intervalLoad.value) {
    clearInterval(intervalLoad.value)
  }
});
</script>

<style scoped>
.order-list-container {
  height: 100%;
  padding: 6px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: hidden;
}
.order-list-bottom{
  padding: 16px ;
  border-top: 1px solid #e0e0e0;
  justify-content: space-between;
  position: absolute  ;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  left: 0;
  right: 0;
  z-index: 1000;
}

.loading-container, .empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.orders-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 50px;
  height: 100%;
  overflow-y: auto;
}

.loading-more, .no-more-data {
  width: 100%;
  text-align: center;
  margin: 16px 0;
  color: #909399;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.click-loading-more{
  cursor: pointer;
  text-align: center;
  bottom:40px;
  position:absolute;
  left:50%;
  transform: translateX(-50%);
  color: #409EFF;
  width: 100%;
  z-index: 1001;
  
}

.loading-icon {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style> 