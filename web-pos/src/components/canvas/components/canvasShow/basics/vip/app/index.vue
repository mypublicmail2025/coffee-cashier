<template>
  <div class="vip">
    <div class="vip-card">
      <div class="vip-title">
        <h2>
          <img src="../../../static/images/vip/img-title.png" alt="会员专区" />
        </h2>
        <a
          v-show="componentContent.showMore"
          class="btn-more a-link"
          @click="jumpVip"
        >更多<i class="iconfont icon-arrow-right"></i></a>
      </div>
      <Swiper
        class="vip-list"
        :modules="modules"
        :loop="true"
        :pagination="{ el: '.pagination', clickable: true }"
        :autoplay="autoplay"
      >
        <SwiperSlide
          v-for="(itemJ, indexJ) in listTemp"
          :key="indexJ"
          class="vip-item-warp"
          @click="jumpProductDetail(item)"
        >
          <div v-for="(item, index) in itemJ" :key="index" class="vip-item">
            <div class="vip-item-img">
              <img v-show="item.image" class="img" :src="item.image" />
            </div>
            <div class="vip-item-info">
              <h3 class="name">
                {{ item.productName }}
              </h3>
              <div class="stock">还剩{{ item.stockNumber }}件</div>
              <div class="original-price">¥ {{ item.originalPrice }}</div>
              <div class="price-warp">
                <div class="flag">
                  <img src="../../../static/images/vip/flag-vip2.png" alt="会员价" />
                </div>
                <div class="price">¥ {{ item.price }}</div>
              </div>
              <div class="btn-buy">
                <span>去购买</span>
                <div class="progress">
                  <i></i>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="pagination vip-pagination"></div>
    </div>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { computed, toRefs } from 'vue';
import { Autoplay, Pagination } from 'swiper/modules';
import commonMixin from '../mixin'
const { productData, jumpVip, jumpProductDetail } = commonMixin()
const props = defineProps({
  componentContent: {
    type: Object,
    default () {
      return {};
    }
  }
})
const { componentContent } = toRefs(props)
const modules = [Pagination, Autoplay];
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}

const listTemp = computed(() => {
  var list = productData
  var arrTemp = []
  var index = -1
  var count = 2 // 每组多少条
  for (var i = 0; i < list.length; i++) {
    if (i % count === 0) {
      arrTemp.push([])
      index++
    }
    arrTemp[index].push(list[i])
  }
  return arrTemp
})
</script>

<style lang="scss" scoped>
.vip {
  &-card {
    background: #333333;
    padding: 0 20px 20px;
  }
  &-title {
    padding: 42px 0 28px 30px;
    position: relative;
    .btn-more {
      position: absolute;
      right: 8px;
      top: 40px;
      line-height: 33px;
      padding-right: 25px;
      font-size: 24px;
      color: #ffebc4;
      cursor: pointer;
      .iconfont {
        content: '';
        font-size: 26px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  &-item {
    display: flex;
    background-color: #fff;
    margin-top: 20px;
    &:first-child {
      margin-top: 0px;
    }
    &-img {
      width: 260px;
      height: 260px;
      margin-right: 20px;
      background-color: #ececec;
      .img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &-info {
      flex: 1;
      position: relative;
      .name {
        font-size: 28px;
        line-height: 40px;
        color: #333333;
        padding: 30px 0 10px;
      }
      .stock {
        color: #c5aa7b;
        font-size: 20px;
        border: 2px solid #e4e5e6;
        line-height: 40px;
        padding: 0 5px;
        display: inline-block;
        margin-bottom: 30px;
      }
      .original-price {
        font-size: 24px;
        line-height: 34px;
        color: #cccccc;
      }
      .flag {
        float: left;
        padding: 12px 10px 0 0;
      }
      .price {
        font-size: 40px;
        font-weight: bold;
        line-height: 56px;
        color: #c83732;
      }
      .btn-buy {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 160px;
        height: 84px;
        background: linear-gradient(90deg, #c83732 0%, #e25c44 100%);
        box-shadow: 0px 6px 12px rgba(233, 0, 0, 0.3);
        border-radius: 10px;
        text-align: center;
        padding: 16px 20px 0;
        span {
          font-size: 24px;
          line-height: 34px;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .progress {
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 4px;
          position: relative;
          i {
            position: absolute;
            left: 0;
            top: 0;
            width: 50%;
            height: 8px;
            background-color: #fff;
            border-radius: 4px;
          }
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
