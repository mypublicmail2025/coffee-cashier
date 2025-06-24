<template>
  <ContentWrap>
     <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="全部订单" :name="-1"/>
      <el-tab-pane label="售后中" :name="1"/>
      <el-tab-pane label="已完成" :name="2"/>
    </el-tabs>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      @submit.enter.prevent
    >
      <el-form-item label="订单号" prop="orderCode">
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
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
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订单号" align="center" prop="orderCode"  width="190" />
      <el-table-column label="用户id｜昵称" align="center"  width="120" >
        <template #default="scope">
          <span>{{ scope.row.userId }}|{{ scope.row.userRespVO?.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" align="center" prop="userAddress" width="350">
        <template #default="scope">
          <div class="tabBox" v-for="(val, i ) in scope.row.storeOrderCartInfoDOList" :key="i">
              <div class="tabBox_img">
                  <img :src="val.cartInfo.productInfo.attrInfo.image || val.cartInfo.productInfo.image" />
              </div>
              <span class="tabBox_tit">{{ val.cartInfo.productInfo.storeName + ' | ' }}{{val.cartInfo.productInfo.attrInfo.sku}}</span>
              <span class="tabBox_pice">{{ '￥'+ val.cartInfo.truePrice + ' x '+ val.cartInfo.cartNum}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center">
        <template #default="scope">
          <span>{{scope.row.refundAmount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务类型" align="center">
         <template #default="scope">
           <span v-if="scope.row.serviceType==0">仅退款</span>
           <span v-if="scope.row.serviceType==1">退货退款 </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" >
        <template #default="scope">
          <span v-if="scope.row.state==0">等待审核</span>
          <span v-if="scope.row.state==1">已审核 </span>
          <span v-if="scope.row.state==2">用户已发货</span>
          <span v-if="scope.row.state==3">退款成功</span>
          <span v-if="scope.row.state==4">用户取消 </span>
          <span v-if="scope.row.state==5">商家拒绝</span>
          <span v-if="scope.row.state==6">超时取消</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="售后状态" align="center" prop="salesState">-->
<!--        <template #default="scope">-->
<!--           <span v-if="scope.row.salesState==0">正常</span>-->
<!--           <span v-if="scope.row.salesState==1">用户取消 </span>-->
<!--           <span v-if="scope.row.salesState==2">商家拒绝</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="添加时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="170"
      />
      <el-table-column label="操作" align="center" fixed="right" width="230">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['order:store-after-sales:update']"
            v-if="scope.row.state==0 || scope.row.state == 2"
          >
            {{scope.row.state==0?'审核':'收货审核'}}
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('orderDetail', scope.row.id)"
            v-hasPermi="['order:store-after-sales:delete']"
          >
            订单详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <StoreAfterSalesForm ref="formRef" @success="getList" />
  <OrderDetail ref="formRef2" />
</template>

<script setup lang="ts" name="StoreAfterSales">
import { dateFormatter } from '@/utils/formatTime'
import * as StoreAfterSalesApi from '@/api/mall/order/storeAfterSales'
import StoreAfterSalesForm from './StoreAfterSalesForm.vue'
import OrderDetail from './OrderDetail.vue'
import type { TabsPaneContext } from 'element-plus'
// const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderCode: null,
  type: null
})
const queryFormRef = ref() // 搜索的表单

const activeName = ref(-1)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StoreAfterSalesApi.getStoreAfterSalesPage(queryParams)
    data.list.forEach((element, index) => {
      element.storeOrderCartInfoDOList.forEach((e, n) => {
         data.list[index].storeOrderCartInfoDOList[n].cartInfo = eval('(' + e.cartInfo + ')')
      })

    });
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

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.paneName, event)
  queryParams.pageNo = 1
  queryParams.type = tab.paneName
  getList()
}



/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const formRef2 = ref()
const openForm = (type: string, id?: number) => {
  if (type == 'orderDetail') {
    formRef2.value.open(type, id)
  } else {
    formRef.value.open(type, id)
  }

}



/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style scoped  >
 img {
        height: 36px;
        display: block;
    }
.tabBox{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center
    }
.tabBox_img{
    width: 36px;
    height: 36px;
  }
.tabBox_img img{
  width: 100%;
  height: 100%;
}
.tabBox_tit{
    width :60%;
    font-size: 12px !important;
    margin: 0 2px 0 10px;
    letter-spacing: 1px;
    padding: 5px 0;
    box-sizing: border-box;
    text-align: left;
  }
  .tabBox_pice{
    width :30%;
    font-size: 12px !important;
    margin: 0 2px 0 10px;
    letter-spacing: 1px;
    padding: 5px 0;
    box-sizing: border-box;
    text-align: left;
  }

</style>
