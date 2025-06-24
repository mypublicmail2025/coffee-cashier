<template>
  <div class="banner" :class="'terminal' + terminal" :style="{ backgroundColor: componentContent.pageBgColor }">
    <Swiper
      class="swiper"
      :style="{ backgroundColor: componentContent.comBgColor }"
      :modules="modules"
      :loop="true"
      :pagination="{ el: '.swiper-pagination', clickable: true }"
      :autoplay="autoplay"
    >
      <SwiperSlide
        v-for="(item, index) in bannerList"
        :key="index"
        class="banner-item"
        :style="{
          backgroundImage: 'url(' + item.bannerUrl + ')',
          height: componentContent.height + 'px',
        }"
        @click="jumpLink(item.linkObj)"
      >
        <!--<div class="a-link" @click="jumpLink(item.linkObj)"><img class="img" :src="item.bannerUrl" v-show="item.bannerUrl"></div>-->
      </SwiperSlide>
    </Swiper>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { toRefs, onMounted, computed } from 'vue';
import funMixin from '../config/mixin/funMixin'
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
  },
})
const { terminal, componentContent } = toRefs(props)
onMounted(() => {
  // this.$forceUpdate() // 刷新轮播图
})
const bannerList = computed(() => {
  return componentContent.value?.bannerData.filter(function (item) {
    return item.bannerUrl
  })
})
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}
const modules = [Pagination, Autoplay];

</script>

<style lang="scss" scoped>
.banner {
  padding: 0 34px;
  .swiper{
    border-radius: 15px;
  }
  .banner-item {
    width: 100%;
    border-radius: 15px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto 100%;
    img {
      width: 100%;
    }
  }
  &.terminal4 {
    :deep(.el-carousel) {
      height: 100%;
      .el-carousel__container {
        height: 100%;
      }
    }
    .banner-item {
      img {
        display: none;
      }
    }
  }
  .swiper-pagination {
    display: flex;
    justify-content: center;
    bottom: 20px;
    width: 100%;
    :deep(.swiper-pagination-bullet) {
      width: 30px;
      height: 4px;
      background: #fff;
      opacity: 0.5;
      border-radius: 2px;
      margin: 0 7.5px;
    }
    :deep(.swiper-pagination-bullet-active) {
      opacity: 1;
      width: 58px;
    }
  }
}
</style>
