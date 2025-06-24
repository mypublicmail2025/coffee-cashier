<template>
  <el-dialog
    v-model="dialogVisible"
    title="现金结算"
    width="600px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="cash-payment-container">
      <!-- 金额显示区域 -->
      <div class="amount-display-row">
        <div class="amount-item ">
          <div class="amount-label">应收</div>
          <div class="amount-value">¥{{ formatAmount(totalAmount) }}</div>
        </div>
        <div class="amount-item">
          <div class="amount-label">实收</div>
          <div class="amount-value">¥{{ formatAmount(receivedAmount) }}</div>
        </div>
        <div class="amount-item">
          <div class="amount-label">找零</div>
          <div class="amount-value">¥{{ formatAmount(changeAmount) }}</div>
        </div>
      </div>

      <!-- 键盘区域 -->
      <div class="keypad-container">
        <!-- 数字键盘和快捷金额 -->
        <div class="keypad-grid">
          <!-- 数字键 -->
          <div class="keypad-section numbers">
            <div class="keypad-row">
              <button class="keypad-btn" @click="appendNumber('7')">7</button>
              <button class="keypad-btn" @click="appendNumber('8')">8</button>
              <button class="keypad-btn" @click="appendNumber('9')">9</button>
            </div>
            <div class="keypad-row">
              <button class="keypad-btn" @click="appendNumber('4')">4</button>
              <button class="keypad-btn" @click="appendNumber('5')">5</button>
              <button class="keypad-btn" @click="appendNumber('6')">6</button>
            </div>
            <div class="keypad-row">
              <button class="keypad-btn" @click="appendNumber('1')">1</button>
              <button class="keypad-btn" @click="appendNumber('2')">2</button>
              <button class="keypad-btn" @click="appendNumber('3')">3</button>
            </div>
            <div class="keypad-row">
              <button class="keypad-btn zero-btn" @click="appendNumber('0')">0</button>
              <button class="keypad-btn" @click="appendDecimal">.</button>
            </div>
          </div>

          <!-- 快捷金额和功能键 -->
          <div class="keypad-section actions">
            <div class="keypad-row">
              <button class="keypad-btn amount-btn" @click="setAmount(100)">¥100</button>
              <button class="keypad-btn clear-btn" @click="clearAmount">清空</button>
            </div>
            <div class="keypad-row">
              <button class="keypad-btn amount-btn" @click="setAmount(50)">¥50</button>
              <button class="keypad-btn delete-btn" @click="deleteLastDigit">删除</button>
            </div>
            <div class="keypad-row">
              <div class="flex flex-col flex-1">
                <button class="keypad-btn amount-btn" @click="setAmount(20)">¥20</button>
                 <button class="mt-10px keypad-btn  amount-btn" @click="setAmount(10)">¥10</button>
              </div>
              <button 
                class="keypad-btn flex-1 confirm-btn" 
                :disabled="!canConfirm"
                @click="confirmPayment"
              >
                结账
              </button>
            </div>
            <div class="keypad-row">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  totalOrderAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close', 'confirm']);

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close');
    }
  }
});

// 实收金额（用户输入的金额）
const receivedAmount = ref('');
// 输入的数字字符串
const inputValue = ref('');

// 找零金额
const changeAmount = computed(() => {
  const received = parseFloat(receivedAmount.value) || 0;
  const change = received - props.totalAmount;
  return change > 0 ? change : 0;
});

// 是否可以确认支付
const canConfirm = computed(() => {
  const received = parseFloat(receivedAmount.value) || 0;
  return received >= props.totalAmount;
});

// 格式化金额显示
const formatAmount = (value) => {
  if (!value && value !== 0) return '';
  return parseFloat(value).toFixed(2);
};

// 添加数字
const appendNumber = (number) => {
  inputValue.value += number;
  updateReceivedAmount();
};

// 添加小数点
const appendDecimal = () => {
  // 如果已经有小数点，则不添加
  if (inputValue.value.includes('.')) return;
  // 如果是空字符串，则先添加0
  if (inputValue.value === '') {
    inputValue.value = '0';
  }
  inputValue.value += '.';
  updateReceivedAmount();
};

// 更新实收金额
const updateReceivedAmount = () => {
  receivedAmount.value = inputValue.value;
};

// 设置快捷金额
const setAmount = (amount) => {
  inputValue.value = amount.toString();
  updateReceivedAmount();
};

// 清空金额
const clearAmount = () => {
  inputValue.value = '';
  updateReceivedAmount();
};

// 删除最后一位
const deleteLastDigit = () => {
  inputValue.value = inputValue.value.slice(0, -1);
  updateReceivedAmount();
};

// 确认支付
const confirmPayment = () => {
  if (!canConfirm.value) return;
  
  emit('confirm', {
    totalAmount: props.totalAmount,
    paidAmount: parseFloat(receivedAmount.value),
    changeAmount: changeAmount.value
  });
  
  // 关闭对话框
  dialogVisible.value = false;
  // 重置输入
  resetForm();
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  inputValue.value = '';
  receivedAmount.value = '';
};

// 当对话框打开时，重置表单
watch(() => props.visible, (newValue) => {
  if (newValue) {
    resetForm();
  }
});
</script>

<style scoped>
.cash-payment-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.amount-display-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 10px;
}

.amount-item {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.amount-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #F74829;
}

.keypad-container {
  display: flex;
  flex-direction: column;
}

.keypad-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 10px;
}

.keypad-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keypad-row {
  display: flex;
  gap: 10px;
}

.keypad-btn {
  flex: 1;
  height: 50px;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  border-radius: 4px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.keypad-btn:hover {
  background-color: #f5f7fa;
}

.keypad-btn:active {
  background-color: #e6e6e6;
}

.zero-btn {
  flex: 2;
}

.amount-btn {
  color: #17b393;
  border-color: #17b393;
  background-color: rgba(23, 179, 147, 0.05);
}

.amount-btn:hover {
  background-color: rgba(23, 179, 147, 0.1);
}

.clear-btn {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  background-color: rgba(64, 158, 255, 0.05);
}

.delete-btn {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  background-color: rgba(245, 108, 108, 0.05);
}

.delete-btn:hover {
  background-color: rgba(245, 108, 108, 0.1);
}

.confirm-btn {
  color: #ffffff;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  height: 110px;
  grid-row: span 2;
}

.confirm-btn:hover {
  background-color: #15a085;
}

.confirm-btn:disabled {
  background-color: #c0c4cc;
  border-color: #c0c4cc;
  cursor: not-allowed;
}

</style> 