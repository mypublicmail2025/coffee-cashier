<template>
 <el-drawer v-model="drawer" :title="dialogTitle" size="60%">
    <div>
      <el-descriptions title="普通订单" :column="4">
<!--        <el-descriptions-item label="用户昵称">{{ nickname }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="收货人">{{ DetailData.realName }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="联系电话">{{ DetailData.userPhone }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="收货地址">{{ DetailData.userAddress }}</el-descriptions-item>-->
        <el-descriptions-item label="订单编号">{{ DetailData.orderId }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{ DetailData.statusStr }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">
          <span v-if="DetailData.payType=='yue'">余额支付</span>
          <span v-if="DetailData.payType=='weixin'">微信支付</span>
          <span v-if="DetailData.payType=='alipay'">支付宝支付</span>
        </el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ formatDate(DetailData.payTime) }}</el-descriptions-item>
      </el-descriptions>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="订单信息" name="orderInfo">
          <div>
            <h3 style="font-weight: bold; margin-bottom: 10px">用户信息</h3>
            <el-descriptions title="" :column="3">
              <el-descriptions-item label="用户ID:">{{ DetailData.uid }}</el-descriptions-item>
              <el-descriptions-item label="用户昵称:">{{ DetailData.userRespVO.nickname }}</el-descriptions-item>
              <el-descriptions-item label="绑定电话:">{{ DetailData.userRespVO.mobile ? DetailData.userRespVO.mobile : '--'}}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <h3 class="h-title">收货信息</h3>
            <el-descriptions title="" :column="3">
              <el-descriptions-item label="收货人:">{{ DetailData.realName }}</el-descriptions-item>
              <el-descriptions-item label="收货电话:">{{ DetailData.userPhone }}</el-descriptions-item>
              <el-descriptions-item label="收货地址:">{{ DetailData.userAddress }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <h3 class="h-title">订单信息</h3>
            <el-descriptions title="" :column="3">
              <el-descriptions-item label="创建时间:">{{ formatDate(DetailData.createTime) }}</el-descriptions-item>
              <el-descriptions-item label="商品总数:">{{ DetailData.totalNum }}</el-descriptions-item>
              <el-descriptions-item label="订单总价:">￥{{ DetailData.totalPrice }}</el-descriptions-item>
              <el-descriptions-item label="优惠券金额:">￥{{ DetailData.couponPrice }}</el-descriptions-item>
              <el-descriptions-item label="积分抵扣:">￥{{ DetailData.deductionPrice }}</el-descriptions-item>
              <el-descriptions-item label="支付运费:">￥{{ DetailData.payPostage }}</el-descriptions-item>
              <el-descriptions-item label="会员优惠:">{{ DetailData.vipDeductionAmount }}</el-descriptions-item>
              <el-descriptions-item label="支付金额:">￥{{ DetailData.payPrice }}</el-descriptions-item>
              <el-descriptions-item label="支付时间:">{{ formatDate(DetailData.payTime) }}</el-descriptions-item>
              <el-descriptions-item label="赠送积分:">{{ DetailData.gainIntegral }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品信息" name="commodityInfo">
          <el-table :data="DetailData.storeOrderCartInfoDOList" style="width: 100%">
            <el-table-column label="序号" align="left" type="index" width="80" />
            <el-table-column label="商品信息" align="left" width="400">
              <template #default="scope">
                <div class="tabBox">
                  <div class="tabBox_img">
                    <img :src="JSON.parse(scope.row.cartInfo).productInfo.image" />
                  </div>
                  <span class="tabBox_tit">{{ JSON.parse(scope.row.cartInfo).productInfo.storeName }} | {{ JSON.parse(scope.row.cartInfo).productInfo.attrInfo.sku}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="couponPrice" align="left" label="售价">
              <template #default="scope">
                <div class="tabBox">
                  <span class="tabBox_tit">{{ JSON.parse(scope.row.cartInfo).truePrice }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="payPrice" align="left" label="实付金额" />
            <el-table-column prop="cartNum" align="left" label="数量" >
              <template #default="scope">
                <div class="tabBox">
                  <span class="tabBox_tit">{{ JSON.parse(scope.row.cartInfo).cartNum }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="小计" align="left">
              <template #default="scope" >
                <div>{{ JSON.parse(scope.row.cartInfo).cartNum * scope.row.payPrice || 0 }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单记录" name="orderRecord">
          <el-table :data="DetailData.statusList" style="width: 100%">
            <el-table-column prop="id" label="订单id" />
            <el-table-column prop="changeMessage" label="操作记录" />
            <el-table-column label="操作时间" align="center" prop="changeTime" :formatter="dateFormatter"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="发货记录" name="sendingRecord">
          <el-table style="width: 100%" :data="[DetailData]">
            <el-table-column prop="id" label="订单号" width="180" />
            <el-table-column prop="storeOrderCartInfoDOList" label="商品信息" width="180">
              <template #default="scope">
                <div class="tabBox" v-for="item of scope.row.storeOrderCartInfoDOList" :key="item.id">
                  <div class="tabBox_img">
                    <img :src="JSON.parse(item.cartInfo).productInfo.image" />
                  </div>
                  <span class="tabBox_tit">{{ JSON.parse(item.cartInfo).productInfo.storeName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="发货时间"
              align="center"
              prop="deliveryDate"
              :formatter="dateFormatter"
              width="120"
            />
            <el-table-column label="物流信息">
              <template #default="scope">
                <el-button
                  v-if="[1,2,3].includes(DetailData.status)"
                  @click="getLogistic(scope.row.deliveryId, scope.row.deliverySn)"
                  link
                  type="primary"
                >
                  物流追踪
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  v-if="DetailData.status === 0"
                  @click="deliverGoods(scope.row.id)"
                  link
                  type="primary"
                >
                  发货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="express-box" v-if="logisticsShow">
            <el-descriptions title="物流信息" :column="2" v-if="DetailData.deliveryId">
              <el-descriptions-item label="快递公司:">{{ DetailData.deliveryName }}</el-descriptions-item>
              <el-descriptions-item label="快递单号">{{ DetailData.deliveryId }}</el-descriptions-item>
            </el-descriptions>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in logisticResult"
                :key="index"
                :timestamp="activity.acceptTime"
              >
                {{ activity.acceptStation }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
      </el-tabs>
<!--      <el-descriptions title="订单信息" :column="2">-->
<!--        <el-descriptions-item label="商品总数">{{ DetailData.totalNum }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="商品总价">{{ DetailData.cost }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="支付邮费">{{ DetailData.payPostage }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="优惠券金额">{{ DetailData.couponPrice }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="积分抵扣">{{ DetailData.useIntegral }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="实际支付">{{ DetailData.payPrice }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="赠送积分">{{ DetailData.gainIntegral }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="创建时间">{{ formatDate(DetailData.createTime)}}</el-descriptions-item>-->
<!--      </el-descriptions>-->
      <!-- <el-button @click="innerDrawer = true">Click me!</el-button>
      <el-drawer
        v-model="innerDrawer"
        title="I'm inner Drawer"
        :append-to-body="true"
        :before-close="handleClose"
      >
        <p>_(:зゝ∠)_</p>
      </el-drawer> -->
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import * as StoreOrderApi from '@/api/mall/order/storeOrder'
import {dateFormatter, formatDate} from '@/utils/formatTime'
// const message = useMessage() // 消息弹窗

const { t } = useI18n() // 国际化
// const message = useMessage() // 消息弹窗
const dialogTitle = ref('') // 弹窗的标题
const drawer = ref(false)
const activeName = ref('orderInfo')
const DetailData = ref({
  nickname: '',
  realName: '',
  userPhone: '',
  userAddress: '',
  orderId: '',
  statusStr: '',
  totalNum: '',
  cost: '',
  payPostage: '',
  couponPrice: '',
  useIntegral: '',
  payPrice: '',
  gainIntegral: '',
  createTime: new Date(),
  payTime: new Date(),
  payType: '',
  deliveryId: '',
  deliveryName: '',
  deliverySn: '',
  userRespVO: {
    nickname: ''
  }
})
const logisticsShow = ref(false)
const nickname = ref('')
interface LogisticResult {
  acceptTime: string;
  acceptStation: string;
}
const logisticResult = ref<LogisticResult[]>([])
/** 打开弹窗 */
const open = async (type: string, id: number) => {
  drawer.value = true
  dialogTitle.value = t('action.' + type)
  DetailData.value = await StoreOrderApi.getStoreOrder(id)
  nickname.value = DetailData.value.userRespVO.nickname
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getLogistic = async(deliverySn, deliveryId) => {
  console.log(deliveryId, deliverySn)
  const res = await StoreOrderApi.getLogistic(deliverySn, deliveryId)
  if (res.success == "false") {
    message.error(res.reason)
  }
  logisticResult.value = res.reason
  logisticsShow.value = true
}

const emit = defineEmits(['toDeliverGoods'])
const deliverGoods = (id) => {
  emit('toDeliverGoods', id)
}
</script>
<style scoped>
.h-title {
  border-top: 1px solid #EEEEEE;
  margin: 10px 0;
  font-weight: bold;
  padding-top: 10px;
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
.express-box {
  margin-top: 20px;
}
</style>
