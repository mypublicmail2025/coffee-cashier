<script setup lang="ts" name="Shop">
import { dateFormatter } from '@/utils/formatTime'
import * as StoreOrderApi from '@/api/mall/order/storeOrder'
import OrderDetail from "@/views/mall/order/storeOrder/OrderDetail.vue";
const route = useRoute()
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const orderDetailRef = ref()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  campaignType: 4,
  search: undefined,
  createTime: [],
  orderStatusSet: '1,2,3,4'
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StoreOrderApi.getStoreOrderPage(queryParams)
    data.list.forEach((element, index) => {
      element.storeOrderCartInfoDOList.forEach((e, n) => {
        data.list[index].storeOrderCartInfoDOList[n].cartInfo = eval('(' + e.cartInfo + ')')
      })
    });
    list.value = data.list
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const openForm = (type: string, id?: number)=>{
  orderDetailRef.value.open(type, id)
}

/** 初始化 **/
onMounted(() => {
  if(route.query && route.query.id){
    queryParams.campaignId = route.query.id
  }
  getList()
})
</script>
<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
    >
      <el-form-item label="关键词搜索" prop="search">
        <el-input
          v-model="queryParams.search"
          placeholder="输入商品名称/用户昵称/用户ID搜索"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="兑换时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="商品图片" align="center" width="100">
        <template #default="scope">
          <div class="tabBox" v-for="(val, i ) in scope.row.storeOrderCartInfoDOList" :key="i">
            <div class="tabBox_img"><img :src="val.cartInfo.productInfo.attrInfo.image || val.cartInfo.productInfo.image" /></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" align="center" width="350">
        <template #default="scope">
          <div class="tabBox" v-for="(val, i ) in scope.row.storeOrderCartInfoDOList" :key="i">
            <span class="tabBox_tit">{{ val.cartInfo.productInfo.storeName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" prop="realName" />
      <el-table-column label="订单号" align="center" width="200">
        <template #default="scope">
          <div class="link"  @click="openForm('orderDetail', scope.row.id)">{{scope.row.orderId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="积分价格" align="center">
        <template #default="scope">
          <div>{{scope.row.payIntegral}}积分 <span v-if="scope.row.payPrice!==0">+ {{scope.row.payPrice}}元</span></div>
        </template>
      </el-table-column>
      <el-table-column label="兑换数量" align="center" prop="totalNum" />
      <el-table-column
        label="兑换时间"
        align="center"
        prop="createTime"
        width="200"
        :formatter="dateFormatter"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <OrderDetail ref="orderDetailRef" />
</template>
<style lang="scss" scoped>
.tabBox{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .tabBox_img{
    width: 60px;
    height: 60px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .tabBox_tit{
    font-size: 12px !important;
    margin: 0 2px 0 10px;
    letter-spacing: 1px;
    padding: 5px 0;
    box-sizing: border-box;
    text-align: left;
  }
}

</style>
