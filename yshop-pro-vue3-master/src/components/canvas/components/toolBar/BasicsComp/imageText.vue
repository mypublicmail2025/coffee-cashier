<template>
  <div class="imageTextTool">
    <h3 class="toolTit">图文</h3>
    <div class="toolBox">
      <tool-single-img
        v-model:imageUrl="activeComponent.componentContent.imageUrl"
        tip="建议尺寸: 500*300px, 高度自适应"
      />
      <tool-select-link
        v-model:linkObj="activeComponent.componentContent.linkObj"
        title="图片链接"
      />
      <tool-select
        v-model:linkValue="activeComponent.componentContent.positionValue"
        title="PC图片位置"
        :options="positionOpt"
      />
      <div class="textTit">文本设置</div>
      <div class="itemBox">
        <label>标题</label>
        <el-input
          v-model="activeComponent.componentContent.title"
          maxlength="20"
          placeholder="请输入内容"
        />
      </div>
      <div class="itemBox">
        <label>正文</label>
        <my-editor
          v-model:content="activeComponent.componentContent.content"
          @textChange="textChange"
        />
      </div>
    </div>
    <BgSelect :hasComBgColor="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ToolSingleImg from '../toolModule/tool-single-img.vue';
import ToolSelect from '../toolModule/tool-select.vue';
import ToolSelectLink from '../toolModule/tool-select-link.vue';
import myEditor from '@/components/canvas/components/editor/index.vue';
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);
const positionOpt = ref([
  {
    value: 'left',
    label: '左图右文',
  },
  {
    value: 'right',
    label: '右图左文',
  },
  {
    value: 'top',
    label: '上图下文',
  },
  {
    value: 'bottom',
    label: '下图上文',
  },
])

//  编辑器改变回调
function textChange (val) {
  activeComponent.value.componentContent.content = val
}
</script>

<style lang="scss" scoped>
.imageTextTool {
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
    .textTit {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #333333;
      margin-top: 30px;
      font-weight: bold;
    }
    .itemBox {
      label {
        font-size: 14px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      margin-bottom: 15px;
      :deep(.el-select) {
        display: block;
      }
    }
    .imgBox {
      position: relative;
      .overlay {
        display: none;
      }
      &:hover .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
          padding: 5px;
          margin: 0 5px;
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }
  .ql-container {
    height: 150px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .el-upload__tip {
    height: auto;
    margin-top: 0;
    line-height: normal;
  }
  .el-upload {
    width: 100%;
  }
  .el-upload-dragger {
    width: 100%;
    position: relative;
    .avatar {
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      position: absolute;
      margin: auto;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
