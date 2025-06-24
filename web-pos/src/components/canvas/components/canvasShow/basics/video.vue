<template>
  <div class="videoBox" :class="'terminal' + terminal" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="videoLeftBox">
      <h3 class="h3" v-if="componentContent.title">{{ componentContent.title }}</h3>
      <div class="content" v-if="removeTags(componentContent.mainBody)" v-html="componentContent.mainBody" />
    </div>
    <div class="videoRightBox">
      <video
        id="myVideo"
        class="myVideo"
        :src="componentContent.videoUrl"
        :poster="componentContent.coverImg"
        enable-danmu
        danmu-btn
        controls
      />
    </div>
    <div class="clear" />
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
const props = defineProps({
  terminal: {
    type: Number,
    default: 4,
  },
  componentContent: {
    type: Object,
    default () {
      return {};
    }
  },
})
const { terminal, componentContent } = toRefs(props)

// 清除html标签
const removeTags = (html)=>{
  return html.replace(/<[^>]*>/g, '');
}
</script>

<style lang="scss" scoped>
.videoBox {
  padding: 0 34px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .videoLeftBox {
    .h3 {
      font-size: 28px;
      color: #333333;
      margin-bottom: 10px;
    }
    p {
      color: #333333;
      font-size: 14px;
      line-height: 30px;
    }
    :deep(.content){
      .ql-size-large{
        font-size:  14px;
      }
      .ql-size-huge{
        font-size: 32.5px;
      }
      a{
        color: #2563eb;
        text-decoration: underline;
      }
    }
  }
  .videoRightBox {
    width: 50%;
    video {
      width: 100%;
    }
  }
  .clear {
    clear: both;
  }
}
.terminal1,
.terminal2,
.terminal3 {
  &.videoBox {
    display: block;
    .videoLeftBox {
      width: 100%;
      text-align: center;
      .content{
        margin-bottom: 20px;
      }
    }
    .videoRightBox {
      width: 100%;
    }
  }
}
</style>
