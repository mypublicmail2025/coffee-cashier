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
       name: '商城首页',
       value: 'home'
     },
     {
       name: '分类',
       value: 'classify'
     },
     {
       name: '购物车',
       value: 'cart'
     },
     {
       name: '个人中心',
       value: 'my'
     },
     {
       name: '我的订单',
       value: 'myOrder'
     },
     {
       name: '售后记录',
       value: 'afterSales'
     },
     {
       name: '签到页面',
       value: 'signIn'
     },
     {
       name: '会员中心',
       value: 'vip'
     },
     {
       name: '充值页面',
       value: 'recharge'
     },
     {
       name: '我的足迹',
       value: 'footprints'
     },
     {
       name: '我的收藏',
       value: 'collect'
     },
     {
       name: '我的推广',
       value: 'promotion'
     },
     {
       name: '联系客服',
       value: 'customerService'
     },
     {
       name: '地址列表',
       value: 'addressList'
     },
     {
       name: '订单核销',
       value: 'orderVerification'
     },
     {
       name: '我的资料',
       value: 'myProfile'
     }
   ]
 )

</script>

<style scoped lang="scss">
.el-radio{
  margin-bottom: 20px;
}
</style>
