<template>
  <div class="hom-pro-list">
    <div class="product-swiper">
      <Swiper
        class="product-swiper-box"
        :modules="modules"
        :loop="true"
        :slides-per-view="3"
        :space-between="12"
        :pagination="{ el: '.pagination', clickable: true }"
        :autoplay="autoplay"
      >
        <SwiperSlide
          v-for="(item, index) in productData.slice(0, 3)"
          :key="index"
          class="product-swiper-item"
          @click="jumpProductDetail(item)"
        >
          <div class="product-swiper-img">
            <img class="img" :src="item.image" />
          </div>
          <div class="product-swiper-info">
            <label class="product-name">{{ item.productName }}</label>
            <div class="price-warp">
              <div class="price">¥ {{ item.price }}</div>
              <div class="original-price">¥ {{ item.originalPrice }}</div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="pagination new-pagination"></div>
    </div>
    <button
      v-show="componentContent.showMore"
      class="btn-more"
      @click="jumpLink(componentContent.linkObj)"
    >
      查看全部 <span class="icon iconfont icon-arrow-right"></span>
    </button>
  </div>
</template>
<script setup>
import { toRefs } from 'vue';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import commonMixin from '../mixin';
const props = defineProps({
  componentContent: {
    type: Object,
    default () {
      return {};
    },
  },
});
const { componentContent } = toRefs(props);
const { productData, jumpProductDetail, jumpLink } = commonMixin(componentContent);
const modules = [Pagination, Autoplay];
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}
</script>

<style lang="scss" scoped>
.hom-pro-list {
  :deep(.swiper-wrapper) {
    position: static;
  }
  /**横向滑动**/
  .product-swiper {
    width: 100%;
    height: 454px;
    padding: 90px 34px 0;
    background: url("../../../static/images/newProduct/bg-product-card.png")
      no-repeat center;
    position: relative;
    & + .btn-more {
      margin-top: 20px;
    }
    .title {
      padding: 22px 0px 0 0;
      label {
        background-image: none;
        color: #a56c4c;
        font-style: italic;
        padding: 0;
      }
    }
    &-box {
      padding-bottom: 20px;
    }
    &-item {
      width: 220px;
      position: relative;
      background-color: #ffffff;
    }
    &-img {
      width: 220px;
      height: 220px;
      position: relative;
      &:after {
        content: "";
        display: block;
        width: 54px;
        height: 54px;
        background: url("../../../static/images/newProduct/flag-new.png")
          no-repeat;
        position: absolute;
        top: 0;
        left: 0;
      }
      .img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &-info {
      background-color: #ffffff;
      padding: 10px;
      text-align: center;
      .product-name {
        font-size: 20px;
        color: #333;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 6px;
        line-height: 28px;
      }
      .price-warp {
        display: flex;
        justify-content: center;
        align-items: baseline;
        line-height: 28px;
        .price {
          color: #c83732;
          font-size: 20px;
          margin-right: 10px;
        }
        .original-price {
          font-size: 16px;
          color: #ccc;
          text-decoration: line-through;
        }
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  width: 100%;
  bottom: 0;
  :deep(.swiper-pagination-bullet) {
    width: 24px;
    height: 4px;
    background: #ffffff;
    opacity: 0.5;
    border-radius: 2px;
    margin: 0 10px;
  }
  :deep(.swiper-pagination-bullet-active) {
    opacity: 1;
  }
}
.btn-more {
  width: 170px;
  height: 54px;
  border: 2px solid #c5aa7b;
  color: #c5aa7b;
  font-size: 24px;
  background-color: transparent;
  margin: 20px auto 0;
  display: block;
  cursor: pointer;
}
</style>
