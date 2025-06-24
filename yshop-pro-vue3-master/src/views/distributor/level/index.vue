<script setup lang="ts">
import * as DistributorLevelApi from "@/api/distributor/level";
import { ref } from "vue";
import {LevelListItem} from "@/types/distributor";
import LevelForm from "@/views/distributor/level/levelForm.vue";
// const message = useMessage() // 消息弹窗
// const { t } = useI18n() // 国际化
interface QueryParams {
  pageNo: number
  pageSize: number
}

const loading = ref<boolean>(true);
const total = ref<number>(0);
const list = ref<LevelListItem[]>([]);

const queryParams: QueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DistributorLevelApi.getLevelPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 新增和编辑等级
const formRef = ref()
const openForm = (type: string, id?:number) => {
  formRef.value?.open(type, id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-form-item>
      <el-button
        type="primary"
        plain
        @click="openForm('create')"
      >
        <Icon icon="ep:plus" class="mr-5px" /> 新增
      </el-button>
    </el-form-item>
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column label="等级" align="center" prop="level" width="190" />
      <el-table-column label="等级名称" align="center" prop="name"  />
      <el-table-column label="分销商数" align="center" prop="count"  />
      <el-table-column label="一级佣金比例" align="center" prop="firstWages">
        <template #default="scope">
          <span>{{scope.row.firstWages}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="二级佣金比例" align="center" prop="secondWages">
        <template #default="scope">
          <span>{{scope.row.secondWages}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
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
  <LevelForm ref="formRef" @success="getList"/>
</template>

<style lang="scss" scoped>
.tableBox {
  margin-bottom: 50px;
}
</style>
