<template>
  <div class="product-source-category">
    <div class="porListBox">
      <div class="addProduct">
        <div
          v-if="!productData.categoryName"
          class="addProBtn addImgBtn"
          @click="addProductCls"
        >
          <span class="iconfont">&#xe685;</span>添加类别
        </div>
        <div v-else class="categoryName">
          <span>{{ productData.categoryName }}</span>
          <div class="operation">
            <span class="iconfont" @click="replaceCategory">&#xe66c;</span>
            <span class="iconfont" @click="deleteCategory">&#xe633;</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogCategory" title="选择类别" width="600px">
      <el-cascader
        ref="cascader"
        style="width: 100%"
        :options="categoryList"
        :props="{
          checkStrictly: true,
          label: 'name',
          value: 'id',
          children: 'children',
        }"
        clearable
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCategory = false">取 消</el-button>
          <el-button type="primary" @click="addCategoryData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import api from '@/components/canvas/components/canvasShow/config/api';
// import { checkEmptyChild } from '@/components/canvas/config/common';
import { sendReqMixin } from '@/components/canvas/components/canvasShow/config/mixin';
import { canvasStore } from '@/components/canvas/store/canvas';
const canvasStoreObj = canvasStore();
const { setProductNum, setNewProductNum } = canvasStoreObj;
const { sendReq } = sendReqMixin();
const categoryList = ref([]);
const dialogCategory = ref(false);
const cascader = ref();
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

// 获取类别
function getCategory () {
  const params = {
    url: api.getClassify,
    method: 'GET',
  };
  sendReq(params, (res) => {
    categoryList.value = res.data;
    dialogCategory.value = true;
  });
}
// 添加类别
function addProductCls () {
  getCategory();
}
// 替换类别
function replaceCategory () {
  getCategory();
}
// 删除已选类别
function deleteCategory () {
  productData.value.categoryName = '';
  productData.value.categoryId = '';
  viewRefresh();
}
// 添加类别
function addCategoryData () {
  const nodesObj = cascader.value.getCheckedNodes();
  if (nodesObj) {
    var categoryId = nodesObj[0].value;
    var categoryName = nodesObj[0].label;
    productData.value.categoryId = categoryId;
    productData.value.categoryName = categoryName;
    dialogCategory.value = false;
    viewRefresh();
  }
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
      .categoryName {
        height: 35px;
        display: flex;
        align-items: center;
        background: #e9e9e9;
        border-radius: 4px;
        padding: 0 10px;
        justify-content: space-between;
        span {
          color: #333333;
        }
        span {
          color: #333333;
        }
        .operation {
          display: flex;
          span {
            width: 35px;
            display: block;
            height: 35px;
            line-height: 35px;
            text-align: center;
            cursor: pointer;
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
