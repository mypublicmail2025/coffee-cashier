<template>
  <div class="brand-list" :class="'terminal' + terminal" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="brand-top">
      <div class="hom-title">
        {{ componentContent.title }}
      </div>
      <div v-show="componentContent.showMore" class="btn-more" @click="jumpLink(componentContent.linkObj)">查看更多</div>
    </div>
    <div class="content-warp">
      <div class="ul clearfix">
        <div class="li" :class="componentContent.imgList.length<4 && `li-${componentContent.imgList.length}`" v-for="(item, index) in componentContent.imgList" :key="index">
          <a class="item a-link" @click="jumpLink(item.linkObj)">
            <div class="imgBox">
              <img
                class="img"
                v-show="item.imgData"
                :src="item.imgData"
                :alt="item.title"
              />
            </div>
            <h4 class="h4">{{ item.title }}</h4>
          </a>
        </div>
      </div>
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
.brand-list {
  color: #fff;
  padding: 0 34px;
  .brand-top{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .hom-title {
      font-size: 32px;
      color: #333;
      line-height: 48px;
      font-weight: normal;
    }
    .btn-more{
      font-size: 24px;
      color: #999999;
      padding-right: 30px;
      background: url("https://b2c-pro-static-dev.zkthink.com/static/images/icon-arrow.png") no-repeat right center / 20px 20px;
    }
  }
  .content-warp {
    display: flex;
  }
  .ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .li {
      flex: 0 0 25%;
      float: left;
      padding: 10px 0 0 10px;
      .item {
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .imgBox {
          padding-bottom: 60%;
          background-color: #e8e8e8;
          position: relative;
          .img{
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
        .h4 {
          font-size: 18px;
          color: #333333;
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-weight: normal;
        }
        .p {
          font-size: 12px;
          margin: 7px 0 12px;
        }
      }
      &.li-1{
        flex: 0 0 100%;
      }
      &.li-2{
        flex: 0 0 50%;
      }
      &.li-3{
        flex: 0 0 33.3%;
      }
    }
  }
}
.terminal1,
.terminal2,
.terminal3 {
  &.brand-list {
    .content-warp {
      display: block;
    }
    .ul {
      width: auto;
      margin-left: -15px;
      .li {
        padding: 15px 0 0 15px;
        width: 50%;
        .item {
          padding-left: 0;
        }
      }
    }
  }
}
</style>
