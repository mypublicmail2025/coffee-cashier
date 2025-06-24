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
      <el-form-item label="分销商" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入分销商"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="等级" prop="levelId">
        <el-select v-model="queryParams.levelId" placeholder="请选择分销商等级" clearable class="!w-240px">
          <el-option
            v-for="item in levelList"
            :key="item.level"
            :label="item.name"
            :value="item.level"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DISTRIBUTOR_STATUS)"
            :key="String(dict.value)"
            :label="dict.label"
            :value="dict.value"
          />
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
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="分销商信息" align="center" prop="realName" width="190" />
      <el-table-column label="等级" align="center" prop="levelName"  />
      <el-table-column label="上级分销商" align="center" prop="superiorNameP1"  />
      <el-table-column label="销售金额" align="center" prop="addUpAmount"  />
      <el-table-column label="累计佣金" align="center" prop="addUpWages"  />
      <el-table-column label="邀请用户数" align="center" prop="userCount"  />
      <el-table-column label="下级分销商" align="center" prop="addUpDistributor"  />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DISTRIBUTOR_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="190"
      />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="showDetail(scope.row.id)"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="updateLevel(scope.row)"
          >
            修改等级
          </el-button>
          <el-button
            link
            type="primary"
            @click="updateSuperior(scope.row)"
          >
            修改上级
          </el-button>
          <el-button
            link
            v-if="[0].includes(scope.row.status)"
            type="primary"
            @click="audit(scope.row.id)"
          >
            审核
          </el-button>
          <el-button
            link
            type="danger"
            v-if="[-1, 2].includes(scope.row.status)"
            @click="deleteMarchant(scope.row.id)"
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
  <!--    选择商品列表-->
  <el-dialog
    v-model="groupVisible"
    title="分销商详情"
    width="50%"
    top="50px"
    class="group-dialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="true"
  >
    <div class="distributor">
      <el-row :gutter="50">
        <el-col :span="12">
          <h3>分销商信息</h3>
<!--          <div class="flex avatar">-->
<!--            <img src="../../../assets/imgs/logo.png" alt="" />-->
<!--            <div class="name">分销商名称</div>-->
<!--          </div>-->
          <div class="flex status distributor-item">
            <div class="distributor-status">分销商状态：<dict-tag :type="DICT_TYPE.DISTRIBUTOR_STATUS" :value="distributorDetail.status" /></div>
            <span class="checkAndReturn" v-if="distributorDetail.status === 0" @click="audit(distributorDetail.id)">审核</span>
            <span class="checkAndReturn" v-if="distributorDetail.status === 1" @click="checkDistributor">清退</span>
            <span class="checkAndReturn" v-if="distributorDetail.status === -1" @click="recoverDistributor">恢复</span>
          </div>
          <div class="distributor-item distributor-item">分销商等级：{{distributorDetail.levelName}}</div>
          <div class="distributor-item distributor-item">上级分销平台：{{distributorDetail.superiorNameP1}}</div>
          <div class="flex">
            <div class="proportion distributor-item">佣金比例：</div>
            <div class="proportion distributor-item">一级：{{distributorDetail.firstWages}}%</div>
            <div class="proportion distributor-item">二级：{{distributorDetail.secondWages}}%</div>
          </div>
        </el-col>
        <el-col :span="12">
          <h3>申请信息</h3>
          <div class="distributor-item">真实姓名：{{distributorDetail.realName}}</div>
          <div class="distributor-item">手机号：{{distributorDetail.mobile}}</div>
          <div class="distributor-item">现住省份：{{distributorDetail.address}}</div>
          <div class="distributor-item" v-if="[0, 1].includes(distributorDetail.status)">申请原因：{{distributorDetail.reason}}</div>
          <div class="distributor-item" v-if="distributorDetail.status === 2">拒绝原因：{{distributorDetail.refuse}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <h3>团队信息</h3>
          <div>
            <h4>团队统计</h4>
            <div class="distributor-item">团队人数：{{distributorDetail.userCount ? distributorDetail.userCount : 0}}</div>
            <div class="distributor-item justify-between flex">
              <div>一级团队人数: {{distributorDetail.p1UserCount ? distributorDetail.p1UserCount : 0}} 人</div>
              <div>一级分销商人数：{{distributorDetail.firstDistributorCount ? distributorDetail.firstDistributorCount : 0}} 人</div>
            </div>
            <div class="distributor-item justify-between flex">
              <div>二级团队人数: {{distributorDetail.p2UserCount ? distributorDetail.p2UserCount : 0}} 人</div>
              <div>二级分销商人数：{{distributorDetail.secondDistributorCount ? distributorDetail.secondDistributorCount : 0}} 人</div>
            </div>
          </div>
          <div>
            <h4>业绩统计</h4>
            <div class="distributor-item justify-between flex">
              <div>团队分销总金额: {{distributorDetail.amountCount ? distributorDetail.amountCount : 0}} 元</div>
              <div>团队分销订单：{{distributorDetail.orderCount ? distributorDetail.orderCount : 0}} 单</div>
            </div>
            <div class="distributor-item justify-between flex">
              <div>一级分销总金额: {{distributorDetail.firstAmountCount ? distributorDetail.firstAmountCount : 0}} 元</div>
              <div>一级分销订单：{{distributorDetail.firstOrderCount ? distributorDetail.firstOrderCount : 0}} 单</div>
            </div>
            <div class="distributor-item justify-between flex">
              <div>二级分销总金额: {{distributorDetail.secondAmountCount ? distributorDetail.secondAmountCount : 0}} 元</div>
              <div>二级分销订单：{{distributorDetail.secondOrderCount ? distributorDetail.secondOrderCount : 0}} 单</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
  <AuditForm ref="auditRef" @success="restList" />
  <UpdateLevel ref="updateLevelRef" @success="restList" />
  <UpdateSuperior ref="updateSuperiorRef" @success="restList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as DistributorApi from "@/api/distributor/merchant";
import * as DistributorLevelApi from "@/api/distributor/level";
import { ref, reactive } from "vue";
import {DistributorData, DistributorDetail, LevelListItem} from "@/types/distributor";
import AuditForm from "@/views/distributor/merchant/components/auditForm.vue";
import UpdateLevel from "@/views/distributor/merchant/components/updateLevel.vue";
import UpdateSuperior from "@/views/distributor/merchant/components/updateSuperior.vue";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
interface QueryParams {
  pageNo: number
  pageSize: number
  levelId?: number;
  superiorName?: string;
  status?: string,
  realName: string,
  createTime: any
}

const loading = ref<boolean>(true);
const total = ref<number>(0);
const list = ref<DistributorData[]>([]);
const queryParams: QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  levelId: undefined,
  superiorName: "",
  createTime: [],
  status: "",
  realName: ''
})
const levelList = ref<LevelListItem[]>([]);
const queryFormRef = ref() // 搜索的表单
const groupVisible = ref(false) // 拼团信息显示
const distributorDetail = ref({} as DistributorDetail)
/** 查询列表 */
const getList: ()=> Promise<void> = async () => {
  loading.value = true
  try {
    const data = await DistributorApi.getDistributorPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
// 获取分销等级
const getLevelList = async () => {
  levelList.value = await DistributorLevelApi.getLevelListAll()
}
/** 搜索按钮操作 */
const handleQuery: () => void = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery: () => void = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
const showDetail = async (id:number) => {
  const data = await DistributorApi.getDistributorDetail(id)
  console.log(data, 'data')
  distributorDetail.value = data
  groupVisible.value = true
}

// 打开审核弹窗
const auditRef = ref()
const audit = (id: number) => {
  auditRef.value.open(id)
}

// 打开修改等级弹窗
const updateLevelRef = ref()
const updateLevel = (data) => {
  updateLevelRef.value.open(data)
}

// 打开修改上级弹窗
const updateSuperiorRef = ref()
const updateSuperior = (data) => {
  updateSuperiorRef.value.open(data)
}

// 清退分销商
const checkDistributor = async () => {
  try {
    // 清退的二次确认
    await message.delConfirm('是否清退该分销商？')
    // 发起清退
    await DistributorApi.checkDistributorApi({id: distributorDetail.value.id})
    message.success('清退成功')
    restList()
  } catch {}
}
// 删除分销商
const deleteMarchant = async (id:number) => {
  try {
    // 删除二次确认
    await message.delConfirm()
    // 发起删除
    await DistributorApi.removalOfDistributorApi(id)
    message.success(t('common.delSuccess'))
    getList()
  } catch {}
}
// 恢复分销商
const recoverDistributor = async () => {
  try {
    // 恢复的二次确认
    await message.delConfirm('是否恢复该分销商？')
    // 发起清退
    await DistributorApi.checkDistributorApi({id: distributorDetail.value.id})
    message.success('恢复成功')
    restList()
  } catch {}
}
// 重新请求数据
const restList = async () => {
  await getList()
  if (groupVisible.value) {
    let data = await DistributorApi.getDistributorDetail(distributorDetail.value.id)
    distributorDetail.value = data
  }
}
/** 初始化 **/
onMounted(() => {
  getList()
  getLevelList()
})
</script>

<style lang="scss" scoped>
.tableBox {
  margin-bottom: 50px;
}
.distributor {
  h3 {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    margin: 10px 0 15px 0;
  }
  h4 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 15px;
    padding-left: 15px;
  }
  .avatar {
    margin-bottom: 15px;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 1px solid #eeeeee;
      margin-right: 10px;
    }
    .name {
      font-size: 16px;
      color: #666666;
    }
  }
  .distributor-item {
    font-size: 14px;
    color: #666666;
    margin-bottom: 10px;
    padding-left: 25px;
    .checkAndReturn {
      color: #00a0e9;
      margin-left: 10px;
      cursor: pointer;
      height: 25px;
      line-height: 25px;
    }
  }
}
</style>
