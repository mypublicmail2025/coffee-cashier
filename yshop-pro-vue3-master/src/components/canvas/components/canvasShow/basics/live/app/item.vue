<template>
  <div class="live-box">
    <div v-if="liveData.live_status === 101 || isOn" class="live-ongoing">
      <img class="cover-img" :src="liveData.cover_img" />
      <div class="status">
        <div class="status-state">
          <img class="img" src="../../../static/images/live/icon-live-num.png" />直播中
        </div>
        <div class="status-num">1000人</div>
      </div>
      <div class="user">
        <div class="user-pic">
          <img class="img" src="../../../static/images/live/huabei.png" />
        </div>
        <view class="user-name">{{ liveData.anchor_name }}</view>
      </div>
      <div class="products">
        <div class="uni-padding-wrap">
          <div class="page-section swiper">
            <div class="page-section-spacing">
              <el-carousel
                height="34px"
                direction="vertical"
                indicator-position="none"
              >
                <el-carousel-item
                  v-for="item in liveData.goods"
                  :key="item.goods_id"
                >
                  <h3 class="medium">{{ item.name }}</h3>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="live-other">
      <img class="cover-img" :src="liveData.cover_img" />
      <div class="user">
        <div class="user-pic">
          <img class="img" src="../../../static/images/live/huabei.png" />
        </div>
        <div class="user-name">{{ liveData.anchor_name }}</div>
      </div>
      <div class="count-down">
        <div class="text">开播倒计时</div>
        <div class="time">
          <div class="time-item dots">{{ times[0] }}</div>
          <div class="time-item dots">{{ times[1] }}</div>
          <div class="time-item">{{ times[2] }}</div>
        </div>
      </div>
      <div class="btn-subscribe">立即预约</div>
      <!--      <view class="btn-subscribe subscribed">已预约</view>-->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from 'vue';
const props = defineProps({
  liveData: {
    type: Object,
    default: () => ({
      name: '',
      cover_img: '',
    }),
  },
});
const { liveData } = toRefs(props);
// const indicatorDots = ref(false);
// const autoplay = ref(true);
// const interval = ref(2000); // 自动播放间隔时长
// const duration = ref(500); // 幻灯片切换时长(ms)
const times = ref([]);
const isOn = ref(false);

onMounted(() => {
  countTime();
});

// function changeIndicatorDots (e) {
//   indicatorDots.value = !indicatorDots.value;
// }
// function changeAutoplay (e) {
//   autoplay.value = !autoplay.value;
// }
// function intervalChange (e) {
//   interval.value = e.target.value;
// }
// function durationChange (e) {
//   duration.value = e.target.value;
// }
function countTime () {
  var nowtime = new Date().getTime(); // 获取当前时间
  var starttime = liveData.value.start_time * 1000;
  if (liveData.value.live_status === 102) {
    if (starttime > nowtime) {
      var lefttime = starttime - nowtime; // 距离结束时间的毫秒数
      var leftd = Math.floor(lefttime / (1000 * 60 * 60)); // 计算小时数
      var leftm = Math.floor((lefttime / (1000 * 60)) % 60); // 计算分钟数
      var lefts = Math.floor((lefttime / 1000) % 60); // 计算秒数
      times.value = [
        leftd < 10 ? '0' + leftd : leftd,
        leftm < 10 ? '0' + leftm : leftm,
        lefts < 10 ? '0' + lefts : lefts,
      ];
      setTimeout(() => {
        countTime();
      }, 1000);
    } else {
      isOn.value = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.live-box {
  position: relative;
  color: #fff;
  .cover-img {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
  }
  .user {
    display: flex;
    line-height: 60px;
    height: 64px;
    &-pic {
      .img {
        width: 60px;
        height: 60px;
        border: 2px solid rgba(255, 255, 255, 0.5019607843137255);
        border-radius: 50%;
        overflow: hidden;
      }
    }
    &-name {
      font-size: 28px;
      margin-left: 16px;
    }
  }
  .live-ongoing {
    width: 100%;
    height: 100%;
    position: relative;
    .status {
      position: absolute;
      top: 22px;
      left: 22px;
      //width: 212upx;
      height: 48px;
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      font-size: 20px;
      line-height: 44px;
      display: flex;
      padding-right: 8px;
      &-state {
        width: 118px;
        height: 44px;
        background: linear-gradient(90deg, #c83732 0%, #e25c44 100%);
        opacity: 1;
        border-radius: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        .img {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
      }
      &-num {
        min-width: 80px;
        padding: 0 8px;
      }
    }
    .user {
      position: absolute;
      bottom: 62px;
      left: 20px;
    }
    .products {
      position: absolute;
      left: 0px;
      bottom: 20px;
      width: 100%;
      padding: 0 20px;
      .swiper {
        height: 34px;
        line-height: 34px;
        font-size: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .live-other {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .cover-img {
      filter: blur(20px);
      -webkit-filter: blur(20px);
      -moz-filter: blur(20px);
      -ms-filter: blur(20px);
      -o-filter: blur(20px);
    }
    .user {
      position: absolute;
      top: 20px;
      left: 20px;
    }
    .count-down {
      position: relative;
      .text {
        font-size: 26px;
        line-height: 36px;
        margin-bottom: 16px;
        opacity: 0.5;
        text-align: center;
      }
      .time {
        display: flex;
        &-item {
          min-width: 52px;
          padding: 0 5px;
          height: 52px;
          line-height: 52px;
          background: #ffffff;
          opacity: 1;
          border-radius: 4px;
          font-size: 26px;
          color: #c83732;
          text-align: center;
          &.dots {
            margin-right: 22px;
            position: relative;
            &:before,
            &:after {
              content: "";
              width: 6px;
              height: 6px;
              background: #ffffff;
              position: absolute;
              right: -14px;
            }
            &:before {
              top: 14px;
            }
            &:after {
              bottom: 14px;
            }
          }
        }
      }
    }
    .btn-subscribe {
      width: 200px;
      height: 64px;
      line-height: 64px;
      background: linear-gradient(90deg, #c83732 0%, #e25c44 100%);
      box-shadow: 0rpx 6px 12px rgba(233, 0, 0, 0.3);
      opacity: 1;
      border-radius: 8px;
      color: #fff;
      font-size: 24px;
      text-align: center;
      position: absolute;
      bottom: 60px;
      left: 50%;
      margin-left: -100px;
      &.subscribed {
        background: #ffffff;
        color: #999999;
        box-shadow: none;
      }
    }
  }
}
</style>
