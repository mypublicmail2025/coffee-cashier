<template>
  <div class="group-list" v-if="productData?.length>0" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="group-warp">
      <div class="header">
        <div class="header-warp">
          <div class="title">超值拼团</div>
          <text class="sub-title">拼着买更划算</text>
        </div>
        <a v-show="componentContent.showMore" class="btn-all a-link" @click="jumpGroupWorks(productData)">查看更多</a>
      </div>
      <div>
        <Swiper
          class="swiper pro-box"
          :modules="modules"
          :loop="true"
          :slidesPerView="'auto'"
          :space-between="20"
          :pagination="{ el: '.pagination', clickable: true }"
          :autoplay="autoplay"
        >
          <SwiperSlide class="swiper-slide pro-item-warp" v-for="(item,index) in productData" :key="index" @click="jumpProductDetail(item)">
            <div class="pro-item-inner">
              <div class="pro-item">
                <div class="pro-item-img">
                  <img class="img default-img" :src="item.image" />
                </div>
                <div class="pro-item-info">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">¥{{item.price}}</div>
                  <div class="group-num">{{item.person||0}}人团</div>
                  <div class="btn-buy">立刻拼团</div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <!-- #ifdef MP-WEIXIN -->
<!--          <swiper-item v-if="productData.products.length" class="swiper-slide pro-item-warp" v-for="item in (3 - productData.products.length)">-->
<!--          </swiper-item>-->
          <!-- #endif -->
        </Swiper>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { toRefs } from 'vue';
import commonMixin from '../mixin'
import { Autoplay, Pagination } from 'swiper/modules';

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
      return {};
    },
  }
})
const { typeId, shopId, componentContent } = toRefs(props)
const { productData, jumpProductDetail, jumpGroupWorks } = commonMixin(componentContent, typeId, shopId)
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}
const modules = [Pagination, Autoplay];
</script>

<style lang="scss" scoped>
.group-list{
  padding: 0 34px;
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    .header-warp{
      display: flex;
      align-items: flex-end;
      .title{
        font-size: 32px;
        color: #333333;
        margin-right: 10px;
      }
      .sub-title{
        font-size: 24px;
        color: #EE6D46;
      }
    }
    .btn-all{
      font-size: 24px;
      color: #999999;
      padding-right: 30px;
      background: url("https://b2c-pro-static-dev.zkthink.com/static/images/icon-arrow.png") no-repeat right center / 20px 20px;
    }
  }
  .pro-box{
    height: 416px;
    display: flex;
    &.swiper-disabled{
      .uni-swiper-wrapper{
        position: static;
      }
    }
    .swiper-slide{
      width: 290px;
    }
    .pro-item{
      width: 290px;
      background: #FFFFFF;
      border-radius: 15px;
      overflow: hidden;
      .pro-item-img{
        height: 290px;
        .img{
          width: 100%;
          height: 290px;
        }
      }
      .pro-item-info{
        padding: 14px 20px 30px;
        position: relative;
        .name{
          font-size: 28px;
          line-height: 40px;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 5px;
        }
        .price{
          color: #EE6D46;
          font-size: 30px;
          line-height: 42px;
        }
        .group-num{
          font-size: 24px;
          line-height: 33px;
          color: #999999;
          display: block;
        }
        .btn-buy{
          width: 140px;
          height: 50px;
          background: #EE6D46;
          position: absolute;
          right: 20px;
          bottom: 30px;
          font-size: 24px;
          color: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  //:deep(.uni-swiper-dots){
  //  display: flex;
  //  justify-content: center;
  //  bottom: 27px;
  //  .uni-swiper-dot{
  //    width: 24upx;
  //    height: 4upx;
  //    background: #fff;
  //    opacity: 0.5;
  //    border-radius: 2upx;
  //    margin: 0 5upx;
  //    &-active{
  //      opacity: 1;
  //    }
  //  }
  //}

  /**画布圆点样式**/
  .pagination{
    display: flex;
    justify-content: center;
    :deep(.swiper-pagination-bullet){
      width: 24upx;
      height: 4upx;
      background: #fff;
      opacity: 0.5;
      border-radius: 2upx;
      margin: 0 5upx;
    }
    :deep(.swiper-pagination-bullet-active){
      opacity: 1;
    }
  }
  /**移动端圆点样式**/
  //.swiper-dots {
  //  display: flex;
  //  position: absolute;
  //  left: 50%;
  //  transform: translateX(-50%);
  //  bottom: 15rpx;
  //  z-index: 66;
  //  .dot {
  //    width: 24upx;
  //    height: 4upx;
  //    background: #fff;
  //    opacity: 0.5;
  //    border-radius: 2upx;
  //    margin: 0 10upx;
  //  }
  //
  //  .dot-active {
  //    opacity: 1;
  //  }
  //}
}
</style>
