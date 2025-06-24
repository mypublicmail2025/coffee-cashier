<template>
  <div class="content">
    <el-upload
      v-loading="isUploading"
      :disabled="componentError"
      class="upload-demo"
      drag
      :headers="headers"
      :file-list="viewFileList"
      :name="name"
      :show-file-list="showFileList"
      :list-type="showFileListType"
      :multiple="multiple"
      :action="uploadUrl"
      :limit="limit"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :before-remove="handleBeforeRemove"
      :on-remove="handleRemove"
      :on-preview="handlePreviewOpen"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div v-if="!componentError" class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <div v-else class="error-text">组件配置错误，请查看控制台</div>
      <template #tip>
        <div class="el-upload__tip">
          文件大小不超过{{ limitSize }}m，文件类型为{{ types.toString() }}
        </div>
      </template>
    </el-upload>

    <!-- 预览 -->
    <el-dialog
      v-model="previewObj.show"
      title="预览"
      width="60%"
      :before-close="handlePreviewClose"
    >
      <div class="preview-content">
        <template
          v-if="previewObj.file && previewObj.file.type.includes('image')"
        >
          <el-image class="preview-item" :src="previewObj.file.url" />
        </template>
        <template
          v-if="previewObj.file && previewObj.file.type.includes('video')"
        >
          <video class="preview-item" controls :src="previewObj.file.url" />
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
import {getAccessToken, getTenantId} from "@/utils/auth";
import mime from 'mime'
import { watch } from 'vue'
import api from '../canvasShow/config/api'
const fullLoading = ref(null)
const props = defineProps({
  /** 上传时候表单的KEY */
  name: {
    type: String,
    default: () => 'file',
  },
  /** 限制上传数量 */
  limit: {
    type: Number,
    default: () => 5,
  },
  /** 限制的那张大小 单位M */
  limitSize: {
    type: Number,
    default: () => 5,
  },
  /** 是否多选 */
  multiple: {
    type: Boolean,
    default: () => true,
  },
  /** 是否展示文件列表 */
  showFileList: {
    type: Boolean,
    default: () => true,
  },
  /** 文件展示方式 text/picture/picture-card */
  showFileListType: {
    type: String,
    default: () => 'text',
  },
  /** 允许上传的文件尾缀 string[] */
  types: {
    type: Array,
    default: () => ['jpg', 'png', 'gif'],
  },
  /** 默认的文件列表 string[] */
  defaultFileList: {
    type: Array,
    default: () => [],
  },
  // /** 上传成功后端返回的字段名称 */
  // responseFileName: {
  //   type: String,
  //   default: () => 'url',
  // },
  /** 是否需要全屏loading */
  needFullScreenLoading: {
    type: Boolean,
    default: () => true,
  }
});
const {
  name,
  limit,
  limitSize,
  multiple,
  showFileList,
  showFileListType,
  types,
  defaultFileList,
  // responseFileName,
  needFullScreenLoading } = toRefs(props);
const emits = defineEmits(['change']);

const headers = ref({
  Authorization: 'Bearer ' + getAccessToken(),
  'tenant-id': getTenantId()
})
const uploadUrl = api.fileUpload
// 真实文件列表
const fileList = ref([])
// 默认展示的list，解决多上传只回调success一次的问题
const viewFileList = ref([])
// 组件是否部署错误
const componentError = ref(false)
// 是否正在上传
const isUploading = ref(false)
// 预览对象
const previewObj = ref({
  show: false,
  file: null,
})

/**
     * 检查type是否符合types的mime
     * @param type 文件后缀
     * @param types 可用文件后缀集合
     */
function handleCheckFileMime (type, types) {
  const typeMimes = types.map((item) => mime.getType(item))
  return typeMimes.includes(type)
}

function handleCheckFileSize (fileSize, limitSize) {
  const limitByteSize = limitSize * 1024 * 1024
  return limitByteSize > fileSize
}

/**
     * 上传之前的钩子
     * @param file
     * @return {undefined}
     */
function handleBeforeUpload (file) {
  // 检查mime
  const fileType =
        file.type ||
        mime.getType(file.name.slice(file.name.lastIndexOf('.') + 1))
  const checkFileMime = handleCheckFileMime(fileType, types.value)
  const checkFileSize = handleCheckFileSize(file.size, limitSize.value)
  !checkFileSize ? (file.isJumpRemove = true) : undefined
  !checkFileSize
    ? ElMessage.warning(`文件大小不得超出${limitSize.value}m`)
    : undefined
  !checkFileMime ? (file.isJumpRemove = true) : undefined
  !checkFileMime
    ? ElMessage.warning(`文件类型不在合法列表 ${types.value}`)
    : undefined
  if (checkFileSize && checkFileMime) {
    // 开启loading
    isUploading.value = true
    if (needFullScreenLoading.value) {
      fullLoading.value = ElLoading.service({
        background: `rgba(255,255,255,0.5)`,
        text: '上传中',
        fullscreen: true,
      })
    }
  }
  return checkFileSize && checkFileMime
}

/**
     * 上传成功钩子
     * @param response
     * @param file
     * @param fileList
     */
function handleUploadSuccess (response, file) {
  isUploading.value = false
  if (needFullScreenLoading.value) {
    fullLoading.value?.close()
  }
  const successObj = {
    url: response.data,
    name: file.name,
  }
  file.url = response.data
  fileList.value.push(successObj)
}

/**
     * 超出数量的钩子
     * @param files
     * @param fileList
     */
function handleExceed () {
  ElMessage.warning(`文件总数大于可上传数量 ${limit.value}`)
}

/**
     * 文件即将移除的钩子
     * @param file
     * @param fileList
     */
async function handleBeforeRemove (file) {
  // 如果是超出文件大小调用，放行
  if (file?.raw?.isJumpRemove) {
    return true
  }
  return await ElMessageBox.confirm(
    '此操作将会删除已上传的文件, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
}

/**
     * 移除文件的钩子
     */
function handleRemove (file) {
  if (file?.raw?.isJumpRemove) {
    return
  }
  fileList.value?.splice(
    fileList.value?.findIndex(
      (fileItem) =>
        file?.response?.data === fileItem.url ||
            file.url === fileItem.url
    ),
    1
  )
}

/**
     * 通知父组件
     */
function handleNotifyFather () {
  emits('change', fileList.value)
}

/**
     * 预览
     * 图片视频直接预览，其他下载
     * @param file
     */
function handlePreviewOpen (file) {
  if (!file.type) {
    file.type =
          mime.getType(file?.url?.slice(file?.url?.lastIndexOf('.') + 1)) ||
          mime.getType(file?.name?.slice(file?.name.lastIndexOf('.') + 1)) ||
          undefined
  }
  if (file.type.includes('image') || file.type.includes('video')) {
    previewObj.value.file = file
    previewObj.value.show = true
  } else {
    ElMessageBox.confirm('需要下载才能预览此文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        let htmlAnchorElement = document.createElement('a')
        htmlAnchorElement.download = file?.url.slice(
          file?.url.lastIndexOf('/') + 1
        )
        htmlAnchorElement.target = '_bank'
        htmlAnchorElement.href = file?.url
        htmlAnchorElement.click()
        htmlAnchorElement = null
      })
      .catch(() => {})
  }
}

function handlePreviewClose () {
  previewObj.value.file = null
  previewObj.value.show = false
}

watch(() => defaultFileList, () => {
// 判断类型
  const flag =
          Object.prototype.toString.call(defaultFileList.value) ===
            '[object Array]' &&
          defaultFileList.value.length > 0 &&
          Object.prototype.toString.call(defaultFileList.value[0]) !==
            '[object String]'
  if (flag) {
    componentError.value = true
    throw new Error('defaultFileList格式错误，应为string[]格式')
  } else {
    componentError.value = false
  }
  viewFileList.value = defaultFileList.value.map((defaultFilePath) => ({
    name: defaultFilePath,
    url: defaultFilePath,
  }))
  viewFileList.value.forEach((item) => {
    fileList.value.push(item)
  })
}, { immediate: true, deep: true })

watch(() => fileList, () => {
  handleNotifyFather()
}, { immediate: false, deep: true })

</script>

<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100% !important;

  .el-upload-dragger {
    width: 100% !important;
  }
}

.error-text {
  font-size: 18px;
  font-weight: bolder;
  color: red;
  animation: error-animation 2.5s ease-in-out infinite;
}

@keyframes error-animation {
  0%,
  100% {
    font-size: 18px;
    color: red;
  }
  25%,
  75% {
    font-size: 16px;
    color: #b9b1b1;
  }
  50% {
    font-size: 18px;
    color: #500000;
  }
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  .preview-item {
    min-width: 800px;
  }
}
</style>
