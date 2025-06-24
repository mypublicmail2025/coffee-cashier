<template>
  <ContentWrap>
    <div class="search-row flex justify-between">
      <div>
        <el-button
            plain
            type="primary"
            @click="doCreateStoreBackupRecord"
        >备份
        </el-button>
        <el-button
            plain
            :disabled="tableList.length<=0"
            type="danger"
            @click="doRollbackRecord"
        >还原备份
        </el-button>
        <el-button
            plain
            type="warning"
            v-if="currentRow && false"
            @click="handleClearCurrent"
        >清除选择
        </el-button>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap>
    <el-table
        ref="tableRef"
        highlight-current-row
        v-loading="loading"
        :data="tableList"
        @current-change="handleCurrentChange"
    >
      <el-table-column
          label="ID"
          align="center"
          prop="id"
      />

      <el-table-column
        label="创建人ID"
        align="center"
        prop="creator"
      />
      <el-table-column
        label="创建人名称"
        align="center"
        prop="creatorName"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="修改人ID"
        align="center"
        prop="updater"
      />
      <el-table-column
        label="修改人名称"
        align="center"
        prop="updaterName"
      />
      <el-table-column
        label="修改时间"
        align="center"
        prop="updateTime"
        :formatter="dateFormatter"
      />
    </el-table>
    <Pagination
        :total="tableTotal"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="doGetList"
    />
  </ContentWrap>
</template>

<script setup>
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import { createStoreBackupRecord, getStoreBackupRecordPage, rollbackBackupRecord } from "@/api/system/storeBackupRecord";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateFormatter } from "@/utils/formatTime";
import { CACHE_KEY, useCache } from "@/hooks/web/useCache";

const {wsCache} = useCache();
const tableRef = ref()
const loading = ref(true) // 列表的加载中
const tableTotal = ref(0) // 总数
const tableList = ref([]) // 表格

// 分页参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
})

/**
 * 获取列表
 * @returns {Promise<void>}
 */
async function doGetList() {
  try {
    loading.value = true
    const {list, total} = await getStoreBackupRecordPage(queryParams);
    tableList.value = list
    tableTotal.value = total
  } finally {
    loading.value = false
  }
}

/**
 * 备份
 * @returns {Promise<void>}
 */
function doCreateStoreBackupRecord() {
  const {flag, time} = verifyTime(0);
  if (!flag) {
    ElMessage.warning(`${ time }秒后才能操作`)
    return
  }
  ElMessageBox.confirm('确定要备份吗？', '提示', {
    confirmButtonText: '备份',
    cancelButtonText: '取消',
    type: "info",
  }).then(async () => {
    await createStoreBackupRecord()
    ElMessage.success('备份成功')
    wsCache.set(CACHE_KEY.BACK_UP, Date.now())
    queryParams.pageNo = 1
    await doGetList()
  }).catch(() => {
  })
}

/**
 * 还原备份
 */
function doRollbackRecord() {
  const {flag, time} = verifyTime(1);
  if (!flag) {
    ElMessage.warning(`${ time }秒后才能操作`)
    return
  }
  ElMessageBox.confirm('确定要还原备份吗？', '警告', {
    confirmButtonText: '备份',
    cancelButtonText: '取消',
    type: "warning",
  }).then(async () => {
    await rollbackBackupRecord()
    ElMessage.success('还原成功')
    wsCache.set(CACHE_KEY.RESTORE, Date.now())
    queryParams.pageNo = 1
    await doGetList()
  }).catch(() => {
  })
}

/**
 * 校验时间
 * @param {0|1} type 0备份 1还原
 * @returns {{flag:boolean,time:number}}
 */
function verifyTime(type) {
  const delayTime = 5 * 1000 * 60
  const nowTime = Date.now()
  const doTime = wsCache.get(type === 0 ? CACHE_KEY.BACK_UP : CACHE_KEY.RESTORE);
  const diff = nowTime - doTime
  if (!doTime) return ({
    flag: true,
    time: 0
  })
  if (diff < delayTime) return ({
    flag: false,
    time: Math.floor((delayTime - diff) / 1000)
  })
  else return ({
    flag: true,
    time: 0
  })
}

/** 👇选中行相关👇 */
const currentRow = ref(void (0)) // 当前选中的行

/**
 * 选中行
 * @param val
 */
function handleCurrentChange(val) {
  currentRow.value = val
}

/**
 * 清除选中
 */
function handleClearCurrent() {
  tableRef.value.setCurrentRow()
}

onMounted(() => {
  doGetList()
})
</script>
