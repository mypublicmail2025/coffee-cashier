<template>
 <el-drawer v-model="drawer" :title="dialogTitle" size="40%">
    <div>
      <el-descriptions title="订单信息" :column="2">
        <el-descriptions-item label="订单号">{{ DetailData.orderCode }}</el-descriptions-item>
        <el-descriptions-item label="服务类型">
           <span v-if="DetailData.serviceType==0">仅退款</span>
           <span v-if="DetailData.serviceType==1">退货退款 </span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
           <span v-if="DetailData.state==0">等待审核</span>
           <span v-if="DetailData.state==1">已审核 </span>
           <span v-if="DetailData.state==2">用户已发货</span>
           <span v-if="DetailData.state==3">退款成功</span>
           <span v-if="DetailData.state==4">用户取消</span>
           <span v-if="DetailData.state==5">商家拒绝</span>
        </el-descriptions-item>
        <el-descriptions-item label="退款金额">{{ DetailData.refundAmount}}</el-descriptions-item>
        <el-descriptions-item label="申请原因">{{ DetailData.reasons }}</el-descriptions-item>
        <el-descriptions-item label="说明">{{ DetailData.explains }}</el-descriptions-item>
        <el-descriptions-item label="说明图片" v-if="DetailData.explainImg">
          <div class="img-list">
            <el-image style="width: 100px; height: 100px" :preview-src-list="DetailData.explainImgList" v-for="(item,index) in DetailData.explainImgList" :key="index" :src="item"  />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(DetailData.createTime)}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="商家收货信息" :column="2">
        <el-descriptions-item label="收货人">{{ DetailData.consignee ? DetailData.consignee : '--' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ DetailData.phoneNumber ? DetailData.phoneNumber : '--' }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ DetailData.address ? DetailData.address : '--' }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="用户退货物流信息" :column="2" v-if="DetailData.shipperCode">
        <el-descriptions-item label="快递公司">{{ DetailData.deliveryName }}</el-descriptions-item>
        <el-descriptions-item label="快递单号">{{ DetailData.deliverySn }} <el-button type="primary" @click="getLogistic(DetailData.deliverySn,DetailData.shipperCode)">物流追踪</el-button></el-descriptions-item>
        <el-descriptions-item label="退货说明">{{ DetailData.returnPolicy }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-if="DetailData.returnVoucher">
        <el-descriptions-item label="物流凭证" v-if="DetailData.returnVoucher">
          <div class="img-list">
            <el-image style="width: 100px; height: 100px" :preview-src-list="DetailData.returnVoucherList" v-for="(item,index) in DetailData.returnVoucherList" :key="index" :src="item"  />
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <el-timeline>
        <el-timeline-item
            v-for="(item, index) in logisticResult"
            :key="index"
            :timestamp="item.acceptTime"
        >
          {{ item.acceptStation }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import * as StoreAfterSalesApi from '@/api/mall/order/storeAfterSales'
import { formatDate } from '@/utils/formatTime'
import * as StoreOrderApi from "@/api/mall/order/storeOrder";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogTitle = ref('') // 弹窗的标题
const drawer = ref(false)
const DetailData = ref({
  orderCode: 0,
  serviceType: 0,
  explainImg: '',
  explainImgList: [''],
  returnVoucher: '',
  returnVoucherList: [''],
  state: 0, 
  refundAmount: 0, 
  reasons: '', 
  explains: '', 
  createTime: new Date(), 
  consignee: '', 
  phoneNumber: '', 
  address: '', 
  shipperCode: '', 
  deliveryName: '',
  deliverySn: '', 
  returnPolicy: '', 
})
class LogisticResultVo {
  acceptTime = '';
  acceptStation = '';
}
const logisticResult = ref<LogisticResultVo[]>([])
/** 打开弹窗 */
const open = async (type: string, id: number) => {
  drawer.value = true
  dialogTitle.value = t('action.' + type)
  DetailData.value =  await StoreAfterSalesApi.getStoreAfterSales(id)
  DetailData.value.explainImgList = DetailData.value.explainImg?.split(',')
  DetailData.value.returnVoucherList = DetailData.value.returnVoucher?.split(',')

}

const getLogistic = async(deliverySn,shipperCode) => {
  const res = await StoreOrderApi.getLogistic(deliverySn, shipperCode)
  if (res.success == "false") {
    message.error(res.reason)
  }
  logisticResult.value = res.traces
  console.log(logisticResult.value, 'logisticResult')
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
<style scoped>
.logisticResult p {
  font-size: 12px;
}
</style>
