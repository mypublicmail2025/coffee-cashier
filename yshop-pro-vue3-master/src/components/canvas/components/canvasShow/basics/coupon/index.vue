<template>
  <div class="coupon-warp" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="coupon-box" >
      <div class="coupon-top">
        <div class="title">
          <img class="img" src="https://b2c-pro-static-dev.zkthink.com/static/home/title-coupon.png" />
          <div class="text">好券天天领不停</div>
        </div>
        <div class="btn-more">查看更多</div>
      </div>
      <div class="coupon-list coupon-flex coupon-swiper" v-if="componentContent.arrangeType === '横向滑动'">
        <Swiper
          class="swiper"
          :modules="modules"
          :loop="true"
          :slidesPerView="'auto'"
          :space-between="16"
          :pagination="{ el: '.pagination', clickable: true }"
          :autoplay="autoplay"
        >
          <SwiperSlide class="swiper-slide" v-for="(item, index) in couponsData" :key="index">
            <couponItem :item="item" :componentContent="componentContent" @receive="receiveCoupon" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="coupon-list" v-else :class="componentContent.arrangeType === '多行多列' && 'coupon-flex'">
        <couponItem v-for="(item, index) in couponsData" :key="index" :item="item" :componentContent="componentContent" @receive="receiveCoupon" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import commonMixin from './mixin';
import couponItem from './item.vue';
import { toRefs } from 'vue';
const autoplay = {
  delay: 9999999,
  disableOnInteraction: false
}
const modules = [Pagination, Autoplay];
const props = defineProps({
  typeId: {
    type: Number,
    default: 1,
  },
  shopId: {
    type: Number,
    default: 0,
  },
  componentContent: {
    type: Object,
    default () {
      return {}
    },
  },
});
const { typeId, shopId, componentContent } = toRefs(props);
const { couponsData, receiveCoupon } = commonMixin(componentContent, typeId, shopId);
</script>

<style lang="scss" scoped>
.coupon-warp{
  padding: 0 34px;
}
.coupon-box{
  padding: 24px;
  background: linear-gradient( 180deg, #FBECDB 0%, #FFFFFF 100%);
  border-radius: 15px;
  .coupon-top{
  display: flex;
  justify-content: space-between;
    margin-bottom: 20px;
  .title{
    flex: 1;
    display: flex;
    font-size: 24px;
    color: #988E83;
    align-items: center;
    .img{
      height: 28px;
      margin-right: 10px;
    }
  }
  .btn-more{
    font-size: 24px;
    color: #999;
    padding-right: 30px;
    background: url("https://b2c-pro-static-dev.zkthink.com/static/images/icon-arrow.png") no-repeat right center / 20px 20px;
  }
}

  .coupon-list{
    .coupon-item {
      width: 100%;
      height: 160px;
      background: url('https://b2c-pro-static-dev.zkthink.com/static/images/canvas/bg-coupon-l.png') no-repeat;
      background-size: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
      &:first-child{
        margin-top: 0;
      }
      .discount{
        display: flex;
        align-items: baseline;
        font-size: 68px;
        line-height: 64px;
        font-weight: bold;
        .unit{
          font-size: 32px;
        }
      }

      .info{
        font-size: 38px;
        .type{
          font-size: 32px;
          font-weight: bold;
          color: #333333;
          line-height: 45px;
        }
        .tip{
          font-size: 24px;
          white-space: nowrap;
        }
      }

      .button{
        width: 144px;
        height: 64px;
        border-radius: 8px;
        background: #ee6d46;
        font-size: 24px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .disable{
        background: #666666;
      }
      .expired{
        background: #999999;
      }

      .coupon-left{
        width: 206px;
        display: flex;
        justify-content: center;
      }
      .coupon-right{
        flex: 1;
        display: flex;
        padding: 0 32px;
        justify-content: space-between;
        align-items: center;
      }
    }
    &.coupon-flex{
      display: flex;
      flex-wrap: wrap;
      //justify-content: space-between;
      .swiper{
        width: 100%;
      }
      .coupon-item {
        width: 309px;
        height: 120px;
        background-image: url('https://b2c-pro-static-dev.zkthink.com/static/images/canvas/bg-coupon-m.png');
        &:nth-child(2){
          margin-top: 0;
        }
        .coupon-left{
          width: 147px;
          flex-direction: column;
          align-items: center;
          .type{
            font-size: 20px;
            font-weight: bold;
            line-height: 28px;
          }
        }
        .coupon-right{
          flex-direction: column;
          padding: 0;
        }
        .discount{
          font-size: 32px;
          line-height: 45px;
          .unit{
            font-size: 24px;
          }
        }

        .info{
          .tip{
            font-size: 20px;
            line-height: 36px;
            margin-bottom: 9px;
          }
        }

        .button{
          width: 132px;
          height: 48px;
          border-radius: 4px;
          font-size: 22px;
        }
      }
    }
    &.coupon-swiper{
      .swiper-slide{
        width: 309px;
        .coupon-item {
          width: 309px;
          background-image: url('https://b2c-pro-static-dev.zkthink.com/static/images/canvas/bg-coupon-m.png');
          margin-bottom: 0;
          .coupon-left{
            width: 130px;
          }
        }
      }

    }
  }
}

</style>
