<template>
  <el-cascader
    ref="cascader"
    style="width: 100%"
    :options="categoryList"
    :props="{
      checkStrictly: true,
      label: 'name',
      value: 'id',
      children: 'children',
    }"
    clearable
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/components/canvas/components/canvasShow/config/api';
import { sendReqMixin } from '@/components/canvas/components/canvasShow/config/mixin';
const { sendReq } = sendReqMixin();
const categoryList = ref([]);
const cascader = ref()
onMounted(() => {
  getCategory();
});

// 获取类别
function getCategory () {
  const params = {
    url: api.getClassify,
    method: 'GET',
  };
  sendReq(params, (res) => {
    categoryList.value = res.data;
  });
}

defineExpose({
  cascader
})
</script>
