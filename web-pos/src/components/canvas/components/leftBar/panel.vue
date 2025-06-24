<template>
  <div class="panelBoxWarp">
    <div class="panelBox" :class="{ on: sidebarShow }">
      <div class="categoryList">
        <div
          v-for="(item, index) of panelShowList"
          :key="index"
          class="itemBox"
        >
          <h3>{{ item.title }}</h3>
          <div class="childList">
            <VueDraggableNext
              class="dragArea list-group"
              :list="item.classList"
              :clone="cloneItem"
              :group="{ name: 'pageEdit', pull: 'clone', put: false }"
              :options="{ sort: false }"
            >
              <div
                v-for="(classItem, i) of item.classList"
                :key="i"
                class="childItem list-group-item"
                @mouseover="hoverItem(classItem)"
                @mouseout="hoverItemOut"
              >
                <div class="childItemWarp">
                  <div class="contentBox">
                    <i class="iconfont" :class="classItem.iconClass" ></i>
                    <span>{{ classItem.title }}</span>
                  </div>
                  <div class="cloneText">组件放置区域</div>
                </div>
              </div>
            </VueDraggableNext>
          </div>
        </div>
      </div>
    </div>
    <div
      class="btnToggle"
      :class="{ on: sidebarShow }"
      @click="sidebarShow = !sidebarShow"
    >
      <i class="iconfont icon-arrow-right" ></i>
      <i class="iconfont icon-arrow-left" ></i>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import panelList from './panelList';
import { VueDraggableNext } from 'vue-draggable-next';
import { canvasStore } from '../../store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { terminal, typeId } = storeToRefs(canvasStoreObj);
const sidebarShow = ref(true);
const isHover = ref('');
function hoverItem (classItem) {
  isHover.value = classItem.title;
}
function hoverItemOut () {
  isHover.value = '';
}
function cloneItem (item) {
  return JSON.parse(JSON.stringify(item));
}

const panelShowList = computed(() => {
  var _panelList = JSON.parse(JSON.stringify(panelList));
  var mewPaneList = _panelList.filter((parent) => {
    const children = parent.classList.filter((child) => {
      return (
        !(child.onlyApp && terminal.value === 4) &&
        !(child.onlyWeixin && [2, 3, 4].includes(terminal.value)) &&
        !(child.onlyAdmin && typeId.value === 3) &&
        !(child.onlyMerchant && typeId.value === 1)
      );
    });
    parent.classList = children;
    return parent;
  });
  console.log(panelList.value);
  return mewPaneList;
});
</script>

<style lang="scss" scoped>
.panelBoxWarp {
  position: relative;
  height: 100%;
}
.panelBox {
  width: 0px;
  min-height: 100%;
  display: flex;
  overflow: hidden;
  transition: 0.2s width ease;
  &.on {
    width: 200px;
  }
  .componentList {
    width: 64px;
    padding: 17px 0;
    text-align: center;
    li {
      position: relative;
      margin-bottom: 18px;
      .iconfont {
        font-size: 24px;
      }
      span {
        font-size: 12px;
        display: block;
      }
      &.on,
      &:hover {
        color: var(--el-color-primary);
        :after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background-color: var(--el-color-primary);
        }
      }
    }
  }
  .categoryList {
    border-left: 1px solid #f0f3f4;
    width: 186px;
    padding: 20px 0 20px 10px;
    .itemBox {
      h3 {
        padding-left: 20px;
        height: 35px;
        line-height: 35px;
        font-size: 16px;
        color: #333333;
        position: relative;
        &:before {
          content: "";
          border-left: 5px solid var(--el-color-primary);
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          position: absolute;
          left: 10px;
          top: 50%;
          margin-top: -4px;
        }
      }
      .childList {
        font-size: 14px;
        color: #333333;
        padding: 20px 10px;
        .list-group {
          display: flex;
          flex-wrap: wrap;
          :hover {
            background: var(--el-color-primary);
            color: #ffffff;
            border-radius: 3px;
            //cursor: move;
          }
          .childItemWarp {
            height: 80px;
          }
          .childItem {
            width: 50%;
            .contentBox {
              height: 100%;
              display: flex;
              flex-flow: column;
              align-items: center;
              justify-content: center;
              cursor: move;
              .iconfont {
                font-size: 30px;
              }
              span {
                margin-top: 5px;
              }
            }
            .cloneText {
              display: none;
            }
          }
        }
      }
    }
  }
}
.btnToggle {
  width: 20px;
  height: 66px;
  background-color: #fff;
  border-radius: 0 20px 20px 0;
  position: absolute;
  right: -20px;
  top: 50%;
  margin-top: -33px;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 9;
  .icon-arrow-left {
    display: none;
  }
  &.on {
    .icon-arrow-left {
      display: block;
    }
    .icon-arrow-right {
      display: none;
    }
  }
}
</style>
