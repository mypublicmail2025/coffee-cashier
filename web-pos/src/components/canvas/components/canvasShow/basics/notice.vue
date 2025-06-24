<template>
  <div class="notice-warp" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="notice-box" :style="{ backgroundColor: componentContent.comBgColor }">
      <div
        class="notice-list"
        :class="'terminal' + terminal"

      >
        <Swiper class="swiper-wrapper" :modules="modules" :autoplay="autoplay" :direction="'vertical'">
          <SwiperSlide class="swiper-slide" v-for="(item, index) in componentContent.list" :key="index">
            <div
              class="a-link"
              @click="jumpNoticeDetail(item)"
            >
              <span>{{ item.title }}</span>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>

</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
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
  }
})
const { terminal, componentContent } = toRefs(props)
// const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: 1000,
  disableOnInteraction: false,
}
const modules = [Autoplay];

</script>

<style lang="scss" scoped>
.notice-warp{
  padding: 0 34px;
  background-color: #f5f5f5;
}
.notice-box{
  background-color: #fff;
  border-radius: 15px;
  padding: 0 24px;
}
.notice-list{
  height: 72px;
  line-height: 72px;
  overflow: hidden;
  background:url("https://b2c-pro-static-dev.zkthink.com/static/home/icon-notice.png") no-repeat 0px center / 32px 32px;
  .a-link{
    // display: block;
    cursor: pointer;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: 0 20px;
    span{
      display: inline-block;
      padding-left: 30px;
      font-size: 24px;
    }
  }
  &.terminal4{
    height: 50px;
    line-height: 50px;
    padding: 0;
    .swiper-container{
      height: 100%;
      width: 1200px;
      max-width: 100%;
      margin: 0 auto;
    }
    .a-link{
      cursor: pointer;
      display: block;
      text-align: left;
      margin: 0 20px;
      span{
        display: block;
        padding-left: 25px;
        font-size: 14px;
      }
    }
  }
}
</style>
