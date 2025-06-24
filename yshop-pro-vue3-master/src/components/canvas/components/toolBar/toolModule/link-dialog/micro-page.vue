<template>
  <div class="table-select">
    <el-form :inline="true" :model="formData" @submit.prevent>
      <el-form-item label="">
        <el-input
          v-model="formData.name"
          maxlength="20"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      max-height="500"
      border
      row-key="productId"
      style="width: 100%"
    >
      <el-table-column label="" width="40" align="center">
        <template #default="scope">
          <el-radio v-model="tableRadio" :label="scope.row" ><span/></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="页面名称" align="center" prop="name" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :hide-on-single-page="true"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/components/canvas/components/canvasShow/config/api';
import { sendReqMixin } from '@/components/canvas/components/canvasShow/config/mixin';
import {dateFormatter} from "@/utils/formatTime";
const { sendReq } = sendReqMixin();
const tableRadio = ref('');
const formData = ref({
  storeName: '',
  cateId: '',
});
const currentPage = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const loading = ref(false)
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const modelValue = ref(props.modelValue)

onMounted(() => {
  getTableData();
});

// 获取产品信息
function getTableData () {
  var paramsUrl = `${api.getCanvasPage}?pageNo=${currentPage.value}&pageSize=${pageSize.value}&state=1&isIndex=0`;
  if (formData.value.name) {
    paramsUrl += `&name=${formData.value.name}`;
  }
  const params = {
    url: paramsUrl,
    method: 'GET',
  };
  loading.value = true
  sendReq(params, (res) => {
    loading.value = false
    tableData.value = res.data.list;
    total.value = res.data.total;
    for(let i=0;i<tableData.value.length;i++){
      if(modelValue.value.id === tableData.value[i].id){
        tableRadio.value = tableData.value[i];
      }
    }
  });
}
// 搜索
function onSubmit () {
  getTableData();
}
// 每页条数改变
function handleSizeChange (val) {
  pageSize.value = val;
  getTableData();
}
// 当前页改变
function handleCurrentChange (val) {
  currentPage.value = val;
  getTableData();
}

watch(
  () => tableRadio.value,
  (val) => {
    if(val){
      emit('update:modelValue', {
        id:val.id,
        name:val.name
      })
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.table-select {
  .el-form{
    margin-bottom: 20px;
  }
  .el-pagination {
    padding: 0px;
    margin-top: 30px;
  }
  .el-table {
    .img {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
