<template>
  <el-input v-model="modelValue" placeholder="请输入链接" @change="change"/>
</template>

<script setup>
import {ref} from "vue";


const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const modelValue = ref(props.modelValue)
const change = (val) => {
  emit('update:modelValue', val)
}

</script>

<style scoped lang="scss">
.el-radio{
  margin-bottom: 20px;
}
</style>
