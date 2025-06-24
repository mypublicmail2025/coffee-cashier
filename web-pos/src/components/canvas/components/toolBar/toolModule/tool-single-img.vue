<template>
  <div class="module-box single-img">
    <div class="single-img__box">
      <el-upload
        drag
        :headers="headers"
        :action="fileUploadApi.fileUpload"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="single-img__img" />
        <div v-else>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            <em>选择图片</em>
          </div>
          <div class="el-upload__tip">
            {{ tip }}
          </div>
        </div>
      </el-upload>
      <div v-if="imageUrl" class="overlay">
        <i class="iconfont icon-chakan" @click="showImage" />
        <i class="iconfont icon-shanchu1" @click="delImage" />
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="图片展示">
      <img style="width: 100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue';
import api from '@/components/canvas/components/canvasShow/config/api';
import { UploadFilled } from '@element-plus/icons-vue'
import {getAccessToken, getTenantId} from "@/utils/auth";

const headers = ref({
  Authorization: 'Bearer ' + getAccessToken(),
  'tenant-id': getTenantId()
})

const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const fileUploadApi = ref({
  fileUpload: '',
});

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
  tip: {
    type: String,
    default: '建议尺寸: 1080*900px, 高度自适应'
  }
});
const { imageUrl, tip } = toRefs(props);
const emits = defineEmits(['update:imageUrl']);
onMounted(() => {
  fileUploadApi.value = api;
});
function handleAvatarSuccess (res) {
  emits('update:imageUrl', res.data);
}
function beforeAvatarUpload (file) {
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    ElMessage.error('上传图片大小不能超过 1MB!');
  }
  return isLt1M;
}
function showImage () {
  dialogImageUrl.value = imageUrl.value;
  dialogVisible.value = true;
}
function delImage () {
  emits('update:imageUrl', '');
}
</script>

<style lang="scss" scoped>
.single-img {
  &__box {
    position: relative;
    :deep(.el-upload) {
      width: 100%;
    }
    :deep(.el-upload-dragger) {
      width: 100%;
      .el-upload__text {
        line-height: 40px;
      }
      .el-upload__tip {
        line-height: 1em;
      }
    }
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
  &__img {
    position: absolute;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
