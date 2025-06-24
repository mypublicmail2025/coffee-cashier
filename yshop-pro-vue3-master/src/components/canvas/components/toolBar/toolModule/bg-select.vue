<template>
  <div class="bg-warp">
    <div class="title">样式设置</div>
    <div class="itemBox" v-if="hasPageBgColor">
      <div class="Tit">页面背景颜色</div>
      <div class="Info">{{ activeComponent.componentContent.pageBgColor }}</div>
      <div class="modifyBox">
        <div class="colorBox">
          <span @click="resetPageBgColor">重置</span>
          <div class="block">
            <el-color-picker
              v-model="activeComponent.componentContent.pageBgColor"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="itemBox" v-if="hasComBgColor">
      <div class="Tit">组件背景颜色</div>
      <div class="Info">{{ activeComponent.componentContent.comBgColor }}</div>
      <div class="modifyBox">
        <div class="colorBox">
          <span @click="resetComBgColor">重置</span>
          <div class="block">
            <el-color-picker
              v-model="activeComponent.componentContent.comBgColor"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import {canvasStore} from "@/components/canvas/store/canvas";
import {storeToRefs} from "pinia";
const canvasStoreObj = canvasStore();
const {activeComponent} = storeToRefs(canvasStoreObj);

const props = defineProps({
  hasPageBgColor: {
    type: Boolean,
    default: true,
  },
  hasComBgColor: {
    type: Boolean,
    default: true,
  },
})
const { hasPageBgColor, hasComBgColor } = toRefs(props)

// 重置背景颜色
function resetPageBgColor () {
  activeComponent.value.componentContent.bgColor = '#F5F5F5'
}

// 重置背景颜色
function resetComBgColor () {
  activeComponent.value.componentContent.bgColor = '#FFFFFF'
}
</script>

<style lang="scss" scoped>
.bg-warp{
  margin-top: 30px;
  .title{
    font-size: 16px;
    margin-bottom: 10px;
  }
  .itemBox {
    font-size: 14px;
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    .Tit {
      color: #888888;
      margin-right: 10px;
      width: 90px;
    }
    .Info {
      color: #222222;
    }
    .modifyBox {
      text-align: right;
      margin-left: auto;
      span {
        height: 26px;
        line-height: 26px;
        float: left;
        display: block;
        text-align: center;
        cursor: pointer;
        width: 30px;
        border: 1px solid #e8eaec;
      }
      .colorBox {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        span {
          margin-right: 10px;
          cursor: pointer;
          border: none;
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
