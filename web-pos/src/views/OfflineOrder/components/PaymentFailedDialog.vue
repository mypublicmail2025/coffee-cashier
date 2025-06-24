<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    :show-close="false"
    custom-class="payment-failed-dialog"
  >
    <div class="failed-content">
      <div class="failed-icon">
        <el-icon class="icon"><Close /></el-icon>
      </div>
      <div class="failed-text">支付失败</div>
      
      <el-button type="primary" class="retry-button" @click="retryPayment">
        重新支付
      </el-button>
      
      <div class="close-text" @click="closeDialog">关闭</div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { Close } from '@element-plus/icons-vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'retry-payment']);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close');
    }
  }
});

const retryPayment = () => {
  emit('retry-payment');
};

const closeDialog = () => {
  emit('close');
};
</script>

<style lang="scss">
.payment-failed-dialog {
  .el-dialog__header {
    display: none;
  }
  
  .el-dialog__body {
    padding: 30px 20px !important;
    margin: 0;
  }
  
  .el-dialog__footer {
    display: none;
  }
}

.failed-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.failed-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f56c6c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  .icon {
    color: white;
    font-size: 30px;
  }
}

.failed-text {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 25px;
}

.retry-button {
  width: 180px;
  height: 40px;
  margin-bottom: 15px;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.close-text {
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  
  &:hover {
    color: #606266;
  }
}
</style> 