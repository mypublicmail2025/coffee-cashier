<template>
  <div class="spike" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="spike-card" v-if="productList?.length>0">
      <div class="spike-card-top">
        <h2 class="spike-card-top-title">
          限时折扣
        </h2>
        <div class="spike-card-top-time" v-if="activityData.value?.state===2">
          <div class="session">活动已结束</div>
        </div>
        <div class="spike-card-top-time" v-else-if="count?.length > 0">
          <div class="session">距活动{{count[0]}}还有</div>
          <div class="time">{{count[1]}}:{{count[2]}}:{{count[3]}}</div>
        </div>
        <a v-show="componentContent.showMore" class="btn-more" @click="jumpDiscount(activityData)">查看更多</a>
      </div>
      <div class="spike-card-list" v-if="componentContent.arrangeType == '横向滑动'" :style="{ backgroundColor: componentContent.comBgColor }">
        <Swiper
          ref="mySwiper"
          class="swiper"
          :modules="modules"
          :slides-per-group="3"
          :space-between="18"
          :pagination="{ el: '.product-pagination', clickable: true }"
          :autoplay="autoplay"
        >
          <SwiperSlide
            v-for="(item, index) in productList"
            :key="index"
            class="spike-card-item"
            @click="jumpProductDetail(item)"
          >
            <div class="spike-card-item-img">
              <img class="img" :src="item.image" alt="" />
            </div>
            <div class="spike-card-item-info">
              <h3 class="name">
                {{item.storeName}}
              </h3>
              <div class="price-warp">
                <div class="price">¥{{item.price}}</div>
                <div class="stock">
                  限量{{item.stock}}件
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="pagination product-pagination" v-if="productList.length > 4"></div>
      </div>
      <div class="product-list" v-if="componentContent.arrangeType == '多行多列'">
        <div class="product-list-box">
          <div
            v-for="(item, index) in productList"
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
              <label class="product-name">{{ item.productName }}</label>
              <div class="box-spike">
                <div class="price">¥{{item.price}}</div>
                <view class="quantity-warp">
                  <view class="quantity">
                    限量{{ item.total }}件
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import commonMixin from '../mixin'
import { toRefs } from 'vue';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
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
    }
  }
})
const { typeId, shopId, componentContent } = toRefs(props)
const { activityData, productList, count, jumpProductDetail, jumpDiscount, getPercentageNum } = commonMixin(componentContent, typeId, shopId)
const modules = [Pagination, Autoplay];
const isEdit = localStorage.getItem('isEdit')
const autoplay = {
  delay: isEdit === 'true' ? 9999999 : 3000,
  disableOnInteraction: false
}
</script>

<style lang="scss" scoped>
.spike{
  &-card{
    border-radius: 20px;
    margin: 0 34px;
    &-top{
      position: relative;
      display: flex;
      margin-bottom: 17px;
      &-title{
        font-size: 32px;
        color: #333333;
        margin-right: 25px;
        font-weight: normal;
      }
      &-time{
        height: 40px;
        border-radius: 21px;
        border: 1px solid #EE6D46;
        display: flex;
        overflow: hidden;
        align-items: center;
        .session{
          height: 100%;
          line-height: 40px;
          background: #EE6D46;
          font-size: 20px;
          color: #FFFFFF;
          padding: 0 15px;
          border-radius: 21px;
        }
        .time{
          font-size: 20px;
          color: #EE6D46;
          padding: 0 14px 0 10px;
        }
      }
      .btn-more{
        position: absolute;
        right: 8px;
        top: 0px;
        line-height: 40px;
        padding-right: 30px;
        font-size: 24px;
        color: #999;
        background: url("https://b2c-pro-static-dev.zkthink.com/static/images/icon-arrow.png") no-repeat right center / 20px 20px;
      }
    }
    &-list{
      background-color: #ffffff;
      padding: 20px;
      border-radius: 15px;
      .swiper{
        width: 100%;
        display: flex;
      }
    }
    &-item{
      align-items: center;
      box-sizing: border-box;
      flex: 0 0 203px;
      //margin-right: 18px;
      &-img{
        width: 203px;
        height: 203px;
        .img{
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      &-info{
        width: 203px;
        .name{
          font-size: 30px;
          font-weight: normal;
          line-height: 40px;
          color: #333333;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          padding: 15px 0 6px;
        }
        .price-warp{
          display: flex;
          align-items: center;
        }
        .price{
          font-size: 32px;
          color: #EE6D46;
          padding-right: 10px;
          display: inline-block;
        }
        .original-price{
          font-size: 20px;
          line-height: 28px;
          color: #CCCCCC;
          display: inline-block;
        }
        .stock{
          line-height: 1em;
          display: inline-block;
          font-size: 20px;
          color: #999999;
        }
      }
    }
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
    display: block;
  }
  :deep(.swiper-pagination-bullet-active){
    opacity: 1;
    width: 20px;
  }
}
</style>
