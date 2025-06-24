<template>
  <!--    选择商品列表-->
  <el-dialog
    v-model="groupVisible"
    :title="visitDetail ? '查看价格' : '设置价格'"
    width="42%"
    top="50px"
    class="group-dialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
  >
    <div class="flex batch" v-if="!visitDetail">
      <el-button :type="isInventory === 0 ? 'primary' : ''" @click="showPriceSet(0)">批量设置{{marketingType === 3 ? '折扣' : '价格'}}</el-button>
      <el-button :type="isInventory === 1 ? 'primary' : ''" @click="showPriceSet(1)">批量设置库存</el-button>
      <div class="price-box flex" v-if="bulkSetPrice">
        <el-input-number  class="value-class" v-if="marketingType === 3 && isInventory === 0" v-model="setPrice" :min="0" :max="9.9" :step="1" :precision="1" controls-position="right"/>
        <el-input-number v-else class="value-class" v-model="setPrice" :min="0" controls-position="right" />
        <el-button
          type="primary"
          @click="priceSetting"
        >确 定</el-button>
        <el-button @click="bulkSetPrice = false">取 消</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <el-table
        ref="multipleTableRef"
        :data="skuList"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="skuId"
        max-height="600"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="!visitDetail"
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column prop="sku" label="规格信息">
          <template #default="scope">
            <div class="store-name">{{scope.row.sku}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="originalPrice"
          :label="marketingType === 3 ? '折扣' : '价格'"
        />
        <el-table-column
          prop="originalStock"
          label="库存"
        />
        <el-table-column :label="activityTit" width="200" align="center">
          <template #default="scope">
            <el-input-number
              v-if="marketingType === 3"
              :placeholder="`请输入${activityTit}`"
              v-model="scope.row.discount"
              :min="0"
              :max="9.9"
              :step="1"
              :precision="1"
              controls-position="right"
              :disabled="visitDetail"
            />
            <el-input-number
              v-else
              :placeholder="`请输入${activityTit}`"
              v-model="scope.row.price"
              :min="0"
              :max="scope.row.originalPrice"
              :step="1"
              :precision="2"
              controls-position="right"
              :disabled="visitDetail"
            />
            <i style="margin-left: 5px;font-style: normal" v-if="marketingType === 3">折</i>
          </template>
        </el-table-column>
        <el-table-column label="活动库存" width="200" align="center">
          <template #default="scope">
            <el-input-number
              placeholder="请输入库存"
              v-model="scope.row.stock"
              :min="0"
              :step="1"
              :precision="0"
              :disabled="visitDetail"
              controls-position="right"
            />
          </template>
        </el-table-column>
      </el-table>
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
import { SkuResp, ActivityProduct } from "@/types/activity";
import {ref, nextTick} from "vue";
const message = useMessage() // 消息弹窗

const groupVisible = ref<boolean>(false);
const bulkSetPrice = ref<boolean>(false);
const setPrice = ref<number>(0);
const isInventory = ref<number | null>(null);
const visitDetail = ref<boolean>(false);
const activityTit = ref<string>('');
const activityTypes = ref<object>({
  '1': '拼团价',
  '2': '秒杀价',
  '3': '折扣价'
})
const marketingType = ref<number | null>(null)
// 选择商品
const skuList = ref<SkuResp[]>([]);
const idList = ref<number[]>([])
const multipleSelection = ref<SkuResp[]>([]);
const multipleTableRef = ref();

const handleSelectionChange = (val: SkuResp[]): void => {
  multipleSelection.value = val
}

const emit = defineEmits(['changeSpecification'])
// 保存选择商品
const saveIdList = () => {
  for(let item of multipleSelection.value) {
    // 检查 item 中的 price 和 stock 字段
    let checkFields = marketingType.value === 3 ? ['discount', 'stock'] : ['price', 'stock'];
    for (let field of checkFields) {
      if (!(field in item) || item[field] <= 0) {
        message.error(`所选规格${item.sku}活动${marketingType.value === 3 ? '折扣' : '价格'}与库存必须大于0`)
        return false;
      }
    }
  }
  let selectionIds = new Set(multipleSelection.value.map(item => item.skuId));
  let newSkuList = skuList.value.map(sku => {
    if (!selectionIds.has(sku.skuId) && 'price' in sku) {
      let newSku = {...sku}; // 创建一个新的 sku 对象来避免直接修改原始数据
      newSku['stock'] = 0
      newSku['price'] = 0
      newSku['discount'] = 0
      return newSku;
    } else {
      return sku; // 如果 sku 的 id 在 selectionIds 中存在，或者 sku 没有 price 字段，就原样返回 sku
    }
  });
  console.log(newSkuList, 'newSkuList')
  emit('changeSpecification', newSkuList);
  groupVisible.value = false;
}

const open = async (item: ActivityProduct, disabled, type) => {
  idList.value = []
  visitDetail.value = disabled
  let listData = item.skus
  clear()
  if (item.skus.length) {
    listData.forEach((i) => {
      if (marketingType.value === 3) {
        if (i.discount !== 0 && i.discount !== null) {
          idList.value.push(i.skuId)
        }
      } else {
        if (i.price !== 0 && i.price !== null) {
          idList.value.push(i.skuId)
        }
      }
    })
  }
  marketingType.value = type
  activityTit.value = activityTypes.value[type]
  // 点击编辑时回显表格勾选
  groupVisible.value = true;
  nextTick(() => {
    listData.forEach((sku) => {
      if (idList.value.includes(sku.skuId)) {
        multipleTableRef.value.toggleRowSelection(sku);
      }
    })
  })
  skuList.value = listData
}
const clear = () => {
  multipleTableRef.value?.clearSelection()
}
// 取消选择
const closeSelect = (): void => {
  groupVisible.value = false;
}

// 批量设置价格显示
const showPriceSet = (type) => {
  setPrice.value = 0
  isInventory.value = type
  bulkSetPrice.value = true
}

// 批量设置价格
const priceSetting = (): void => {
  console.log(skuList.value, multipleSelection.value)
  skuList.value.forEach((item: SkuResp) => {
    multipleSelection.value.forEach((selectedItem: SkuResp) => {
      if(item.skuId === selectedItem.skuId) {
        if (isInventory.value) {
          item.stock = setPrice.value;
        } else {
          if (marketingType.value === 3) {
            item.discount = setPrice.value;
          } else {
            item.price = setPrice.value;
          }
        }
      }
    });
  });
  bulkSetPrice.value = false;
  isInventory.value = null;
}

defineExpose({ open, clear }) // 提供 open 方法，用于打开弹窗
</script>
<style lang="scss" scoped>
.batch {
  margin-bottom: 10px;
}
.tableBox {
  .store-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
.price-box {
  margin: 0 0 10px 10px;
  .value-class {
    margin-right: 10px;
  }
}
</style>
