<template>
  <!--    选择商品列表-->
  <el-dialog
    v-model="groupVisible"
    :title="visitDetail ? '查看商品' : '选择商品'"
    width="70%"
    top="50px"
    class="group-dialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
  >
    <!-- 表格 -->
    <div class="tableBox">
      <el-table
        ref="multipleTableRef"
        :data="productList"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
        max-height="600"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="!visitDetail && type!==1"
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column v-if="!visitDetail && type===1" label="" width="40" align="center">
          <template #default="scope">
            <el-radio v-model="tableRadio" :label="scope.row" ><span/></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="产品主图" width="220" align="center">
          <template #default="scope">
            <img height="80" width="80" :src="scope.row.image" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="产品名称">
          <template #default="scope">
            <div class="store-name">{{scope.row.storeName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="产品id"
          show-overflow-tooltip
        />
        <el-table-column
          prop="price"
          label="原价（元）"
          show-overflow-tooltip
        />
        <el-table-column
          prop="stock"
          label="库存（件）"
          show-overflow-tooltip
        />
      </el-table>
      <div class="fenye">
        <el-pagination
          :current-page="queryParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="productTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <template #footer>
      <div class="footBtnBox">
          <span class="dialog-footer">
            <el-button
              v-if="!visitDetail"
              type="primary"
              @click="saveIdList"
            >确 定</el-button>
            <el-button @click="closeSelect">取 消</el-button>
          </span>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import * as StoreActivityApi from '@/api/marketing'
import {ActivityProduct} from "@/types/activity";
import { ref } from "vue";

const groupVisible = ref<boolean>(false)
const visitDetail = ref<boolean>(false)
const idList = ref<number[]>([])
const loading = ref<boolean>(false)

// 选择商品
const productList = ref<ActivityProduct[]>([])
const multipleSelection = ref<ActivityProduct[]>([])
const productTotal = ref<number>(0)
const multipleTableRef = ref()
const tableRadio = ref({});

const props = defineProps({
  // 默认为0多选， 传递1单选
  type: {
    type: Number,
    default: 0
  }
})

const type = ref(props.type)

 const queryParams = reactive({
   pageNo: 1,
   pageSize: 10,
   storeName: '',
   specType: null
 })

const handleSelectionChange = (val: ActivityProduct[]): void => {
  multipleSelection.value = val;
}
const handleSizeChange = (val: number): void => {
  queryParams.pageSize = val;
  getProductList(); // 这里没有改变
}
const handleCurrentChange = (val: number): void => {
  queryParams.pageNo = val;
  getProductList(); // 这里没有改变
}

 /** 查询列表 */
const getProductList = async (): Promise<void> => {
  loading.value = true
  try {
    let listData;
    if (visitDetail.value) {
      listData = await StoreActivityApi.getActivityProductList(queryParams)
    } else {
      listData = await StoreActivityApi.getActivityProductList(queryParams)
      // 点击编辑时回显表格勾选
      if(type.value ===1){
        listData.list.forEach((product) => {
          if (idList.value.includes(product.id)) {
            tableRadio.value = product
          }
        })
      } else{
        listData.list.forEach((product) => {
          if (idList.value.includes(product.id)) {
            multipleTableRef.value.toggleRowSelection(product,true)
          }
        })
      }
    }
    productList.value = listData.list
    productTotal.value = listData.total
  } catch(error) {
    console.error(error);
  } finally {
    loading.value = false
  }
}
const emit = defineEmits(['saveProduct'])
 // 保存选择商品ID
const saveIdList = (): void => {
  if(type.value === 1){
    // 单选
    let selection = tableRadio.value
    emit('saveProduct', selection.skus.map(sku => {
      sku['originalPrice'] = sku.price
      sku['originalStock'] = sku.stock
      sku['stock'] = ''
      sku['price'] = ''
      sku['image'] = sku['image'] || selection['image']
      return sku;
    }));
  } else {
    // 多选
    let newProductData = multipleSelection.value.map(selection => {
      return {
        ...selection,
        originalStock: selection.stock,
        skus: selection.skus.map(sku => {
          let newSku = {}
          for (let prop in sku) {
            if (selection.specType === 1 && prop === 'price') {
              newSku['originalPrice'] = sku.price
              newSku['originalStock'] = sku.stock
              continue;
            }
            newSku[prop] = sku[prop];
          }
          newSku['stock'] = 0
          newSku['price'] = 0
          return newSku;
        })
      };
    });
    emit('saveProduct', newProductData);
  }
  groupVisible.value = false;
}

const open = async (productList, disabled): Promise<void> => {
  idList.value = []
  visitDetail.value = disabled
  clear()
  if (productList.length) {
    productList.forEach((i) => {
      idList.value.push(i.id || i.productId)
    })
  }
  groupVisible.value = true;
  await getProductList();
}
const clear = () => {
  multipleTableRef.value?.clearSelection()
}
 // 取消选择
const closeSelect = (): void => {
  groupVisible.value = false;
}

defineExpose({ open, clear }) // 提供 open 方法，用于打开弹窗
</script>
<style lang="scss" scoped>
  .tableBox {
    .store-name {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
</style>
