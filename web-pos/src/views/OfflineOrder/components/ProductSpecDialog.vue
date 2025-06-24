<template>
  <el-dialog
v-model="dialogVisible"  width="700px"
    :close-on-click-modal="false" class="product-spec-dialog">
    <div class="product-detail-container" v-loading="loading">
      <!-- 商品基本信息 -->
      <div class="product-basic-info">
        <div class="product-image">
          <el-image
:src="productDetail?.storeInfo?.image" fit="cover"
            :preview-src-list="productDetail?.storeInfo?.sliderImage ? productDetail.storeInfo.sliderImage.split(',') : []" />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ productDetail?.storeInfo?.storeName }}</h3>
          <p class="product-description">{{ productDetail?.storeInfo?.storeInfo }}</p>
          <div class="product-price">
            <span class="current-price">¥{{ selectedSku ? selectedSku.price : productDetail?.storeInfo?.price }}</span>
            <span class="original-price" v-if="productDetail?.storeInfo?.otPrice > 0">¥{{
              productDetail?.storeInfo?.otPrice }}</span>
          </div>
          <div class="product-stock">
            库存: {{ selectedSku ? selectedSku.stock : productDetail?.storeInfo?.stock }} 件
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-selection ">
          <div class="mr-4">数量</div>
          <quantity-control
v-model="quantity" :min="1"
            :max="selectedSku ? selectedSku.stock : productDetail?.storeInfo?.stock" @increase="handleIncrease"
            @decrease="handleDecrease" />
        </div>
      </div>

      <!-- 规格选择 -->
      <div class="spec-selection" v-if="productAttributes.length > 0">
        <div v-for="attr in productAttributes" :key="attr.id" class="spec-group">
          <div class="spec-name">{{ attr.attrName }}</div>
          <div class="spec-values">
            <el-radio-group v-model="selectedAttrs[attr.attrName]" @change="updateSelectedSku">
              <el-radio-button
              class="mr-4 spec-button"
v-for="(value, index) in attr.attrValue" :key="index" :label="value.attr"
                :disabled="!isSkuAvailable(attr.attrName, value.attr)">
                {{ value.attr }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>



      <!-- 推荐商品 -->
      <div class="recommended-products" v-if="recommendedProducts.length > 0">
        <h4>推荐搭配</h4>
        <div class="recommended-list">
          <div v-for="(item, index) in recommendedProducts" :key="index" class="recommended-item">
            <el-checkbox v-model="item.selected" />
            <el-image :src="item.image" fit="cover" class="recommended-image" />
            <div class="recommended-info">
              <div class="recommended-name">{{ item.storeName }}</div>
              <div class="recommended-price">¥{{ item.price }}</div>
            </div>
            <quantity-control
v-model="item.quantity" :min="0" :max="item.stock" :disabled="!item.selected"
              @increase="() => handleRecommendedIncrease(index)" @decrease="() => handleRecommendedDecrease(index)" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="!canConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getStoreProduct } from '@/api/mall/product/product'
import QuantityControl from '../components/QuantityControl.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'confirm'])

// 状态变量
const loading = ref(false)
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close')
    }
  }
})
const productDetail = ref(null)
const quantity = ref(1)
const selectedAttrs = reactive({})
const recommendedProducts = ref([])

// 计算属性
const productAttributes = computed(() => {
  return productDetail.value?.productAttr || []
})

const productValues = computed(() => {
  return productDetail.value?.productValue || {}
})

const selectedSku = computed(() => {
  if (!productAttributes.value.length || Object.keys(selectedAttrs).length === 0) {
    return null
  }

  // 将选中的属性组合成SKU字符串
  const skuKey = Object.values(selectedAttrs).join(',')
  
  // 从可用SKU中查找匹配项
  return productValues.value[skuKey] || null
})

const canConfirm = computed(() => {
  // 检查是否所有必选属性都已选择
  const allAttrsSelected = productAttributes.value.length === 0 || 
    productAttributes.value.every(attr => selectedAttrs[attr.attrName])
  
  // 检查库存是否充足
  const hasStock = selectedSku.value ? selectedSku.value.stock >= quantity.value : 
    (productDetail.value?.storeInfo?.stock >= quantity.value)
  
  return allAttrsSelected && hasStock
})

// 方法
const fetchProductDetail = async () => {
  if (!props.product || !props.product.id) {
    return
  }
  
  loading.value = true
  try {
    const response = await getStoreProduct(props.product.id)
    
    if (response && response) {
      productDetail.value = response
      
      // 初始化选中的规格
      initializeSelectedAttrs()
      
      // 获取推荐商品（这里假设API可能会返回goodList作为推荐商品）
      if (response.goodList && Array.isArray(response.goodList)) {
        recommendedProducts.value = response.goodList.map(item => ({
          ...item,
          selected: false,
          quantity: 1
        }))
      } else {
        recommendedProducts.value = []
      }
    } else {
      ElMessage.error('获取商品详情失败')
    }
  } catch (error) {
    console.error('获取商品详情出错:', error)
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

const initializeSelectedAttrs = () => {
  // 清空之前的选择
  Object.keys(selectedAttrs).forEach(key => delete selectedAttrs[key])
  
  // 为每个属性选择默认值（通常是第一个可用的值）
  productAttributes.value.forEach(attr => {
    // 查找默认值，优先选择带有"默认"或"推荐"字样的选项
    const defaultValue = attr.attrValue.find(val => 
      val.attr.includes('默认') || val.attr.includes('推荐')
    )
    
    if (defaultValue) {
      selectedAttrs[attr.attrName] = defaultValue.attr
    } else if (attr.attrValue.length > 0) {
      // 如果没有默认值，选择第一个
      const firstAvailable = attr.attrValue.find(val => isSkuAvailable(attr.attrName, val.attr))
      if (firstAvailable) {
        selectedAttrs[attr.attrName] = firstAvailable.attr
      }
    }
  })
  
  // 更新SKU
  updateSelectedSku()
}

const isSkuAvailable = (attrName, attrValue) => {
  // 检查给定的属性值组合是否有对应的SKU
  if (!productAttributes.value.length || !productValues.value) {
    return true
  }
  
  // 创建当前选择的属性副本
  const tempSelectedAttrs = { ...selectedAttrs }
  tempSelectedAttrs[attrName] = attrValue
  
  // 检查是否所有必选属性都已选择
  const allAttrsSelected = productAttributes.value.every(attr => tempSelectedAttrs[attr.attrName])
  
  if (!allAttrsSelected) {
    // 如果不是所有属性都选择了，那么还不能判断是否有可用SKU
    return true
  }
  
  // 组合成SKU字符串
  const skuKey = Object.values(tempSelectedAttrs).join(',')
  
  // 检查是否有匹配的SKU且库存充足
  const sku = productValues.value[skuKey]
  return sku && sku.stock > 0
}

const updateSelectedSku = () => {
  // 更新SKU后重置数量为1
  quantity.value = 1
}


// 添加明确的增加/减少处理函数
const handleIncrease = (newValue) => {
  // 这里可以添加增加数量时的特定逻辑
  if (selectedSku.value) {
    if (selectedSku.value.stock < newValue) {
      ElMessage.error('库存不足')
      return
    }
    quantity.value = newValue

  }
}

const handleDecrease = (newValue) => {
  console.log('Product quantity decreased to:', newValue)
  // 这里可以添加减少数量时的特定逻辑
  if (selectedSku.value) {
    if (selectedSku.value.stock < newValue) {
      ElMessage.error('库存不足')
      return
    }
    quantity.value = newValue
  }
  
}

const handleRecommendedIncrease = (index) => {
  console.log(`Recommended product ${index} quantity increased to:`, recommendedProducts.value[index].quantity)
  // 自动选中商品
  if (!recommendedProducts.value[index].selected) {
    recommendedProducts.value[index].selected = true
  }
}

const handleRecommendedDecrease = (index) => {
  console.log(`Recommended product ${index} quantity decreased to:`, recommendedProducts.value[index].quantity)
  
  // 如果数量为0，取消选中
  if (recommendedProducts.value[index].quantity === 0) {
    recommendedProducts.value[index].selected = false
  }
}

// const handleRecommendedQuantityChange = (index) => {
//   // 如果数量为0，取消选中
//   if (recommendedProducts.value[index].quantity === 0) {
//     recommendedProducts.value[index].selected = false
//   }
//   // 如果选中但数量为0，设置为1
//   else if (recommendedProducts.value[index].selected && recommendedProducts.value[index].quantity === 0) {
//     recommendedProducts.value[index].quantity = 1
//   }
// }

const handleCancel = () => {
  dialogVisible.value = false
}

const handleConfirm = () => {
  if (!canConfirm.value) {
    return
  }
  
  // 准备主商品数据
  const mainProduct = {
    id: props.product.id,
    image: productDetail.value.storeInfo.image,
    storeName: productDetail.value.storeInfo.storeName,
    price: selectedSku.value ? selectedSku.value.price : productDetail.value.storeInfo.price,
    quantity: quantity.value,
    spec: Object.values(selectedAttrs).join(',') || '默认规格',
    skuId: selectedSku.value ? selectedSku.value.id : null,
    skuUnique: selectedSku.value ? selectedSku.value.unique : null,
    stock: selectedSku.value ? selectedSku.value.stock : productDetail.value.storeInfo.stock
  }
  
  // 准备推荐商品数据
  const selectedRecommendedProducts = recommendedProducts.value
    .filter(item => item.selected && item.quantity > 0)
    .map(item => ({
      id: item.id,
      image: item.image,
      storeName: item.storeName,
      price: item.price,
      quantity: item.quantity,
      spec: '默认规格',
      stock: item.stock
    }))
  
  // 提交数据
  emit('confirm', {
    mainProduct,
    recommendedProducts: selectedRecommendedProducts
  })
  
  // 关闭对话框
  dialogVisible.value = false
}

// 监听
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 对话框打开时获取商品详情
    fetchProductDetail()
  }
})

watch(() => props.product, (newVal) => {
  if (newVal && props.visible) {
    // 商品变化时重新获取详情
    fetchProductDetail()
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  if (props.visible) {
    fetchProductDetail()
  }
})
</script>

<style lang="scss" scoped>
.product-detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-basic-info {
  display: flex;
  gap: 20px;
}

.product-image {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
}
.spec-button{
  :deep(.el-radio-button__inner){
    border: none !important;
    line-height:normal;
    background: #F7F7F7;
    border-radius: 4px;
  }
  :deep(.el-radio-button__original-radio:checked+.el-radio-button__inner) {
    background: var(--el-color-primary);
    color: #fff;
  }
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.product-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-size: 20px;
  color: #ff6b6b;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-stock {
  font-size: 14px;
  color: #666;
}

.spec-selection {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.spec-group {
  margin-bottom: 16px;
}

.spec-name {
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quantity-selection {
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.recommended-products {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.recommended-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.recommended-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recommended-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.recommended-info {
  flex: 1;
}

.recommended-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.recommended-price {
  font-size: 14px;
  color: #ff6b6b;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
}
</style>