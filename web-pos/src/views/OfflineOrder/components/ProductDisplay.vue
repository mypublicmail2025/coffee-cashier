<template>
  <div class="product-display-container">
    <!-- 搜索栏 -->
    <div class="search-bar flex flex-row justify-between">
      <el-input 
        class="flex-1" 
        v-model="keyword" 
        placeholder="查询商品" 
        clearable 
        @input="handleSearch"
        @clear="handleClear" 
      />
      <el-button class="justify-end" type="primary" @click="handleSearch">查询商品</el-button>
     
    </div>

    <!-- 产品类型标签栏 -->
    <div  class="product-tabs">
      <div
        v-for="(tab, index) in productTabs" 
        :key="index" 
        :class="['tab-item', {active: activeTabIndex === index}]"
        @click="switchTab(index)"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- 产品分类标签 -->
    <div v-if="categories.length > 0" class="category-tabs">
      <div
        v-for="(category, index) in categories" 
        :key="index"
        :class="['category-item', {active: activeCategoryIndex === index}]" 
        @click="switchCategory(index)"
      >
        {{ category.name }}
      </div>
    </div>

    <!-- 产品展示区 -->
    <div v-if="products.length > 0" class="product-display" >
      <product-card
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        @click-product="handleProductClick" 
      />
    </div>
    <div v-else class="flex flex-1 flex-row justify-center items-center">
      <el-empty description="暂无商品" />
    </div>
  </div>
</template>

<script setup>
import { ref,  watch } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  searchKeyword: {
    type: String,
    default: ''
  },
  products: {
    type: Array,
    default: () => []
  },
  productTabs: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  activeTabIndex: {
    type: Number,
    default: 0
  },
  activeCategoryIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'search', 
  'clear', 
  'switch-tab', 
  'switch-category',
  'click-product',
  'open-scanner'
])

// 使用从父组件传入的 searchKeyword 初始化本地关键字
const keyword = ref(props.searchKeyword)

// 监听 searchKeyword 的变化，同步到本地 keyword
watch(() => props.searchKeyword, (newValue) => {
  keyword.value = newValue
})

const handleSearch = () => {
  emit('search', keyword.value)
}

const handleClear = () => {
  keyword.value = ''
  emit('clear')
}

const switchTab = (index) => {
  emit('switch-tab', index)
}

const switchCategory = (index) => {
  emit('switch-category', index)
}

const handleProductClick = (product) => {
  emit('click-product', product)
}

</script>

<style scoped>
.product-display-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: white;
  height: 100%;
}

.search-bar {
  display: flex;
  gap: 4px;
  padding: 0 16px;
  margin-bottom: 8px;
}

.product-tabs {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

.tab-item {
  padding: 4px 8px;
  white-space: nowrap;
  margin-right: 4px;
  cursor: pointer;
}

.tab-item.active {
  color: var(--el-color-primary);
  border-bottom: 2px solid var(--el-color-primary);
}

.category-tabs {
  display: flex;
  overflow-x: auto;
  padding: 4px 4px;
  gap: 4px;
  margin-top: 8px;
  border-radius: 4px;
  background-color: #f5f7fa;
  margin: 8px 16px 0  16px;

}

.category-item {
  padding: 4px 8px;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.category-item.active {
  background-color: white;
  color: var(--el-color-primary);
}

.product-display {
  flex: 1;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(190px, 1fr));
  gap: 10px;
  overflow-y: auto;
}
</style> 