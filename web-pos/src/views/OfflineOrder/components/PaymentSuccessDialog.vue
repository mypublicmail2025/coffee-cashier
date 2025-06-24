<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    :show-close="false"
    custom-class="payment-success-dialog"
  >
    <div class="success-content">
      <div class="success-icon">
        <el-icon class="icon"><Check /></el-icon>
      </div>
      <div class="success-text">{{ orderStatusText }}</div>
      
      <el-button type="primary" class="print-button" @click="printReceipt">
        打印小票
      </el-button>
      
      <div class="close-text" @click="closeDialog">关闭</div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { Check } from '@element-plus/icons-vue';
import { getOrderDetail } from '@/api/mall/order/onlineOrder';
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentPayOrder: {
    type: Object,
    default: () => {}
  }
});
const orderDetail=ref({})
const emit = defineEmits(['close', 'print-receipt','clear-cart']);
const interval = ref(null)
const orderStatusText=computed(()=>{
  let text='正在同步订单状态...';
  if(orderDetail?.value?.status===10){
    text='支付成功'
  }else if(orderDetail?.value?.status===1){
    text='支付失败'
  }
  return text
})
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close');
    }
  }
});

const printReceipt = () => {
  emit('print-receipt');
};
const  getOrderInfo = () => {
  getOrderDetail(props.currentPayOrder?.id).then(res=>{
    //如果订单状态为10，则显示完成
    orderDetail.value=res
    if (res.status === 10){
      emit('clear-cart')
      if (interval.value) {
        clearInterval(interval.value)
      }
    }
  })
}
watch(dialogVisible, (val) => {
  if (val) {
   interval.value= setInterval(()=>{
      getOrderInfo()
    },1000)
  }else{
    orderDetail.value={}
    if(interval.value){
      clearInterval(interval.value)
    }
    
  }
});

const closeDialog = () => {
  emit('close');
};
</script>

<style lang="scss">
.payment-success-dialog {
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

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #17b393;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  .icon {
    color: white;
    font-size: 30px;
  }
}

.success-text {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 25px;
}

.print-button {
  width: 180px;
  height: 40px;
  margin-bottom: 15px;
  background-color: #17b393;
  border-color: #17b393;
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