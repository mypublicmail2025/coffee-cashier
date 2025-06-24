<template>
  <Dialog title="分销商选择" v-model="dialogVisible" width="1000">
    <div class="superior-select">
      <ContentWrap>
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
<!--        <el-form-item label="时间" prop="createTime">-->
<!--          <el-date-picker-->
<!--            v-model="queryParams.createTime"-->
<!--            value-format="YYYY-MM-DD HH:mm:ss"-->
<!--            type="daterange"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--            class="!w-240px"-->
<!--          />-->
<!--        </el-form-item>-->

        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>
      </ContentWrap>
      <ContentWrap>
      <el-table v-loading="loading" :data="list" max-height="500" border style="width: 100%">
        <el-table-column label="" width="35" align="center">
          <template #default="scope">
            <el-radio v-model="tableRadio" :label="scope.row"><i /></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="分销商信息" align="center" prop="realName" width="190" />
        <el-table-column label="等级" align="center" prop="levelName"  />
        <el-table-column label="上级分销商" align="center" prop="superiorNameP1"  />
        <el-table-column label="销售金额" align="center" prop="addUpAmount"  />
        <el-table-column label="累计佣金" align="center" prop="addUpWages"  />
        <el-table-column label="下级分销商" align="center" prop="addUpDistributor"  />
        <el-table-column
          label="更新时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="190"
        />
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
      </ContentWrap>
    </div>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import { dateFormatter } from '@/utils/formatTime'
import * as DistributorApi from "@/api/distributor/merchant";
import * as DistributorLevelApi from "@/api/distributor/level";
import {DistributorData, LevelListItem} from "@/types/distributor";
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const tableRadio = ref('');
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
  status: 1,
  realName: ''
})
const levelList = ref<LevelListItem[]>([]);
const queryFormRef = ref() // 搜索的表单
const curId = ref()
/** 查询列表 */
const getList: ()=> Promise<void> = async () => {
  loading.value = true
  try {
    const data = await DistributorApi.getDistributorPage(queryParams)
    list.value = data.list
    for(let i = 0; i < data.list.length; i++){
      if(data.list[i].id == curId.value){
        tableRadio.value = data.list[i]
      }
    }
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


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = () => {
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', tableRadio.value)
}

/** 打开弹窗 */
const open = (id?: number) => {
  dialogVisible.value = true
  curId.value.id = id
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getList()
  getLevelList()
})
</script>

<style lang="scss" scoped>

</style>
