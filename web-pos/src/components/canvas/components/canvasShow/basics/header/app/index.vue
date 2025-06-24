<template>
  <div class="header" :style="{ backgroundColor: componentContent.pageBgColor }">
    <div class="header-row">
      <img
        class="logo"
        :src="componentContent.imageUrl"
        mode="heightFix"
      />
      <div class="search-col">
        <div class="search-input">
          <div v-if="componentContent.keyList.length === 0">搜索商品</div>
          <Swiper v-else class="swiper-wrapper" :modules="modules" :autoplay="autoplay" :direction="'vertical'">
            <SwiperSlide class="swiper-slide" v-for="(item, index) in componentContent.keyList" :key="index">
              <div
                class="a-link"
              >
                <span>{{ item }}</span>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
    <div class="tabs-nav-warp">
      <div class="tabs-nav" scroll-x="true">
        <div class="ul">
          <div
            class="li on"
          >
             首页
          </div>
          <div
            v-for="(item, index) in componentContent.tabs"
            :key="index"
            class="li"
            :class="{ on: activeTab === index + 1 }"
            @click="jumpLink(item.link)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, toRefs } from 'vue';
import commonMixin from '../mixin';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
const props = defineProps({
  componentContent: {
    type: Object,
    default () {
      return {};
    },
  },
});
const { componentContent } = toRefs(props);
const { jumpLink } = commonMixin();
const activeTab = ref(0);
const autoplay = {
  delay: 1000,
  disableOnInteraction: false,
}
const modules = [Autoplay];
</script>

<style lang="scss" scoped>
.header {
  padding: 0 34px;
  .logo {
    // width: 280px;
    height: 62px;
    padding: 11px 0;
  }
  .search-col{
    height: 60px;
    border-radius: 30px;
    padding:0 30px 0 90px;
    background:#FFFFFF url("https://b2c-pro-static-dev.zkthink.com/static/images/icon-search.png") no-repeat 30px center / auto 30px;
    font-size: 24px;
    line-height: 60px;
    color: #999999;
    margin: 24px 0;
    overflow: hidden;
  }
}
.tabs-nav-warp {
  margin-top: 20px;
  overflow: hidden;
  .tabs-nav {
    .ul {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
      .li {
        margin-left: 48px;
        font-size: 28px;
        color: #262626;
        position: relative;
        padding-bottom: 18px;
        white-space: nowrap;
        &:first-child {
          margin-left: 0;
        }
        &.on {
          font-weight: bold;
          &:after {
            content: "";
            width: 40px;
            height: 6px;
            background: 0% 0% / cover rgb(238, 109, 70);
            border-radius: 3px;
            position: absolute;
            left: 50%;
            margin-left: -20px;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>
