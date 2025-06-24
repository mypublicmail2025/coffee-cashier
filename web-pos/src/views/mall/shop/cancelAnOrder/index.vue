<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      @submit.enter.prevent
    >
      <el-form-item label="店员姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入用户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="核销状态" prop="writeOffStatus">
        <el-select v-model="queryParams.writeOffStatus" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="已核销" :value="1" />
          <el-option label="待核销" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="门店" prop="storeId">
        <el-select v-model="queryParams.storeId" placeholder="请选择门店" clearable class="!w-240px">
          <el-option v-for="item of shopList" :key="item.id" :label="item.storeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="createTime">
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
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column label="所属门店" align="center" prop="storeName" />
      <el-table-column label="订单号" align="center" prop="orderId" width="190" />
      <el-table-column label="用户姓名" align="center" prop="realName">
        <template #default="scope">
          <span>{{scope.row.userRespVO.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" align="center" width="350">
        <template #default="scope">
          <div class="tabBox" v-for="(val, i ) in scope.row.storeOrderCartInfoDOList" :key="i">
              <div class="tabBox_img">
                  <img :src="val.cartInfo.productInfo.attrInfo.image" />
              </div>
              <span class="tabBox_tit">{{ val.cartInfo.productInfo.storeName + ' | ' }}{{val.cartInfo.productInfo.attrInfo.sku}}</span>
              <span class="tabBox_pice">{{ '￥'+ val.cartInfo.truePrice + ' x '+ val.cartInfo.cartNum}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="实际支付" align="center">
        <template #default="scope">
         <span v-if="scope.row.paid == 1">{{ scope.row.payPrice }}</span>
         <span v-else>未支付</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="statusStr" />
      <el-table-column label="核销状态" align="center" prop="writeOffStatus">
        <template #default="scope">
          <span v-if="scope.row.writeOffStatus === 1">已核销</span>
          <span v-if="scope.row.status !== 4 && scope.row.writeOffStatus === 0">待核销</span>
          <span v-if="scope.row.status === 4">已失效</span>
        </template>
      </el-table-column>
      <el-table-column
        label="下单时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="120"
      />
      <el-table-column
        label="支付时间"
        align="center"
        prop="payTime"
        :formatter="dateFormatter"
        width="120"
      />
      <el-table-column
        label="核销时间"
        align="center"
        prop="writeOffDate"
        :formatter="dateFormatter"
        width="120"
      />
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <el-button
            v-if="scope.row.writeOffStatus === 0 && scope.row.status !== 4"
            link
            type="primary"
            @click="cancelAnOrder(scope.row.id)"
          >
            核销
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('orderDetail', scope.row.id)"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDelete(scope.row.id)"
          >
            删除
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
  <OrderDetail ref="formRef1" />
  <Dialog title="订单核销" v-model="dialogVisible" width="30%">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="核销码" prop="writeOffCode">
        <el-input v-model="formData.writeOffCode" placeholder="请输入核销码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts" name="StoreOrder">
import { dateFormatter } from '@/utils/formatTime'
import * as ShopAssistantApi from '@/api/mall/shopAssistant'
import * as StoreOrderApi from '@/api/mall/order/storeOrder'
import OrderDetail from "@/views/mall/shop/cancelAnOrder/OrderDetail.vue";

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderId: "",
  realName: "",
  userPhone: "",
  createTime: [],
  orderStatus: "",
  payStatus: "",
  storeId: null,
  shippingType: 2,
  writeOffStatus: null

})
const queryFormRef = ref() // 搜索的表单
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StoreOrderApi.getStoreOrderPage(queryParams)
   // const jsonObj = eval('(' + data.list[0].storeOrderCartInfoDOList[0].cartInfo + ')')
    //console.log(jsonObj)
    data.list.forEach((element, index) => {
      element.storeOrderCartInfoDOList.forEach((e, n) => {
         data.list[index].storeOrderCartInfoDOList[n].cartInfo = eval('(' + e.cartInfo + ')')
      })

    });
    data.list = mergeShopListAndDataList(shopList.value, data.list);
    list.value = data.list
    //console.log("aa:",list.value)
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

/** 添加/修改操作 */
const formRef1 = ref()
const openForm = (type: string, id?: number) => {
  formRef1.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StoreOrderApi.deleteStoreOrder(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}


// 获取门店列表
const shopList = ref([]) // 门店列表
const getStoreList = async () => {
  shopList.value = await ShopAssistantApi.getShopList()
}

// 核销订单操作
const dialogVisible = ref(false)
const formLoading = ref(false)
const formData = ref({
  writeOffCode: ''
})
const formRules = reactive({
  writeOffCode: [{ required: true, message: '核销码不能为空!', trigger: 'blur' }],
})
const cancelAnOrder = () => {
  dialogVisible.value = true
}

const formRef = ref()
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    await StoreOrderApi.orderCancellation(formData.value)
    message.success('核销成功')
    dialogVisible.value = false
    await getList()
    // 发送操作成功的事件
  } finally {
    formLoading.value = false
  }
}
function mergeShopListAndDataList(shopList, dataList) {
  return dataList.map(dataItem => {
    const correspondingShopItem = shopList.find(shopItem => shopItem.id === dataItem.storeId);
    if (correspondingShopItem) {
      dataItem.storeName = correspondingShopItem.storeName;
    }
    return dataItem;
  });
}
/** 初始化 **/
onMounted(() => {
  getStoreList()
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
