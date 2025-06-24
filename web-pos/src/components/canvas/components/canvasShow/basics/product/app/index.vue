<template>
  <div class="hom-pro-list" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="header">
      <div class="header-warp">
        <div class="title">商品推荐</div>
        <!--        <text class="sub-title">拼着买更划算</text>-->
      </div>
      <a v-show="componentContent.showMore" class="btn-all a-link" @click="jumpProList(productData)">查看更多</a>
    </div>
    <div
      v-if="componentContent.arrangeType == '横向滑动'"
      class="product-list product-swiper"
    >
      <Swiper
        ref="mySwiper"
        class="product-list-box"
        :modules="modules"
        :slides-per-view="2"
        :slides-per-group="2"
        :space-between="14"
        :pagination="{ el: '.product-pagination', clickable: true }"
        :autoplay="autoplay"
      >
        <SwiperSlide
          v-for="(item, index) in productData?.slice(0, 10)"
          :key="index"
          class="product-list-item"
          @click="jumpProductDetail(item)"
        >
          <div class="product-list-img">
            <img
              class="img pic-img default-img"
              :src="item.image"
            />
          </div>
          <div class="product-list-info">
            <label class="product-name">{{ item.storeName }}</label>
            <div v-if="item.campaignType === 1" class="box-group">
              <div class="price">¥{{item.campaignPrice}}</div>
              <label class="group-num">{{item.person||0}}人团</label>
              <div class="btn">立刻拼团</div>
            </div>
            <div v-else-if="[2,3].includes(item.campaignType)" class="box-spike">
              <div class="price">¥{{item.campaignPrice}}</div>
              <view class="quantity-warp">
                <view class="quantity">
                  限量{{ item.campaignTotal }}件
                </view>
                <uv-line-progress
                  activeColor="#EE6D46"
                  inactiveColor="#E6E6E6"
                  height="14rpx"
                  :percentage="getPercentageNum(item)"
                  :showText="false"
                />
              </view>
              <div class="btn">立即抢购</div>
            </div>
            <div v-else class="box-default">
              <div class="price">¥{{item.price}}</div>
              <div class="quantity">限量{{ item.stock }}件</div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="pagination product-pagination"></div>
    </div>
    <div v-if="componentContent.arrangeType == '多行多列'" class="product-list">
      <div class="product-list-box">
        <div
          v-for="(item, index) in productData"
          :key="index"
          class="product-list-item"
          @click="jumpProductDetail(item)"
        >
          <div class="product-list-img">
            <img
              class="img pic-img default-img"
              :src="item.image"
            />
          </div>
          <div class="product-list-info">
            <label class="product-name">{{ item.storeName }}</label>
            <div v-if="item.campaignType === 1" class="box-group">
              <div class="price">¥{{item.campaignPrice}}</div>
              <label class="group-num">{{item.person||0}}人团</label>
              <div class="btn">立刻拼团</div>
            </div>
            <div v-else-if="[2,3].includes(item.campaignType)" class="box-spike">
              <div class="price">¥{{item.campaignPrice}}</div>
              <view class="quantity-warp">
                <view class="quantity">
                  限量{{ item.campaignTotal }}件
                </view>
                <uv-line-progress
                  activeColor="#EE6D46"
                  inactiveColor="#E6E6E6"
                  height="14rpx"
                  :percentage="getPercentageNum(item)"
                  :showText="false"
                />
              </view>
              <div class="btn">立即抢购</div>
            </div>
            <div v-else class="box-default">
              <div class="price">¥{{item.price}}</div>
              <div class="quantity">限量{{ item.stock }}件</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { toRefs } from 'vue';
import { Pagination, Autoplay } from 'swiper/modules';
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
const { productData, jumpProductDetail, jumpProList, getPercentageNum } = commonMixin(componentContent);
const modules = [Pagination, Autoplay];
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}
</script>

<style
  lang="scss"
  scoped
>
.hom-pro-list {
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

  /**多行多列**/
  .product-list {
    position: relative;

    &-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-direction: row;

      &.swiper {
        height: 466px;
      }
    }

    &.product-swiper .product-list-box {
      padding-left: 0;
    }


    &-item {
      width: 331px;
      margin-bottom: 20px;
      box-sizing: content-box;
      border-radius: 15px;
      overflow: hidden;
      background-color: #f5f5f5;
    }

    &-img {
      width: 331px;
      height: 331px;
      background-color: #f5f5f5;


      .img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    &-info {
      background-color: #FFFFFF;
      //box-shadow: 0px 0px 15px 0px rgba(52, 52, 52, 0.15);
      border-radius: 0 0 10px 10px;
      padding: 20px;

      label {
        font-weight: normal;
      }

      .product-name {
        font-size: 28px;
        color: #333;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 7px;
        line-height: 40px;
      }

      .box-group{
        position: relative;
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
        .btn{
          width: 140px;
          height: 50px;
          background: #EE6D46;
          position: absolute;
          right: 0px;
          bottom: 0px;
          font-size: 24px;
          color: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .box-spike{
        position: relative;
        .price{
          font-size: 30px;
          color: #EE6D46;
        }
        .quantity-warp{
          width: 130px;
          .quantity{
            font-size: 24px;
            color: #999999;
          }
          :deep(.uv-line-progress){
            border-radius: 0;
            .uv-line-progress__background{
              border-radius: 0;
            }
            .uv-line-progress__line{
              border-radius: 0;
            }
          }
        }
        .btn{
          width: 140px;
          height: 50px;
          background: #EE6D46;
          position: absolute;
          right: 0px;
          bottom: 0px;
          font-size: 24px;
          color: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .box-default{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .price{
          font-size: 34px;
          color: #EE6D46;
        }
        .quantity{
          font-size: 24px;
          color: #999999;
        }
      }
    }

  }
}

.btn-more {
  width: 170px;
  height: 54px;
  line-height: 54px;
  border: 2px solid #C5AA7B;
  color: #C5AA7B;
  font-size: 24px;
  background-color: transparent;
  margin: 20px auto 0;
  display: flex;
  align-items: center;
}

/**画布圆点样式**/
.pagination{
  display: flex;
  justify-content: center;
  padding: 20px 0;
  :deep(.swiper-pagination-bullet){
    width: 10px;
    height: 10px;
    background: #333333;
    opacity: 0.3;
    border-radius: 5px;
    margin: 0 10px;
  }
  :deep(.swiper-pagination-bullet-active){
    opacity: 1;
    width: 20px;
  }
}
/**移动端圆点样式**/
//.swiper-dots {
//  display: flex;
//  justify-content: center;
//  padding: 20rpx 0;
//
//  .dot {
//    width: 10rpx;
//    height: 10rpx;
//    background: #333333;
//    opacity: 0.3;
//    border-radius: 5rpx;
//    margin: 0 10rpx;
//  }
//
//  .dot-active {
//    width: 20rpx;
//    opacity: 1;
//  }
//}

.child-loading{
  background: linear-gradient(90deg,#f0f2f5 25%,#e6e8eb 37%,#f0f2f5 63%);
  background-size: 400% 100%;
  animation: el-skeleton-loading 1.4s ease infinite;
}

@keyframes el-skeleton-loading {
  0% {
    background-position: 100% 50%
  }

  to {
    background-position: 0 50%
  }
}

</style>
