<template>
  <div class="videoTool">
    <h3 class="toolTit">视频</h3>
    <div class="toolBox">
      <div class="itemBox">
        <label>视频地址</label>
        <Upload
          :default-file-list="defaultVideoList"
          :limit-size="20"
          :multiple="false"
          :types="['mp4']"
          :limit="1"
          @change="(fileList) => handleUploadChange(fileList, 'videoUrl')"
        />
        <!--        <el-input v-model="activeComponent.componentContent.videoUrl" placeholder="请输入内容"></el-input>-->
      </div>
      <div class="itemBox">
        <label>覆盖页地址（APP）</label>
        <Upload
          :default-file-list="defaultImgList"
          :limit-size="20"
          :multiple="false"
          :types="['jpg', 'jpeg', 'png', 'gif']"
          :limit="1"
          @change="(fileList) => handleUploadChange(fileList, 'coverImg')"
        />
        <!--        <el-input v-model="activeComponent.componentContent.videoUrl" placeholder="请输入内容"></el-input>-->
      </div>
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
          v-model:content="activeComponent.componentContent.mainBody"
          @text-change="textChange"
        />
      </div>
    </div>
    <BgSelect :hasComBgColor="false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Upload from '@/components/canvas/components/Upload/index.vue';
import myEditor from '@/components/canvas/components/editor/index.vue';
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);
onMounted(() => {
  activeComponent.value.componentContent.videoUrl &&
    defaultVideoList.value.push(
      activeComponent.value.componentContent.videoUrl
    );
  activeComponent.value.componentContent.coverImg &&
    defaultImgList.value.push(activeComponent.value.componentContent.coverImg);
});
const defaultVideoList = ref([]);
const defaultImgList = ref([]);
// 上传改变回调
function handleUploadChange (fileList, field) {
  activeComponent.value.componentContent[field] =
    fileList.length > 0 ? fileList[0].url : '';
  console.log(fileList, field, activeComponent.value,'activeComponent.value')
}

//  编辑器改变回调
function textChange (val) {
  activeComponent.value.componentContent.mainBody = val
}
</script>

<style lang="scss" scoped>
.videoTool {
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
  }
}
</style>
