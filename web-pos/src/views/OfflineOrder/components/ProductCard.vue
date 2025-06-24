<template>
  <div class="product-card flex flex-col items-center justify-center" @click="openSpecDialog">
    <div class="product-image">
      <img class="product-image-img" :src="product.image || product.picUrl" :alt="product.storeName" />
    </div>
    <div class="product-info flex flex-col items-center justify-center">
      <h3 class="product-name">{{ product.storeName }}</h3>
      <div class="product-price">¥ {{ product.price }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click-product'])

const openSpecDialog = () => {
  // 创建一个新对象，确保包含所有需要的属性
  const productData = {
    ...props.product,
    image: props.product.image || props.product.picUrl,
    name: props.product.storeName
  }
  
  emit('click-product', productData)
}
</script>

<style scoped>
.product-card {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #DFE2E6;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image img {
  object-fit: cover;
  height: 138px;
  width: 138px;
}


.product-name {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: normal;
}

.product-price {
  color: var(--el-color-primary);
  font-weight: bold;
}
</style> 