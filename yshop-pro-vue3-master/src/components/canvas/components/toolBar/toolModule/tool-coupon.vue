<template>
  <div class="tool-coupon">
    <div v-show="couponBtnVisible" class="addCouponBox">
      <div v-if="couponList && couponList.length > 0" class="couponBox">
        <ul>
          <li v-for="(item, index) in couponList" :key="index">
            <h4>{{ item.couponName ? item.couponName : item.activityName }}</h4>
            <a class="btn-close">
              <i class="icon iconfont icon-close" @click="delCoupon(index)" />
            </a>
          </li>
        </ul>
      </div>
      <div class="addImgBtn" @click="addCoupon">
        <span class="iconfont">&#xe685;</span>添加优惠券
      </div>
    </div>
    <el-dialog v-model="couponDialogVisible" title="选择优惠券" width="1000">
      <CouponSelect ref="couponSelect" :selected-coupon="selectedCoupon" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="couponDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="couponChanged">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import CouponSelect from './coupon-select.vue';
import { canvasStore } from '@/components/canvas/store/canvas';
const canvasStoreObj = canvasStore();
const { setCouponNum } = canvasStoreObj;
const props = defineProps({
  selectedCoupon: {
    type: Array,
    default: () => [],
  },
  couponList: {
    type: Array,
    default: () => [],
  },
});
const { selectedCoupon, couponList } = toRefs(props);
const couponBtnVisible = ref(true);
const couponDialogVisible = ref(false);
const couponSelect = ref();
const couponListIds = ref([])
const emits = defineEmits(['update:couponList', 'update:selectedCoupon']);

// 添加优惠券
function addCoupon () {
  couponDialogVisible.value = true;
  // this.$nextTick(function () {
  //   _this.$refs.couponSelect.resetTableData(_this.couponList);
  // })
}
// 确定选择
function couponChanged () {
  couponDialogVisible.value = false;
  const couponList = couponSelect.value.multipleSelection;
  couponListIds.value = [];
  couponList.forEach((item) => {
    couponListIds.value.push(item.id);
  });
  emits('update:couponList', couponList);
  emits('update:selectedCoupon', couponListIds.value);
  setCouponNum();
}
// 删除已选优惠券
function delCoupon (index) {
  couponList.value.splice(index, 1);
  couponListIds.value.splice(index, 1);
  emits('update:couponList', couponList.value);
  emits('update:selectedCoupon', couponListIds.value);
  setCouponNum();
}
</script>

<style lang="scss" scoped>
.selectMode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .modeRight {
    display: flex;
    .iconfont {
      cursor: pointer;
    }
  }
  :deep(.el-radio) {
    margin-right: 0;
  }
  :deep(.el-radio__label) {
    padding-left: 5px;
  }
  .mode2 {
    margin-left: 10px;
    span {
      font-size: 14px;
      color: #999999;
    }
  }
}
.addCouponBox {
  background: #f6f7f9;
  padding: 10px 13px;
  margin: 20px 0 0;
  .addImgBtn {
    border-radius: 4px;
    background: var(--el-color-primary);
    text-align: center;
    height: 36px;
    color: #ffffff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    span {
      font-size: 20px;
      margin-right: 5px;
    }
  }
}

.couponBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  ul {
    width: 100%;
    li {
      height: 40px;
      line-height: 40px;
      text-indent: 10px;
      position: relative;
      margin-bottom: 10px;
      width: 100%;
      box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
      .btn-close {
        position: absolute;
        right: -8px;
        top: -8px;
        line-height: 16px;
        display: none;
        i {
          display: block;
          color: #c3c3c3;
        }
      }
      &:hover .btn-close {
        display: block;
      }
    }
  }
}
</style>
