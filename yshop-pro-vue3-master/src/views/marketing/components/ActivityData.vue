<script setup lang="ts">
import { ref } from "vue";
import * as StoreActivityApi from "@/api/marketing";
import { ActivityProduct } from "@/types/activity";
interface MarketingData {
  id: number
  name: string
  dealAmount: number
  dealQuantity: number
  peopleNumber: number
  productQuantity: number
  averagePrice: number
}

const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('活动数据')
const productList = ref<ActivityProduct[]>([])
const loading = ref<boolean>(false)
const productTotal = ref<number>(0)
const activiyData = ref<MarketingData>({
  id: 0,
  name: '',
  dealAmount: 0,
  dealQuantity: 0,
  peopleNumber: 0,
  productQuantity: 0,
  averagePrice: 0,
})

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: 0
})

const open = async (id) => {
  queryParams.id = id
  await getActivityData()
  await getActivityProduct()
  dialogVisible.value = true
}

/** 查询列表 */
const getActivityProduct = async () => {
  loading.value = true
  try {
    let listData;
    listData = await StoreActivityApi.getActivityListData(queryParams)
    productList.value = listData.list
    productTotal.value = listData.total
  } catch(error) {
    console.error(error);
  } finally {
    loading.value = false
  }
}
const getActivityData = async () => {
  try {
    activiyData.value = await StoreActivityApi.getActivityData(queryParams.id)
  } catch (error) {
    console.error(error);
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="70%"
    top="50px"
    class="group-dialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="true"
  >
    <div class="flex-box">
      <div class="grid-content">
        <div class="item-box">
          <div class="title">成交金额</div>
          <count-to :start-val="0" :end-val="activiyData.dealAmount" :decimals="2" :duration="2600" class="value" />
        </div>
      </div>
      <div class="grid-content">
        <div class="item-box">
          <div class="title">成交单量</div>
          <count-to :start-val="0" :end-val="activiyData.dealQuantity" :duration="2600" class="value" />
        </div>
      </div>
      <div class="grid-content">
        <div class="item-box">
          <div class="title">成交人数</div>
          <count-to :start-val="0" :end-val="activiyData.peopleNumber"  :duration="2600" class="value" />
        </div>
      </div>
      <div class="grid-content">
        <div class="item-box">
          <div class="title">成交商品数</div>
          <count-to :start-val="0" :end-val="activiyData.productQuantity"  :duration="2600" class="value" />
        </div>
      </div>
      <div class="grid-content">
        <div class="item-box">
          <div class="title">成交客单价</div>
          <count-to :start-val="0" :end-val="activiyData.averagePrice" :decimals="2"  :duration="2600" class="value" />
        </div>
      </div>
    </div>
    <div class="tableBox">
      <el-table
        ref="multiple"
        :data="productList"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="500"
      >
        <el-table-column label="商品信息" width="330" align="center">
          <template #default="scope">
            <div class="flex items-center">
              <img height="80" width="80" :src="scope.row.image" alt="" />
              <div class="product-info">
                <h4>{{ scope.row.productName }}</h4>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="成交金额" width="180" align="center" prop="dealAmount	">
          <template #default="scope">
            <span>￥{{scope.row.dealAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交单量" width="180" align="center" prop="dealQuantity" />
        <el-table-column label="成交人数" width="180" align="center" prop="peopleNumber" />
        <el-table-column label="成交件数" width="180" align="center" prop="productQuantity" />
        <el-table-column label="客单价" align="center" prop="averagePrice">
          <template #default="scope">
            <span>￥{{scope.row.averagePrice}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="productTotal"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getActivityProduct"
      />
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.tableBox {
  margin-top: 30px;
  padding-bottom: 50px;
}
.flex-box {
  display: flex;
  justify-content: space-around;
  .grid-content {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .item-box {
      width: 200px;
      height: 160px;
      padding-top: 40px;
      box-sizing: border-box;
      box-shadow: 1px 1px 5px 1px #F3F3F3, -1px -1px 5px 1px #F3F3F3;
      .title {
        font-weight: 500;
        color: #666666;
        font-size: 18px;
        margin-bottom: 20px;
      }
      .value {
        font-size: 18px;
        color: #999999;
      }
    }
  }
}
.product-info {
  h4 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    padding: 0 5px;
    text-align: left;
  }
}
</style>
