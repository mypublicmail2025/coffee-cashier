<template>
  <div class="live-list-page">
    <div class="title">
      <img src="../../../static/images/live/img-title.png" alt="商品推荐" />
    </div>
    <div class="live-list">
      <LiveBox
        v-for="(item, index) in roomList"
        :key="item.roomid"
        v-model:liveData="roomList[index]"
        class="live-item"
        @click="toLiveRoom(item)"
      />
    </div>
    <button
      v-show="componentContent.showMore"
      class="btn-more"
      @click="jumpLive(productData)"
    >
      查看全部 <span class="icon iconfont icon-arrow-right" />
    </button>
  </div>
</template>
<script setup>
import commonMixin from '../mixin';
import LiveBox from './item.vue';
import { toRefs } from 'vue';
const { roomList } = commonMixin();
const props = defineProps({
  componentContent: {
    type: Object,
    default () {
      return {};
    },
  },
});
const { componentContent, toLiveRoom, jumpLive } = toRefs(props);
</script>

<style lang="scss" scoped>
.live-list-page {
  .title {
    text-align: center;
    margin-bottom: 20px;
  }
  .live-list {
    padding-left: 20px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .live-item {
      margin: 0 14px 14px 0;
      width: 348px;
      height: 464px;
      border-radius: 8px;
      overflow: hidden;
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
}
</style>
