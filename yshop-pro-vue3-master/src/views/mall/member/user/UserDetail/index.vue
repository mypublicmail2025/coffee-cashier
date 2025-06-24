<template>
 <el-drawer v-model="drawer" :title="dialogTitle" size="55%">
   <div class="user-detail" v-loading="loading">
     <div class="top">
       <div class="avatar-name">
         <el-image style="width: 50px; height: 50px" :src="DetailData.avatar" />
         {{ DetailData.nickname }}
       </div>
       <div class="btns">
         <el-button type="primary" @click="updateIntegral">修改积分</el-button>
         <el-button type="primary" @click="updateMoney">修改余额</el-button>
       </div>
     </div>
     <div class="info">
       <div class="item">
         <div class="label">余额：</div>
         <div class="val">{{ DetailData.nowMoney }}</div>
       </div>
       <div class="item">
         <div class="label">总计订单：</div>
         <div class="val">{{ DetailData.payCount }}</div>
       </div>
       <div class="item">
         <div class="label">总消费金额：</div>
         <div class="val">{{ DetailData.consumeAmount }}</div>
       </div>
       <div class="item">
         <div class="label">积分：</div>
         <div class="val">{{ DetailData.integral }}</div>
       </div>
     </div>
     <div class="tab-list">
       <div class="tab">

       </div>
     </div>
     <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
       <el-tab-pane label="用户信息" name="info">
         <el-descriptions title="基本信息" :column="3">
           <el-descriptions-item label="用户ID">{{ DetailData.id }}</el-descriptions-item>
           <el-descriptions-item label="用户昵称">{{ DetailData.nickname }}</el-descriptions-item>
           <el-descriptions-item label="绑定电话">{{ DetailData.mobile }}</el-descriptions-item>
           <el-descriptions-item label="生日">{{ DetailData.birthday }}</el-descriptions-item>
           <el-descriptions-item label="性别">{{ DetailData.sex == 1 ? '男' : '女' }}</el-descriptions-item>
           <el-descriptions-item label="收货地址">{{ DetailData.addres }}</el-descriptions-item>
           <el-descriptions-item label="用户等级">{{ userLevelArr[DetailData.level] }}</el-descriptions-item>
           <el-descriptions-item label="用户标签" :span="2" v-if="DetailData.tagList">
             <el-tag v-for="item in DetailData.tagList" :key="item.id" type="primary" style="margin-right: 5px">{{ item.tagName }}</el-tag>
           </el-descriptions-item>
           <el-descriptions-item label="注册时间">{{ formatDate(DetailData.createTime) }}</el-descriptions-item>
           <el-descriptions-item label="登录时间">{{ formatDate(DetailData.loginDate) }}</el-descriptions-item>
           <el-descriptions-item label="备注" :span="3">{{ DetailData.mark }}</el-descriptions-item>
         </el-descriptions>
       </el-tab-pane>
       <el-tab-pane label="购买记录" name="orderList">
         <el-table :data="DetailData.orderList">
           <el-table-column label="订单号" align="center" prop="orderId" width="190" />
           <el-table-column label="商品信息" align="center" prop="" width="350">
             <template #default="scope">
               <div class="tabBox" v-for="(val, i ) in scope.row.cartInfo" :key="i">
                 <div class="tabBox_img">
                   <img :src="val.productInfo.attrInfo.image || val.productInfo.image" />
                 </div>
                 <span class="tabBox_tit">{{ val.productInfo.storeName + ' | ' }}{{val.productInfo.attrInfo.sku}}</span>
                 <span class="tabBox_pice">{{ '￥'+ val.truePrice + ' x '+ val.cartNum}}</span>
               </div>
             </template>
           </el-table-column>
           <el-table-column label="售价" align="center" prop="totalPrice" />
           <el-table-column label="实际支付" align="center">
             <template #default="scope">
               <span v-if="scope.row.paid == 1">{{ scope.row.payPrice }}</span>
               <span v-else>未支付</span>
             </template>
           </el-table-column>
           <el-table-column
             label="支付时间"
             align="center"
             prop="payTime"
             :formatter="dateFormatter"
             width="120"
           />
         </el-table>
       </el-tab-pane>
       <el-tab-pane label="积分明细" name="integralBillList">
         <el-table  :data="DetailData.integralBillList">
           <el-table-column label="来源/用途" align="center" prop="title" />
           <el-table-column label="积分变化" align="center" >
             <template #default="scope">
               <span v-if="scope.row.pm === 1">+{{ scope.row.number }}</span>
               <span v-else>-{{ scope.row.number }}</span>
             </template>
           </el-table-column>
           <el-table-column label="变化后积分" align="center" prop="balance" />
           <el-table-column
             label="操作时间"
             align="center"
             prop="createTime"
             :formatter="dateFormatter"
             width="200"
           />
           <el-table-column label="备注" align="center" prop="mark" />
         </el-table>
       </el-tab-pane>
       <el-tab-pane label="持有优惠券" name="userCouponDTOS">
         <el-table  :data="DetailData.userCouponDTOS">
           <el-table-column prop="couponName" label="优惠券名称" width="180" />
           <el-table-column prop="couponType" label="类型">
             <template #default="scope">
               <span v-if="scope.row.couponType == 1">满减券</span>
               <span v-else>折扣券</span>
             </template>
           </el-table-column>
           <el-table-column label="优惠金额" align="center">
             <template #default="scope">
               <span v-if="scope.row.couponType == 1">满减{{scope.row.couponValue}}元</span>
               <span v-else-if="scope.row.couponType == 2">打{{scope.row.discount}}折</span>
             </template>
           </el-table-column>
           <el-table-column label="有效期（天）" align="center" prop="expirationDay" >
            <template #default="scope">
               <span v-if="scope.row.expirationType == 1">{{formatDate(scope.row.expirationTime)}}过期</span>
               <span v-if="scope.row.expirationType == 2">{{scope.row.expirationDay}}天</span>
               <span v-if="scope.row.expirationType == 3">无限制时间</span>
             </template>
           </el-table-column>
           <el-table-column
             label="兑换时间"
             align="center"
             prop="receiveTime"
             :formatter="dateFormatter"
             width="200"
           />
         </el-table>
       </el-tab-pane>
       <el-tab-pane label="余额变动" name="billList">
         <el-table  :data="DetailData.billList">
           <el-table-column label="来源/用途" align="center" prop="title" />
           <el-table-column label="变动金额" align="center">
             <template #default="scope">
               <span v-if="scope.row.pm === 1">+{{ scope.row.number }}</span>
               <span v-else>-{{ scope.row.number }}</span>
             </template>
           </el-table-column>
           <el-table-column label="变化后" align="center" prop="balance" />
           <el-table-column
             label="操作时间"
             align="center"
             prop="createTime"
             :formatter="dateFormatter"
             width="200"
           />
           <el-table-column label="备注" align="center" prop="title" />
         </el-table>
       </el-tab-pane>
       <el-tab-pane label="浏览足迹" name="relationList">
         <el-table  :data="DetailData.relationList">
           <el-table-column label="商品信息" align="center" prop="" width="350">
             <template #default="scope">
               <div class="tabBox">
                 <div class="tabBox_img">
                   <img :src="scope.row.image" />
                 </div>
                 <span class="tabBox_tit">{{ scope.row.storeName }}</span>
               </div>
             </template>
           </el-table-column>
           <el-table-column label="售价" align="center" prop="price" />
           <el-table-column
             label="浏览时间"
             align="center"
             prop="createTime"
             :formatter="dateFormatter"
             width="200"
           />
         </el-table>
       </el-tab-pane>
     </el-tabs>
     <UpdateMoney ref="UpdateMoneyRef" @success="getDetail" />
     <UpdateIntegral ref="UpdateIntegralRef" @success="getDetail" />
   </div>
  </el-drawer>
</template>
<script setup lang="ts">
import * as UserApi from '@/api/member/user'
import { formatDate } from '@/utils/formatTime'
import type { TabsPaneContext } from 'element-plus'
import * as UserLevelConfigApi from '@/api/member/userLevelConfig'
import { dateFormatter } from '@/utils/formatTime'
import UpdateIntegral from './form/updateIntegral.vue'
import UpdateMoney from './form/updateMoney.vue'

const { t } = useI18n() // 国际化
const dialogTitle = ref('') // 弹窗的标题
const drawer = ref(false)
const DetailData = ref({})
const activeName = ref('info')
const userId = ref(0)
const loading = ref(false)

/** 打开弹窗 */
const open = (type: string, id?: number) => {
  drawer.value = true
  dialogTitle.value = t('action.' + type)
  userId.value = id
  getDetail()
}

const getDetail =async ()=>{
  loading.value = true
  DetailData.value = await UserApi.getUser(userId.value)
  loading.value = false
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.paneName, event)
  // queryParams.pageNo = 1
  // queryParams.type = tab.paneName
  //getList()
}

// 获取等级列表
const userLevelList = ref<UserLevelConfigApi.UserLevelConfigVO[]>([])
const userLevelArr = reactive([])
const getUserLevelConfigList = async () => {
  userLevelList.value = await UserLevelConfigApi.getUserLevelConfigList()
  userLevelList.value.unshift({
    id: 0,
    level: 0,
    levelName: '无等级',
    iconUrl: '',
    backgroundUrl: '',
    growthValue: 0,
    remarks: '',
    status: true
  })
  userLevelList.value.forEach((item: UserLevelConfigApi.UserLevelConfigVO)=> {
    userLevelArr[item.level] = item.levelName
  })
}

const UpdateIntegralRef = ref()
const updateIntegral = () => {
  UpdateIntegralRef.value.open(DetailData.value.id)
}

const UpdateMoneyRef = ref()
const updateMoney = () => {
  UpdateMoneyRef.value.open(DetailData.value.id)
}

onMounted(() => {
  getUserLevelConfigList()
})
</script>
<style scoped lang="scss">
 .user-detail{
   .top{
     display: flex;
     justify-content: space-between;
     .avatar-name{
       display: flex;
       align-items: center;
       .el-image{
         width: 50px;
         height: 50px;
         margin-right: 10px;
       }
     }
     .btns{
       display: flex;
     }
   }
   .info{
     margin: 20px 0;
     width: 100%;
     display: flex;
     align-items: center;
     .item{
       margin-right: 50px;
       display: flex;
       .label{

       }
       .val{
         font-weight: bold;
       }
     }
   }
   .el-table{
     .tabBox{
       width: 100%;
       height: 100%;
       display: flex;
       align-items: center;
       .tabBox_img{
         width: 36px;
         height: 36px;
         img{
           width: 100%;
           height: 100%;
         }
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
     }
   }
 }
</style>
