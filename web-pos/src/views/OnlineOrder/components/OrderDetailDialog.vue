<template>
  <el-dialog
    v-model="dialogVisible"
    title="订单详情"
    width="600px"
    :close-on-click-modal="false"
  >
    <div v-if="order" class="order-detail">
      <div class="detail-section">
        <div class="detail-item">
          <span class="item-label">订单编号：</span>
          <span class="item-value">{{ order.orderId }}</span>
        </div>
        <div class="detail-item">
          <span class="item-label">门店信息：</span>
          <span class="item-value">{{ order.shopDO?.storeName }}</span>
        </div>
        <div class="detail-item">
          <span class="item-label">下单时间：</span>
          <span class="item-value">{{ formatDate(order.createTime) }}</span>
        </div>
        <div class="detail-item">
          <span class="item-label">支付方式：</span>
          <span class="item-value">{{ getPayTypeText(order.payType) }}</span>
        </div>
        <div class="detail-item">
          <span class="item-label">订单状态：</span>
          <span class="item-value">{{ getOrderStatusText(order.status) }}</span>
        </div>
        <div class="detail-item">
          <span class="item-label">取餐方式：</span>
          <span class="item-value">{{ getShippingTypeText(order.shippingType) }}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <div class="section-title">用户信息</div>
        <div class="detail-item">
          <span class="item-label">用户名：</span>
          <span class="item-value">{{ order.userRespVO?.nickname || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="item-label">联系电话：</span>
          <span class="item-value">{{ order.userRespVO?.mobile || '-' }}</span>
        </div>
        <div v-if="order.shippingType === 2" class="detail-item">
          <span class="item-label">配送地址：</span>
          <span class="item-value">{{ order.userAddress || '-' }}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <div class="section-title">商品信息</div>
        <div class="product-list">
          <div v-for="(item, index) in orderItems" :key="index" class="product-item">
            <img :src="item.productInfo?.image" alt="商品图片" class="product-image" />
            <div class="product-info">
              <div class="product-name">{{ item.productInfo?.storeName }}</div>
              <div class="product-spec">{{ item.productInfo?.attrInfo?.sku }}</div>
            </div>
            <div class="product-price">¥{{ item.truePrice }}</div>
            <div class="product-quantity">×{{ item.cartNum }}</div>
          </div>
        </div>
        
        <div class="order-summary">
          <div class="summary-item">
            <span>商品总价：</span>
            <span>¥{{ order.totalPrice }}</span>
          </div>
          <div class="summary-item">
            <span>优惠金额：</span>
            <span>¥{{ order.discountAmount || 0 }}</span>
          </div>
          <div v-if="order.shippingType === 2" class="summary-item">
            <span>配送费：</span>
            <span>¥{{ order.deliveryFee || 0 }}</span>
          </div>
          <div class="summary-item">
            <span>实付金额：</span>
            <span class="total-paid">¥{{ order.payPrice }}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <div class="section-title">备注</div>
        <div class="order-remark-container">
          <el-input
            v-if="isEditingRemark"
            v-model="editingRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入订单备注"
          />
          <div v-else class="order-remark">
            {{ order.mark || '无' }}
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button 
          v-if="order && order.status === 0" 
          type="primary" 
          @click="handleAccept"
        >
          接单
        </el-button>
        <el-button 
          v-if="order && order.status === 1" 
          type="success" 
          @click="handleComplete"
        >
          完成订单
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['close', 'accept', 'complete', 'update-remark']);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close');
    }
  }
});


const orderItems = computed(() => {
  const result = props?.order.storeOrderCartInfoDOList.map(item => JSON.parse(item.cartInfo));
  return result;
});

// 备注编辑状态
const isEditingRemark = ref(false);
const editingRemark = ref('');

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getOrderStatusText = (status) => {
  const statusMap = {
    9: '待接单',
    10: '制作中',
    11: '待核销',
    12: '已取消',
    13: '已拒绝',
    20: '派单中',
    30: '待取货'
  };
  return statusMap[status] || '未知状态';
};

const getPayTypeText = (type) => {
  const typeMap = {
    weixin_micropay: '微信',
    ali_micropay: '支付宝',
    yue: '余额',
    now_money: '现金',
  };
  return typeMap[type] || '未知方式';
};

const getShippingTypeText = (type) => {
  const typeMap = {
    1: '自提',
    2: '外送',
    3: '堂食',
  };
  return typeMap[type] || '未知方式';
};

// Event handlers
const handleClose = () => {
  emit('close');
};

const handleAccept = () => {
  if (props.order) {
    emit('accept', props.order.id);
  }
};

const handleComplete = () => {
  if (props.order) {
    emit('complete', props.order.id);
  }
};

</script>

<style scoped>
.order-detail {
  padding: 0 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
}

.item-label {
  width: 100px;
  color: #909399;
}

.item-value {
  flex: 1;
  color: #303133;
}

.product-list {
  margin-bottom: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #ebeef5;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 12px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.product-spec {
  font-size: 12px;
  color: #909399;
}

.product-price {
  color: #E6A23C;
  margin-right: 12px;
}

.order-summary {
  margin-top: 16px;
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.total-paid {
  font-weight: bold;
  color: #F56C6C;
}

.order-remark-container {
  position: relative;
}

.order-remark {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  min-height: 60px;
}

.remark-actions {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 8px;
}
</style> 