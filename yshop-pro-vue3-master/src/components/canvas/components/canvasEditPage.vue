<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="layout hom-layout"
  >
    <VueDraggableNext
      class="dragArea list-group"
      :list="componentsData"
      group="pageEdit"
      :move="checkMove"
      filter=".undraggable"
      @end="pageAdd"
      @change="pageChange"
    >
      <div
        v-for="(item, index) in componentsData"
        :key="index"
        class="list-group-item"
        :class="[
          {
            on: activeComponentIndex === index ,
            undraggable: item.undraggable },
          'item-' + item.type,
        ]"
        @click="selectComponent(item, index)"
      >
        <component
          :is="componentMap[item.type]"
          v-show="!item.isEmpty"
          v-model:isNoData="item.isEmpty"
          :component-content="item.componentContent"
          :terminal="terminal"
          :type-id="typeId"
          :shop-id="shopId"
          @checkLoading="checkLoading"
        />
        <div v-show="item.isEmpty" class="no-data">
          <i class="iconfont icon-kong" ></i>
          <p>暂无数据<br />请在右边窗口编辑内容</p>
        </div>
        <div class="btns">
          <span @click="delComponent(item, index)"><i class="iconfont icon-shanchu" ></i></span>
        </div>
      </div>
    </VueDraggableNext>
  </div>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next'
import componentMap from './canvasShow/componentMap'
import { ref, toRefs, watch, onBeforeMount } from 'vue';
import { canvasStore } from '../store/canvas'
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { componentsData } = storeToRefs(canvasStoreObj);
const { setActiveComponent } = canvasStoreObj;
const emits = defineEmits(['checkLoading', 'showRightBox'])
const props = defineProps({
  terminal: {
    type: Number,
    default: 4,
  },
  typeId: {
    type: Number,
    default: 1,
  },
  shopId: {
    type: Number,
    default: 0,
  },
})
const { terminal, typeId, shopId } = toRefs(props)
const activeComponentIndex = ref(-1)
const loading = ref(false)

onBeforeMount(() => {
  localStorage.setItem('isEdit', true)
})

// 画布添加或者移动了组件
function pageChange (e) {
  if (e.added) {
    if (e.added.element.type === 'header') {
      var headerArr = componentsData.value.filter((v) => {
        return v.type === 'header'
      })
      if (headerArr.length >= 2) {
        componentsData.value.splice(e.added.newIndex, 1)
        ElMessage.warning('头部组件最多只能存在一个。')
      } else if (
        headerArr.length === 1 &&
          componentsData.value[0].type !== 'header'
      ) {
        componentsData.value.splice(e.added.newIndex, 1)
        componentsData.value.unshift(e.added.element)
      }
      activeComponentIndex.value = 0
      e.added.element.index = 0
      setActiveComponent(e.added.element)
    } else {
      activeComponentIndex.value = e.added.newIndex
      e.added.element.index = e.added.newIndex
      setActiveComponent(e.added.element)
    }
  }
  if (e.moved) {
    activeComponentIndex.value = e.moved.newIndex
    e.moved.element.index = e.moved.newIndex
    setActiveComponent(e.moved.element)
  }
  emits('showRightBox', true)
}
// 拖动检查
function checkMove (e) {
  // console.log(e, 'checkMove')
  // 不允许停靠
  if (e.relatedContext.element.type === 'header') return false
  // 不允许拖拽
  if (e.draggedContext.element.type === 'header') return false
}
function pageAdd () {
  return false
}
// 选中组件
function selectComponent (item, index) {
  console.log(item, index)
  activeComponentIndex.value = index
  item.index = index
  setActiveComponent(item)
  emits('showRightBox', true)
}
// 删除组件
function delComponent (item, index) {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      activeComponentIndex.value = -1
      componentsData.value.splice(index, 1)
      emits('showRightBox', false)
    })
    .catch(() => {})
}
function checkLoading () {
  if (typeof uni !== 'undefined') {
    uni.getStorage({
      key: 'sendNum',
      success: function (res) {
        const sendNum = res.data
        loading.value = parseInt(sendNum) !== 0
      },
    })
  } else {
    const sendNum = localStorage.getItem('sendNum')
    loading.value = parseInt(sendNum) !== 0
  }
}
// 检查组件是否为空
function checkIsNoData (dataList) {
  for (let i = 0; i < dataList.length; i++) {
    const newVal = dataList[i].componentContent
    let isEmpty = true
    let _data = ''
    switch (dataList[i].type) {
      case 'banner':
        _data = newVal.bannerData
        _data.forEach(function (value) {
          if (value.bannerUrl) {
            isEmpty = false
          }
        })
        break
      case 'header':
      case 'notice':
      case 'text':
      case 'imageTextNav':
      case 'imageText':
      case 'imageTextList':
      case 'brandList':
      case 'categoryList':
      case 'assistDiv':
      case 'vip':
      case 'live':
      case 'videoBox':
        isEmpty = false
        break
      case 'productList':
        _data = newVal.productData
        if (
          (_data.sourceType === '1' && _data.productIdList.length > 0) ||
            (_data.sourceType === '2' && _data.categoryId !== 0)
        ) {
          isEmpty = false
        }
        break
      case 'custom':
        _data = newVal.imgData
        _data.forEach(function (value) {
          if (value.src) {
            isEmpty = false
          }
        })
        break
      case 'groupList':
        isEmpty = false
        break
      case 'spikeList':
        if (newVal.id || newVal.sourceType === '1') {
          isEmpty = false
        }
        break
      case 'discountList':
        if (newVal.id || newVal.sourceType === '1') {
          isEmpty = false
        }
        break
      case 'priceList':
        if (newVal.priceId) {
          isEmpty = false
        }
        break
      case 'coupon':
        if (newVal.selectedCoupon.length > 0) {
          isEmpty = false
        }
        break
      case 'newProduct':
        _data = newVal.productData
        if (
          (_data.sourceType === '1' && _data.productIdList.length > 0) ||
            (_data.sourceType === '2' && _data.categoryId !== 0)
        ) {
          isEmpty = false
        }
        break
      case 'shop':
        _data = newVal.imgTextData
        _data.forEach(function (value) {
          if (value.img) {
            isEmpty = false
          }
        })
        break
    }
    dataList[i].isEmpty = isEmpty
    // this.$forceUpdate()
  }
  console.log(dataList)
}

watch(() =>
  componentsData,
(newVal) => {
  checkIsNoData(newVal.value)
}, { immediate: false, deep: true })
</script>

<style lang="scss" scoped>
.hom-layout {
  background-color: #F5F5F5;
  :deep(.sortable-chosen) {
    .contentBox {
      display: none;
    }
    .cloneText {
      display: block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      text-align: center;
      background-color: var(--el-color-primary);
      color: #fff;
    }
  }
  .list-group {
    height: 1065px
  }
  .list-group-item {
    position: relative;
    cursor: move;
    min-height: 100px;
    &.item-assistDiv,
    &.item-notice,
    &.item-text {
      min-height: 0px;
    }
    .btns {
      display: none;
    }
    &:hover {
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border: 1px var(--el-color-primary) dashed;
        z-index: 2;
      }
    }
    &.on {
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border: 1px var(--el-color-primary) solid;
        z-index: 2;
      }
      .btns {
        display: block;
        position: absolute;
        right: 0px;
        top: 50%;
        margin-top: -13px;
        z-index: 3;
        span {
          display: block;
          width: 26px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #666;
          background-color: #fff;
          box-shadow: 0 0 2px rgba(51, 51, 51, 0.2);
          cursor: pointer;
        }
      }
    }
  }
}
.no-data {
  width: 100%;
  display: flex;
  height: 300px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: #999;
  text-align: center;
  font-size: 16px;
  line-height: 1.8;
  .iconfont {
    font-size: 100px;
    color: var(--el-color-primary);
    margin-right: 50px;
  }
}
</style>

<style lang="scss">
.warp {
  width: 680px;
  margin: 0 auto;
  max-width: 100%;
  &.terminal4 {
    width: 1200px;
    max-width: 100%;
  }
}
.flex-box {
  display: flex;
}
</style>
