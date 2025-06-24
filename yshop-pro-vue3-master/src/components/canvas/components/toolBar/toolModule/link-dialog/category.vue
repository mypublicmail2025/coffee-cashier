<template>
  <el-cascader
    ref="cascader"
    style="width: 100%"
    v-model="modelValue.val"
    @change="cascaderChange"
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
const cascader = ref(null)
const props = defineProps({
  modelValue: {
    type: Object,
    default: ()=>{}
  }
})

const emit = defineEmits(['update:modelValue'])
const modelValue = ref(props.modelValue)

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

function cascaderChange (val) {
  let nodesArr = cascader.value.getCheckedNodes()
  emit('update:modelValue', {
    val,
    id: val[val.length - 1],
    name:nodesArr[0].label
  })
}
</script>
