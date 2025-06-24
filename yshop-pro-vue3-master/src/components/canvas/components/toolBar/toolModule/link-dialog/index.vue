<template>
  <el-dialog v-model="visible" width="1200px" title="选择链接">
    <div class="link-main">
      <div class="link-left">
        <div class="link-group" v-for="(item,index) in typeList" :key="index">
          <h3 class="h3">{{item.title}}</h3>
          <ul class="link-list">
            <li class="item" :class="{active: activeValue.type === item2.value}" v-for="(item2,index2) in item.list" :key="index2" @click="typeClick(item2)">{{item2.name}}</li>
          </ul>
        </div>
      </div>
      <div class="link-right">
        <basePage v-if="activeValue.type === 'basePage'" v-model="activeValue.value" />
        <marketingPage v-if="activeValue.type === 'marketingPage'" v-model="activeValue.value" />
        <microPage v-if="activeValue.type === 'microPage'" v-model="activeValue.value" />
        <category v-if="activeValue.type === 'goodsCategory'" v-model="activeValue.value" />
        <goods v-if="activeValue.type === 'goods'" v-model="activeValue.value" />
        <activityGoods v-if="activeValue.type === 'groupGoods'" v-model="activeValue.value" :type="1" />
        <activityGoods v-if="activeValue.type === 'seckillGoods'" v-model="activeValue.value" :type="2" />
        <activityGoods v-if="activeValue.type === 'discountGoods'" v-model="activeValue.value" :type="3" />
        <customLink v-if="activeValue.type === 'customLink'" v-model="activeValue.value" />
      </div>
    </div>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref} from "vue";
import basePage from "./base-page.vue";
import marketingPage from "./marketing-page.vue";
import microPage from "./micro-page.vue";
import category from "./category.vue";
import activityGoods from "./activity-goods.vue";
import customLink from "./custom-link.vue";

const visible = ref(false);
const activeValue = ref({
  type: '',
  value: ''
});
const typeList = ref([{
  title: '商城页面',
  list: [{
    name: '基础页面',
    value: 'basePage',
  }, {
    name: '营销页面',
    value: 'marketingPage',
  }, {
    name: '微页面',
    value: 'microPage',
  }]
}, {
  title: '商品页面',
  list: [{
    name: '商品分类',
    value: 'goodsCategory',
  }, {
    name: '商品',
    value: 'goods',
  }, {
    name: '拼团商品',
    value: 'groupGoods',
  }, {
    name: '秒杀商品',
    value: 'seckillGoods',
  }, {
    name: '折扣商品',
    value: 'discountGoods',
  }]
}, {
  title: '自定义页面',
  list: [{
    name: '自定义链接',
    value: 'customLink',
  }]
}]);

const emit = defineEmits(['submit'])

function typeClick(item){
  activeValue.value.type = item.value;
  activeValue.value.value = activeValue.value.type === 'customLink'? '' : {};
}

function openDialog(){
  visible.value = true;
}

function submit(){
  emit('submit', activeValue.value);
  console.log(activeValue.value,'activeValue')
  visible.value = false;
}

defineExpose({
  openDialog
})
</script>

<style scoped lang="scss">
.link-main{
  display: flex;
  .link-left{
    border-right: 1px solid #f0f3f4;
    width: 186px;
    padding: 20px 20px 20px 0;
    .link-group{
      margin-bottom: 20px;
      .h3 {
        padding-left: 20px;
        height: 35px;
        line-height: 35px;
        font-size: 16px;
        color: #333333;
        position: relative;
        &:before {
          content: "";
          border-left: 5px solid var(--el-color-primary);
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          position: absolute;
          left: 10px;
          top: 50%;
          margin-top: -4px;
        }
      }
      .link-list{
        .item{
          padding: 5px 20px;
          cursor: pointer;
          border-radius: 8px;
          margin-bottom: 2px;
          &:hover,&.active{
            background-color: #f0f3f4;
          }
        }
      }
    }
  }
  .link-right{
    flex: 1;
    padding: 20px;
  }
}
</style>
