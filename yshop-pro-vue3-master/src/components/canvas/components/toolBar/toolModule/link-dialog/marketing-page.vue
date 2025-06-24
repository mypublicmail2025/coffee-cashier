<template>
  <el-radio-group v-model="modelValue" @change="radioChange">
    <el-radio v-for="item in radioList" :key="item.value" :label="item" border>{{item.name}}</el-radio>
  </el-radio-group>
</template>

<script setup>
import {ref, reactive} from "vue";


const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const modelValue = ref(props.modelValue)
const radioChange = (val) => {
  emit('update:modelValue', val)
}

 const radioList = reactive(
   [
     {
       name: '产品中心',
       value: 'productCenter'
     },
     {
       name: '秒杀专区',
       value: 'seckillArea'
     },
     {
       name: '拼团专区',
       value: 'groupArea'
     },
     {
       name: '折扣专区',
       value: 'discountArea'
     },
     {
       name: '积分商城',
       value: 'integral'
     },
     {
       name: '领券中心',
       value: 'coupon'
     },
   ]
 )

</script>

<style scoped lang="scss">
.el-radio{
  margin-bottom: 20px;
}
</style>
