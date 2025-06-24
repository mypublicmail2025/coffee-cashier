<template>
  <div class="textTool">
    <h3 class="toolTit">辅助分割</h3>
    <div class="operationBox">
      <div class="itemBox">
        <div class="Tit">背景颜色</div>
        <div class="Info">{{ activeComponent.componentContent.bgColor }}</div>
        <div class="modifyBox">
          <div class="colorBox">
            <span @click="resetBgColor">重置</span>
            <div class="block">
              <el-color-picker
                v-model="activeComponent.componentContent.bgColor"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="itemBox flexStyle">
        <div class="Tit">间隙高度</div>
        <div class="block">
          <el-slider
            v-model="activeComponent.componentContent.height"
            :show-input-controls="false"
            input-size="mini"
            show-input
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);
// 重置背景颜色
function resetBgColor () {
  activeComponent.value.componentContent.bgColor = ''
}
</script>
<style lang="scss" scoped>
.textTool {
  padding: 20px 20px 0 20px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .operationBox {
    margin-top: 30px;
    .itemBox {
      font-size: 14px;
      display: flex;
      margin-bottom: 20px;
      align-items: center;
      .Tit {
        color: #888888;
        margin-right: 10px;
        width: 70px;
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
        .textActive {
          border: 1px solid var(--el-color-primary);
          color: var(--el-color-primary);
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
    .flexStyle {
      display: flex;
      align-items: center;
      height: 40px;
      label {
        margin-right: 20px;
        line-height: 40px;
      }
      .block {
        flex: 1;
      }
      :deep(.el-slider){
        .el-slider__input{
          width: 50px;
        }
        .el-slider__runway{
          height: 4px;
          margin: 12px 30px 12px 0;
        }
        .el-slider__bar {
          height: 4px;
        }
        .el-slider__button-wrapper {
          top: -17px;
        }
        .el-slider__button{
          width: 12px;
          height: 12px;
        }
        .el-input-number.is-without-controls .el-input__wrapper{
          padding: 0;
        }
      }
    }
  }
  .block {
    height: 30px;
  }
}
</style>
