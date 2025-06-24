<template>
  <div
    class="imageText"
    :class="['terminal' + terminal, 'pos-' + componentContent.positionValue]"
    :style="{ backgroundColor: componentContent.pageBgColor }"
  >
    <div class="img-box img-left">
      <a
        class="a-link"
        @click="jumpLink(componentContent.linkObj)"
      ><img
        class="img"
        :src="componentContent.imageUrl"
        alt=""
      /></a>
    </div>
    <div class="text">
      <h3 class="h3">{{ componentContent.title }}</h3>
      <div class="content" v-html="componentContent.content" />
    </div>
    <div class="img-box img-right">
      <a
        class="item a-link"
        @click="jumpLink(componentContent.linkObj)"
      ><img
        class="img"
        :src="componentContent.imageUrl"
        alt=""
      /></a>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import funMixin from '../config/mixin/funMixin.js'
const { jumpLink } = funMixin()
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
  }
})
const { terminal, componentContent } = toRefs(props)
</script>

<style lang="scss" scoped>
.imageText {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 34px;
  .img-box {
    width: 50%;
    padding-bottom: 30%;
    background-color: #e8e8e8;
    position: relative;
    .img {
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      position: absolute;
      margin: auto;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      object-fit: contain;
    }
  }
  .text {
    width: 40%;
    .h3 {
      font-size: 30px;
      margin-bottom: 24px;
    }
    .p {
      font-size: 16px;
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
  &.pos-top {
    display: block;
    text-align: center;
    .img-box {
      width: 100%;
    }
    .text {
      width: 100%;
      margin-top: 30px;
    }
    .img-right {
      display: none;
    }
  }
  &.pos-bottom {
    display: block;
    text-align: center;
    .img-box {
      width: 100%;
    }
    .text {
      width: 100%;
      margin-bottom: 30px;
    }
    .img-left {
      display: none;
    }
  }
  &.pos-left {
    .img-right {
      display: none;
    }
  }
  &.pos-right {
    .text {
      padding-left: 20px;
    }
    .img-left {
      display: none;
    }
  }
}
</style>
