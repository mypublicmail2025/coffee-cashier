<template>
  <div class="group-list">
    <div class="group-warp">
      <div class="title">
        <label>
          <img src="../../../static/images/price/img-title.png" alt="组合优惠" />
        </label>
        <div v-if="productData.rules" class="price-text">
          {{ productData.rules[0].price }}元任选{{
            productData.rules[0].number
          }}件
        </div>
        <a
          v-show="componentContent.showMore"
          class="btn-all a-link"
          @click="jumpPrice(productData)"
        >更多<i class="iconfont icon-arrow-right"></i></a>
      </div>
      <Swiper
        class="pro-box"
        :modules="modules"
        :loop="true"
        :slides-per-view="2"
        :space-between="20"
        :pagination="{ el: '.pagination', clickable: true }"
        :autoplay="autoplay"
      >
        <SwiperSlide
          v-for="(item, index) in productData.composeProducts"
          :key="index"
          class="pro-item"
          @click="jumpProductDetail(item)"
        >
          <div class="pro-item-img">
            <img v-show="item.image" class="img" :src="item.image" />
          </div>
          <div class="pro-item-info">
            <h3 class="name">
              {{ item.productName }}
            </h3>
            <div class="stock">还剩{{ item.stockNumber }}件</div>
            <div class="price-warp">
              <div class="price">¥ {{ item.price }}</div>
              <div class="original-price">¥ {{ item.originalPrice }}</div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="pagination price-pagination"></div>
    </div>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
// import 'swiper/swiper.css';
import { toRefs } from 'vue';
import commonMixin from '../mixin';
import { Autoplay, Pagination } from 'swiper/modules';
const props = defineProps({
  shopId: {
    type: Number,
    default: 0,
  },
  componentContent: {
    type: Object,
    default () {
      return {};
    },
  },
});
const { shopId, componentContent } = toRefs(props);
const { productData, jumpProductDetail, jumpPrice } = commonMixin(componentContent, shopId);
const modules = [Pagination, Autoplay];
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}
</script>

<style lang="scss" scoped>
.group-list {
  padding: 30px 20px 60px;
  min-height: 80px;
  .group-warp {
    width: 710px;
    height: 544px;
    padding: 0 10px;
    background: #333333;
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.3);
    opacity: 1;
    border-radius: 20px;
  }
  .title {
    display: flex;
    align-items: center;
    position: relative;
    padding: 32px 0 20px 20px;
    .price-text {
      width: 300px;
      height: 50px;
      background: linear-gradient(90deg, #c83732 0%, #e25c44 100%);
      box-shadow: 0px 6px 12px rgba(233, 0, 0, 0.3);
      border-radius: 26px;
      font-size: 24px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      margin-left: 20px;
    }
    .btn-all {
      position: absolute;
      right: 8px;
      top: 40px;
      line-height: 33px;
      padding-right: 25px;
      font-size: 24px;
      color: #ffebc4;
      cursor: pointer;
      .iconfont {
        content: "";
        font-size: 26px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .pro-box {
    padding-bottom: 20px;
    .pro-item {
      width: 220px;
      height: 398px;
      background: #ffffff;
      .pro-item-img {
        .img {
          width: 100%;
          height: 236px;
        }
      }
      .pro-item-info {
        padding: 0 20px;
        .name {
          font-size: 24px;
          line-height: 40px;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .stock {
          padding: 0 8px;
          height: 40px;
          border: 2px solid #e4e5e6;
          line-height: 40px;
          margin: 10px 0;
          display: inline-block;
          font-size: 20px;
          color: #c5aa7b;
        }
        .price {
          font-size: 32px;
          font-weight: bold;
          line-height: 44px;
          color: #c83732;
          padding-right: 10px;
          display: inline-block;
        }
        .original-price {
          font-size: 20px;
          line-height: 28px;
          color: #cccccc;
          display: inline-block;
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    :deep(.swiper-pagination-bullet) {
      width: 24px;
      height: 4px;
      background: #fff;
      opacity: 0.5;
      border-radius: 2px;
      margin: 0 5px;
    }
    :deep(.swiper-pagination-bullet-active) {
      opacity: 1;
    }
  }
}
</style>
