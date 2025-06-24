<template>
  <div class="product-select">
    <el-form :inline="true" :model="formData">
      <el-form-item label="">
        <el-input
          v-model="formData.storeName"
          maxlength="20"
          placeholder="请输入商品名称"
        />
      </el-form-item>
      <!--      <el-form-item label="上架状态">-->
      <!--        <el-select v-model="formData.status" placeholder="请选择">-->
      <!--          <el-option label="全部" value=""></el-option>-->
      <!--          <el-option label="上架" value="1"></el-option>-->
      <!--          <el-option label="下架" value="0"></el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="官方分类">
        <el-cascader
          ref="cascader"
          v-model="formData.cateId"
          :options="categoryList"
          :props="{
            checkStrictly: true,
          label: 'name',
          value: 'id',
          children: 'children',
          }"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      max-height="500"
      border
      row-key="productId"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="isMultiple"
        width="40"
        type="selection"
        :reserve-selection="true"
        fixed="left"
      />
      <el-table-column v-else label="" width="40" align="center">
        <template #default="scope">
          <el-radio v-model="tableRadio" :label="scope.row"><i /></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="产品主图" width="180" align="center">
        <template #default="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.image"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column prop="storeName" label="产品名称" width="180" />
      <el-table-column prop="price" label="售价" />
<!--      <el-table-column prop="originalPrice" label="原价" />-->
      <el-table-column prop="stock" label="库存" />
      <el-table-column prop="sales" label="销量" />
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
import { ref, toRefs, onMounted } from 'vue';
import { checkEmptyChild } from '@/components/canvas/config/common';
import api from '@/components/canvas/components/canvasShow/config/api';
import { sendReqMixin } from '@/components/canvas/components/canvasShow/config/mixin';
const { sendReq } = sendReqMixin();
const tableRadio = ref('');
const formData = ref({
  storeName: '',
  cateId: '',
});
const currentPage = ref(1);
const total = ref(0);
const pageSize = ref(10);
const categoryList = ref([]);
const tableData = ref([]);
const multipleSelection = ref([]);
const cascader = ref();
const props = defineProps({
  selectedRows: {
    type: Array,
    default: () => [],
  },
  isMultiple: {
    type: Boolean,
    default: false,
  },
});
const { isMultiple } = toRefs(props);

onMounted(() => {
  getCategory();
  getTableData();
});

// 获取类别
function getCategory () {
  const params = {
    url: api.getClassify,
    method: 'GET',
  };
  sendReq(params, (res) => {
    categoryList.value = res.data;
    checkEmptyChild(categoryList.value);
  });
}
// 获取产品信息
function getTableData () {
  var paramsUrl = `${api.getProducts}?pageNo=${currentPage.value}&pageSize=${pageSize.value}`;
  if (formData.value.storeName) {
    paramsUrl += `&storeName=${formData.value.storeName}`;
  }
  const nodesObj = cascader.value.getCheckedNodes();
  if (nodesObj && nodesObj.length !== 0) {
    var categoryId = nodesObj[0].value;
    paramsUrl += `&cateId=${categoryId}`;
  }
  const params = {
    url: paramsUrl,
    method: 'GET',
  };
  sendReq(params, (res) => {
    tableData.value = res.data.list;
    total.value = res.data.total;
    // 表格斌值
    // if(_this.selectedRows.length > 0){
    //   _this.selectedRows.forEach(row => {
    //     this.$refs.multipleTable.toggleRowSelection(row,true);
    //   });
    // }
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
// 多选改变
function handleSelectionChange (val) {
  multipleSelection.value = val;
}
defineExpose({
  tableRadio,
  multipleSelection
})
</script>

<style lang="scss" scoped>
.product-select {
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
