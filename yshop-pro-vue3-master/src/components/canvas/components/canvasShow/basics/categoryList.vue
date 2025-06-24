<template>
  <div class="category-list" :class="'terminal' + terminal" :style="{ backgroundColor: componentContent.pageBgColor }">
    <h2 class="hom-title" :style="{ textAlign: componentContent.textAlign }">
      {{ componentContent.title }}
    </h2>
    <div class="content-warp">
      <ul
        class="clearfix"
        :class="{ number5: componentContent.categoryData.length === 5 }"
      >
        <li v-for="item of componentContent.categoryData" :key="item.id">
          <a class="item a-link" @click="jumpCategory(item)">
            <div class="imgBox">
              <img
                v-show="item.img"
                ref="getHeight"
                :src="item.img"
                :alt="item.name"
              />
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import funMixin from '../config/mixin/funMixin.js'
const { jumpCategory } = funMixin()
const props = defineProps({
  terminal: {
    type: Number,
    default: 4,
  },
  componentContent: {
    type: Object,
    default () {
      return {};
    }
  },
})
const { terminal, componentContent } = toRefs(props)
</script>

<style lang="scss" scoped>
.category-list {
  padding: 0 34px;
  .hom-title {
    font-size: 32px;
    color: #333;
    line-height: 48px;
    margin-bottom: 5px;
    text-align: center;
    font-weight: normal;
  }
  .content-warp {
    display: flex;
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        flex: 1;
        padding: 10px 0 0 10px;
        .item {
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .imgBox {
            padding-bottom: 80%;
            background-color: #e8e8e8;
            position: relative;
          }
          img {
            max-width: 100%;
            height: 100%;
            max-height: 100%;
            position: absolute;
            margin: auto;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            object-fit: contain;
          }
        }
      }
    }
    .number5 {
      display: block;
      li {
        width: 25%;
        float: left;
      }
      li:nth-child(1) {
        width: 50%;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .category-list .content-warp {
    display: block;
    ul {
      margin: -15px 0 0 -15px;
      width: auto;
      li {
        flex: 0 0 50%;
        padding: 15px 0 0 15px;
      }
    }
  }
}
.terminal1,
.terminal2,
.terminal3 {
  &.category-list .content-warp {
    display: block;
    ul {
      margin: -15px 0 0 -15px;
      width: auto;
      li {
        flex: 0 0 50%;
        padding: 15px 0 0 15px;
      }
    }
  }
}
</style>
