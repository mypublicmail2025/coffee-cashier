<template>
  <div class="quantity-control">
    <el-button 
      size="small" 
      circle 
      @click="handleDecrease" 
      class="theme-button"
      :disabled="modelValue <= min || disabled "
    >-</el-button>
    <span class="quantity">{{ modelValue }}</span>
    <el-button 
      size="small" 
      circle 
      @click="handleIncrease" 
      class="theme-button"
      :disabled="modelValue >= max || disabled "
    >+</el-button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 99999
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([ 'change', 'increase', 'decrease']);

// Debounce state flag
const isProcessing = ref(false);

// Core logic for increasing quantity
const increase = () => {
  if (props.modelValue < props.max) {
    const newValue = props.modelValue + props.step;
    emit('increase', newValue);
  }
};

// Core logic for decreasing quantity
const decrease = () => {
  if (props.modelValue > props.min) {
    const newValue = props.modelValue - props.step;
    emit('decrease', newValue);
  }
};

// Handler with debounce for increase button
const handleIncrease = () => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  increase();
  
  setTimeout(() => {
    isProcessing.value = false;
  }, 100);
};

// Handler with debounce for decrease button
const handleDecrease = () => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  decrease();
  setTimeout(() => {
    isProcessing.value = false;
  }, 100);
};
</script>

<style scoped>
.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
}

.theme-button {
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: var(--el-color-primary);
}

/* Add compatibility with dark mode if needed */
.theme-button:hover {
    background-color: var(--el-color-primary);
}/* Add compatibility with dark mode if needed */

.theme-button:disabled {
    background-color: var(--el-color-primary-disabled);
    color: var(--el-color-primary-disabled);
}

:deep(.el-button.is-circle) {
  min-height: 28px;
  min-width: 28px;
}
</style> 