<template>
  <div class="coupon-item">
    <div class="coupon-left">
      <!-- 折扣力度 -->
      <div class="discount">
        <div class="unit pre-unit" v-if="item.couponType === 1">
          ￥
        </div>
        {{item.couponType === 1 ? item.couponValue : item.discount}}
        <div class="unit" v-if="item.couponType === 2">
          折
        </div>
      </div>
      <div class="type" v-if="componentContent.arrangeType === '多行多列'">
        {{item.couponType === 1 ? '满减券' : '折扣券'}}
      </div>
    </div>
    <div class="coupon-right">
      <div class="info">
        <div class="type" v-if="componentContent.arrangeType === '一行一个'">
          {{item.couponType === 1 ? '满减券' : '折扣券'}}
        </div>
        <div class="tip">
          {{item.threshold!==0?`(满${item.threshold}元使用)`:'无门槛使用'}}
        </div>
      </div>
      <!-- button -->
      <div class="button get-coupon" @click="receiveCoupon(item)">
        领取
      </div>
    </div>
  </div>
</template>
<script setup>
import {toRefs} from "vue";

const emits = defineEmits(['receive'])
const props = defineProps({
  item: {
    type: Object,
    default () {
      return {}
    },
  },
  componentContent: {
    type: Object,
    default () {
      return {}
    },
  },
});
const { item, componentContent } = toRefs(props);
function receiveCoupon (item) {
  emits('receive', item)
}

</script>

<style lang="scss" scoped>
.coupon-box{
  padding: 0 35px;
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
      justify-content: space-between;
      .coupon-item {
        width: 309px;
        height: 120px;
        background-image: url('https://b2c-pro-static-dev.zkthink.com/static/images/canvas/bg-coupon-m.png');
        &:nth-child(2){
          margin-top: 0;
        }
        .coupon-left{
          width: 138px;
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
          width: 100px;
          height: 32px;
          border-radius: 16px;
          font-size: 20px;
        }
      }
    }
  }
}

</style>
