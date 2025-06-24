<template>
  <div class="couponTool">
    <h3 class="toolTit">优惠券</h3>
    <div class="toolBox">
      <tool-coupon
        v-model:selectedCoupon="activeComponent.componentContent.selectedCoupon"
        v-model:couponList="activeComponent.componentContent.couponList"
      />
    </div>
    <div class="styleSelectLine">
      <div class="blockTit">
        <span>排列样式</span>
        <span>{{ activeComponent.componentContent.arrangeType }}</span>
      </div>
      <div class="selectCompose">
        <div class="composeList">
            <span
              v-for="item of arrangeList"
              :key="item.id"
              class="item iconfont"
              :class="{
                active:
                  activeComponent.componentContent.arrangeType === item.name,
              }"
              @click="selectArrange(item)"
              v-html="item.Icon"
            />
        </div>
      </div>
    </div>
    <BgSelect :hasComBgColor="false" />
  </div>
</template>

<script setup>
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import ToolCoupon from '../toolModule/tool-coupon.vue'
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
import {ref} from "vue";
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);

const arrangeList = ref([
  {
    id: 1,
    type: 'L1',
    name: '一行一个',
    Icon: '&#xe62a'
  },
  {
    id: 2,
    type: 'L2',
    name: '多行多列',
    Icon: '&#xe625',
  },
  {
    id: 3,
    type: 'L3',
    name: '横向滑动',
    Icon: '&#xe624;',
  }
])

// 布局选择
function selectArrange (item) {
  activeComponent.value.componentContent.arrangeType = item.name
}
</script>

<style lang="scss" scoped>
.couponTool {
  padding: 20px 0px 0 20px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .toolBox {
    padding-bottom: 10px;
    .itemBox {
      label {
        font-size: 14px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      margin-bottom: 15px;
    }
  }
  .block {
    .blockTit {
      padding-top: 20px;
      span {
        margin-right: 16px;
      }
      span:last-child {
        color: var(--el-color-primary);
      }
    }
  }
  .colorBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .blockTit {
      padding-top: 0;
    }
  }
  .topLine {
    border-top: 1px solid #eeeeee;
  }
  .composeList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 30px;
    padding-top: 20px;
    span {
      width: 50px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e8eaec;
      color: #999999;
      font-size: 18px;
      text-align: center;
      cursor: pointer;
      font-size: 24px;
    }
    span.active {
      color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);
    }
    span:hover {
      color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);
    }
  }
  .selectColor {
    display: flex;
    align-items: center;
    .colorList {
      display: flex;
      align-items: center;
      div {
        padding: 3px;
        border: 1px solid #eeeeee;
        border-radius: 50%;
        font-style: normal;
        margin-right: 10px;
        cursor: pointer;
        span {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #eeeeee;
          display: block;
        }
        &:nth-child(1) {
          span {
            background: #ec4b42;
          }
        }
        &:nth-child(2) {
          span {
            background: var(--el-color-primary);
          }
        }
        &:nth-child(3) {
          span {
            background: #86a7ff;
          }
        }
        &:nth-child(4) {
          span {
            background: #808080;
          }
        }
      }
      div.active {
        &:nth-child(1) {
          border-color: #ec4b42;
        }
        &:nth-child(2) {
          border-color: var(--el-color-primary);
        }
        &:nth-child(3) {
          border-color: #86a7ff;
        }
        &:nth-child(4) {
          border-color: #808080;
        }
      }
    }
  }
  .showInvBox {
    p {
      color: #999999;
      font-size: 14px;
    }
  }
  .showInvalid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 13px 0;
    .blockTit {
      padding-top: 0;
    }
  }
}
</style>
