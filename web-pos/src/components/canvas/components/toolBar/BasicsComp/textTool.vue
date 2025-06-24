<template>
  <div class="textTool">
    <h3 class="toolTit">文本设置</h3>
    <div class="toolBox">
      <div class="itemBox">
        <label>标题内容</label>
        <el-input
          v-model="activeComponent.componentContent.title"
          maxlength="20"
          placeholder="请输入内容"
        />
      </div>
      <div class="itemBox">
        <label>描述内容</label>
        <el-input
          v-model="activeComponent.componentContent.describe"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          resize="none"
          maxlength="200"
        />
      </div>
    </div>
    <div class="operationBox">
      <div class="itemBox">
        <div class="Tit">显示位置</div>
        <div class="Info">居{{ positionText }}显示</div>
        <div class="modifyBox">
          <span
            class="iconfont"
            :class="{
              textActive: activeComponent.componentContent.textPos === 'left',
            }"
            @click="textPosition((type = 'left'))"
          >&#xec86;</span>
          <span
            class="iconfont"
            :class="{
              textActive: activeComponent.componentContent.textPos === 'center',
            }"
            @click="textPosition((type = 'center'))"
          >&#xe619;</span>
          <span
            class="iconfont"
            :class="{
              textActive: activeComponent.componentContent.textPos === 'right',
            }"
            @click="textPosition((type = 'right'))"
          >&#xec82;</span>
        </div>
      </div>
      <div class="itemBox">
        <div class="Tit">标题大小</div>
        <div class="modifyBox fontSize">
          <font-size-select
            v-model:fontSize="activeComponent.componentContent.fontSizeNum"
          />
        </div>
      </div>
      <div class="itemBox">
        <div class="Tit">描述大小</div>
        <div class="modifyBox fontSize">
          <font-size-select
            v-model:fontSize="activeComponent.componentContent.describeSizeNum"
          />
        </div>
      </div>
      <div class="itemBox">
        <div class="Tit">标题粗细</div>
        <div
          class="Info"
          v-text="
            activeComponent.componentContent.textFontW === 'bold'
              ? '加粗体'
              : '常规体'
          "
        />
        <div class="modifyBox fontSize">
          <span
            class="iconfont"
            :class="{
              textActive: activeComponent.componentContent.textFontW === 'bold',
            }"
            @click="changeFontW((type = 'bold'))"
          >&#xe649;</span>
          <span
            class="iconfont"
            :class="{
              textActive:
                activeComponent.componentContent.textFontW === 'normal',
            }"
            @click="changeFontW((type = 'normal'))"
          >&#xe8c2;</span>
        </div>
      </div>
      <div class="itemBox">
        <div class="Tit">描述粗细</div>
        <div
          class="Info"
          v-text="
            activeComponent.componentContent.describeFontW === 'bold'
              ? '加粗体'
              : '常规体'
          "
        />
        <div class="modifyBox">
          <span
            class="iconfont"
            :class="{
              textActive:
                activeComponent.componentContent.describeFontW === 'bold',
            }"
            @click="changeInfoFontW((type = 'bold'))"
          >&#xe649;</span>
          <span
            class="iconfont"
            :class="{
              textActive:
                activeComponent.componentContent.describeFontW === 'normal',
            }"
            @click="changeInfoFontW((type = 'normal'))"
          >&#xe8c2;</span>
        </div>
      </div>
      <div class="itemBox">
        <div class="Tit">标题颜色</div>
        <div class="Info">{{ activeComponent.componentContent.titColor }}</div>
        <div class="modifyBox">
          <div class="colorBox">
            <span @click="resetColor">重置</span>
            <div class="block">
              <el-color-picker
                v-model="activeComponent.componentContent.titColor"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="itemBox">
        <div class="Tit">描述颜色</div>
        <div class="Info">
          {{ activeComponent.componentContent.describeColor }}
        </div>
        <div class="modifyBox">
          <div class="colorBox">
            <span @click="resetDescribeColor">重置</span>
            <div class="block">
              <el-color-picker
                v-model="activeComponent.componentContent.describeColor"
              />
            </div>
          </div>
        </div>
      </div>
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
      <div class="itemBox">
        <div class="Tit">底部分割线</div>
        <div
          class="Info"
          v-text="activeComponent.componentContent.showLine ? '显示' : '隐藏'"
        />
        <div class="modifyBox">
          <el-checkbox
            v-model="activeComponent.componentContent.showLine"
          />
        </div>
      </div>
      <div class="itemBox">
        <div class="Tit">查看更多</div>
        <div
          class="Info"
          v-text="activeComponent.componentContent.showMore ? '显示' : '隐藏'"
        />
        <div class="modifyBox">
          <el-checkbox
            v-model="activeComponent.componentContent.showMore"
          />
        </div>
      </div>
      <div v-show="activeComponent.componentContent.showMore" class="moreBox">
        <div class="radio">
          <el-radio
            v-model="activeComponent.componentContent.styleValue"
            label="1"
          >样式一</el-radio>
          <el-radio
            v-model="activeComponent.componentContent.styleValue"
            label="2"
          >样式二</el-radio>
          <el-radio
            v-model="activeComponent.componentContent.styleValue"
            label="3"
          >样式三</el-radio>
        </div>
        <div class="link">
          <tool-select-link
            v-model:linkObj="activeComponent.componentContent.linkObj"
            style-type="1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FontSizeSelect from '../toolModule/font-size-select.vue'
import ToolSelectLink from '../toolModule/tool-select-link.vue'
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);

// 修改文字对齐方向
function textPosition (type) {
  activeComponent.value.componentContent.textPos = type
}
// 修改文本字体粗细
function changeFontW (type) {
  activeComponent.value.componentContent.textFontW = type
}
// 修改描述文字粗细
function changeInfoFontW (type) {
  activeComponent.value.componentContent.describeFontW = type
}
// 重置文本颜色
function resetColor () {
  activeComponent.value.componentContent.titColor = '#333333'
}
// 重置描述颜色
function resetDescribeColor () {
  activeComponent.value.componentContent.describeColor = '#333333'
}
// 重置背景颜色
function resetBgColor () {
  activeComponent.value.componentContent.bgColor = '#FFFFFF'
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
    border-bottom: 1px solid #eeeeee;
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
        /*span:last-child {*/
        /*  border-right: 1px solid #E8EAEC;*/
        /*}*/
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
      .fontSize {
        span:nth-child(1) {
          font-size: 16px;
        }
        span:nth-child(2) {
          font-size: 14px;
        }
        span:nth-child(3) {
          font-size: 12px;
        }
      }
    }
    .moreBox {
      border: 1px solid #e8eaec;
      border-radius: 4px;
      padding: 20px 10px;
      .radio {
        margin-bottom: 20px;
      }
      .el-radio {
        margin-right: 10px;
      }
      .link {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .block {
    height: 30px;
  }
  :deep(.el-color-picker__trigger) {
    width: 45px;
    height: 26px;
  }
  :deep(.el-icon-arrow-down:before) {
    display: none;
  }
}
</style>
