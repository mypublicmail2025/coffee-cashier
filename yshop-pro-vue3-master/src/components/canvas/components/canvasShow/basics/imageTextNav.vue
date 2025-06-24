<template>
  <div class="nav-warp" :style="{ backgroundColor: componentContent.pageBgColor }">
    <ul class="ul image-text-nav" :class="'terminal' + terminal" :style="{ backgroundColor: componentContent.comBgColor }">
      <li
        v-for="(item, index) in componentContent.imgTextData"
        :key="index"
        class="li"
        @click="jumpLink(componentContent.linkObj)"
      >
        <div class="img-box">
          <div class="img-box-inner">
            <el-image :src="item.img" fit="contain" />
          </div>
        </div>
        <h4 class="h4">{{ item.title }}</h4>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { funMixin } from '../config/mixin'
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
// 计算生成格子百分比
</script>

<style lang="scss" scoped>
.nav-warp{
  padding: 0 34px;
}
.image-text-nav {
  min-height: 144px;
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  background-color: #fff;
  border-radius: 15px;
  .li {
    text-align: center;
    flex: 1;
    min-width: 25%;
    padding: 10px 0;
    .img-box {
      .el-image {
        width: 60px;
        height: 60px;
      }
    }
    .h4 {
      font-size: 24px;
      color: #333;
      line-height: 33px;
      margin-top: 8px;
    }
  }
  &.terminal4 {
    width: 1000px;
    .li {
      .img-box {
        display: inline-block;
        width: 100px;
        height: 100px;
        border: 2px solid #f3f4f5;
        border-radius: 10px;
        &-inner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .el-image {
          width: 60px;
          height: 60px;
        }
      }
      .h4 {
        font-size: 18px;
        color: #ccc;
        line-height: 1em;
        padding-top: 20px;
      }
    }
  }
}
</style>
