<template>
  <div class="shop" :class="'terminal' + terminal">
    <Swiper
      :modules="modules"
      :loop="true"
      :pagination="{ el: '.pagination', clickable: true }"
      :autoplay="autoplay"
    >
      <SwiperSlide
        v-for="(item, index) in imgList"
        :key="index"
        class="shop-item"
      >
        <div class="shop-item-warp">
          <img class="img" :src="item.img" />
          <div class="a-link" @click="jumpLink(item.linkObj)">
            进店逛逛<i class="iconfont icon-arrow-right"></i>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    <div class="pagination shop-pagination"></div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
// import 'swiper/swiper.css';
import { toRefs, onMounted, computed } from 'vue';
import funMixin from '../config/mixin/funMixin.js'
import { Autoplay, Pagination } from 'swiper/modules';
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
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}
const modules = [Pagination, Autoplay];
onMounted(() => {
  // this.$forceUpdate() // 刷新轮播图
})
const imgList = computed(() => {
  return componentContent.value.imgTextData.filter(function (item) {
    return item.img
  })
})
</script>

<style lang="scss" scoped>
.shop {
  position: relative;
  &-item {
    &-warp {
      position: relative;
      padding: 0 20px;
      .img {
        width: 100%;
        height: 420px;
      }
      .a-link {
        width: 220px;
        height: 80px;
        line-height: 80px;
        background: linear-gradient(225deg, #585858 0%, #333333 100%);
        box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.3);
        display: block;
        color: #fff;
        font-size: 28px;
        text-align: center;
        position: absolute;
        right: 0;
        bottom: 30px;
        .icon {
          margin-left: 20px;
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    :deep(.swiper-pagination-bullet) {
      width: 12px;
      height: 12px;
      background: #333333;
      border-radius: 50%;
      opacity: 0.2;
      margin: 0 10px;
    }
    :deep(.swiper-pagination-bullet-active) {
      width: 24px;
      height: 12px;
      background: #333333;
      opacity: 1;
      border-radius: 8px;
    }
  }
}
</style>
