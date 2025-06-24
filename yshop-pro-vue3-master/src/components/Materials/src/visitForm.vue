<template>
  <div>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="840">
    <video-player
      class="video-player vjs-big-play-centered"
      :src="url"
      poster=""
      crossorigin="anonymous"
      playsinline
      controls
      :volume="0.6"
      :width="800"
      :playback-rates="[0.7, 1.0, 1.5, 2.0]"
    />
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
    <el-image-viewer @close="closeImgViewer" :url-list="[url]" v-if="showImageViewer" />
  </div>
</template>
<script setup lang="ts">
import 'video.js/dist/video-js.css'
import { VideoPlayer } from '@videojs-player/vue'
const url = ref('')
const showImageViewer = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

/** 打开弹窗 */
const open = async (row?: any) => {
  url.value = row.url
  dialogTitle.value = row.name
  if(parseInt(row.type) === 1){
    showImageViewer.value = true
  } else {
    dialogVisible.value = true
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const closeImgViewer = () => {
  showImageViewer.value = false
}
</script>
