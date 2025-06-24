<template>
  <div class="product-source-category">
    <div class="porListBox">
      <div class="addProduct">
        <div
          v-if="productData.imgTextData && productData.imgTextData.length > 0"
          class="productList"
        >
          <ul @click="addProduct">
            <li v-for="(item, index) in productData.imgTextData" :key="index">
              <el-image
                style="width: 50px; height: 50px"
                :src="item.image"
                fit="contain"
              />
            </li>
          </ul>
        </div>
        <div v-else class="addProBtn addImgBtn" @click="addProduct">
          <span class="iconfont">&#xe685;</span>添加商品
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogProduct" title="选择产品">
      <product-select
        ref="productSelectRef"
        :selected-rows="productData.imgTextData"
        :is-multiple="true"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogProduct = false">取 消</el-button>
          <el-button type="primary" @click="addProductData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import productSelect from './product-select.vue';
import { canvasStore } from '@/components/canvas/store/canvas';
const canvasStoreObj = canvasStore();
const { setProductNum, setNewProductNum } = canvasStoreObj;
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
const dialogProduct = ref(false);
const productSelectRef = ref();

// 添加产品
function addProduct () {
  dialogProduct.value = true;
}
// 确定选择
function addProductData () {
  productData.value.imgTextData = productSelectRef.value.multipleSelection;
  productData.value.productIdList = [];
  const imgTextData = productData.value.imgTextData;
  imgTextData.forEach((item) => {
    productData.value.productIdList.push(item.id);
  });
  dialogProduct.value = false;
  viewRefresh();
}
// 通知画布刷新
function viewRefresh () {
  if (type.value === 'newProduct') {
    setNewProductNum();
  } else {
    setProductNum();
  }
}
</script>

<style lang="scss" scoped>
.product-source-category {
  .porListBox {
    padding: 10px;
    background: #f0f3f4;
    .addProduct {
      .productList {
        ul {
          display: flex;
          cursor: pointer;
          flex-wrap: wrap;
          li {
            display: block;
            height: 50px;
            margin: 0 2px 5px 0;
            position: relative;
          }
        }
      }
      .addImgBtn {
        border-radius: 4px;
        background: var(--el-color-primary);
        text-align: center;
        height: 36px;
        color: #ffffff;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        span {
          font-size: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
