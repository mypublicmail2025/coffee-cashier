<template>
  <div class="tool-select-product">
    <div class="title">
      <span>商品来源</span>
      <div class="source-select">
        <el-radio v-model="productData.sourceType" label="1">商品</el-radio>
        <el-radio v-model="productData.sourceType" label="2">类别</el-radio>
      </div>
    </div>
    <div class="porListBox">
      <product-source-multiple
        v-if="productData.sourceType == '1'"
        v-model:productData="productData"
        :type="type"
      />
      <product-source-category
        v-if="productData.sourceType == '2'"
        v-model:productData="productData"
        :type="type"
      />
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import ProductSourceCategory from './product-source-category.vue';
import ProductSourceMultiple from './product-source-multiple.vue';
const props = defineProps({
  productData: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    default: '',
  },
});
const { productData, type } = toRefs(props);
</script>

<style lang="scss" scoped>
.tool-select-product {
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
