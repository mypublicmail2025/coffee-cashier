<template>
  <div class="shopTopTool">
    <h3 class="toolTit">轮播图</h3>
    <div class="tabBox">
      <div class="toolBox">
        <div class="numberGroup">
          <div class="title">
            <span>图片高度</span>
          </div>
          <div class="itemBox">
            <div class="block">
              <el-slider
                v-model="activeComponent.componentContent.height"
                :show-input-controls="false"
                input-size="mini"
                :max="1000"
                show-input
              />
            </div>
          </div>
        </div>
        <div class="imgListBox">
          <VueDraggableNext
            v-model="activeComponent.componentContent.bannerData"
            handle=".iconDraggable"
          >
            <div
              v-for="(item, index) in activeComponent.componentContent
                .bannerData"
              :key="index"
              class="item"
            >
              <div class="listItemBox">
                <div class="addImgTit" @click="openAddImg(item, index)">
                  <div class="titLeft">
                    <span class="iconfont iconDraggable">&#xe703;</span>
                    <span class="iconfont">&#xe64a;</span>
                    <span>图片</span>
                  </div>
                  <div class="titRight">
                    <span
                      class="iconfont"
                      @click.stop="deleteItem(item, index)"
                    >&#xe633;</span>
                    <span
                      class="iconfont"
                      v-html="imgCurrent === index ? '&#xe660;' : '&#xe695;'"
                    />
                  </div>
                </div>
                <div v-show="imgCurrent === index" class="addBox">
                  <div class="addContent">
                    <tool-single-img
                      v-model:imageUrl="item.bannerUrl"
                      :tip="terminal == 4? '建议尺寸: 宽度1920px': '建议尺寸: 宽度680px'"
                    />
                    <tool-select-link
                      v-model:linkObj="item.linkObj"
                      title="图片链接"
                    />
                  </div>
                  <div class="deleteItem" @click="deleteItem(item, index)">
                    <span class="iconfont">&#xe633;</span>删除内容
                  </div>
                </div>
              </div>
            </div>
          </VueDraggableNext>
        </div>
        <div class="addImgBtn" @click="addImgText">
          <span class="iconfont">&#xe64a;</span>添加图片
        </div>
      </div>
    </div>
    <BgSelect />
    <el-dialog v-model:visible="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next';
import { ref } from 'vue';
import ToolSelectLink from '../toolModule/tool-select-link.vue';
import ToolSingleImg from '../toolModule/tool-single-img.vue';
import { canvasStore } from '@/components/canvas/store/canvas';
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent, terminal } = storeToRefs(canvasStoreObj);
// data
const dialogImageVisible = ref(false);
const dialogImageUrl = ref('');
const imgCurrent = ref(null);

// 添加类别
function openAddImg (item, index) {
  if (imgCurrent.value === index) {
    imgCurrent.value = null;
    return false;
  }
  imgCurrent.value = index;
}
// 添加图文
function addImgText () {
  activeComponent.value.componentContent.bannerData.push({
    title: '',
    imgData: '',
    url: '',
  });
}
// 删除内容
function deleteItem (item, index) {
  ElMessageBox.confirm('确定删除此项？')
    .then(() => {
      activeComponent.value.componentContent.bannerData.splice(index, 1);
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
.shopTopTool {
  padding: 20px 20px 0px 20px;
  .topTit {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 20px;
    span {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #333333;
    }
    span:last-child {
      font-weight: bold;
      width: 100px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .titleBox {
    display: flex;
    justify-content: space-between;
  }
  .btnSelect {
    margin-top: 30px;
  }
  .toolBox {
    padding-bottom: 10px;
    .modelTit {
      font-size: 14px;
      color: #333333;
      margin-top: 10px;
    }
    .itemBox {
      label {
        font-size: 14px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      margin-bottom: 15px;
    }
    .imgListBox {
      .item {
        border: 1px solid #e8eaec;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      .listItemBox {
        .addImgTit {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f6f7f9;
          cursor: pointer;
          .titLeft {
            display: flex;
            align-items: center;
            .iconfont {
              color: #7d7e80;
            }
            .iconfont:nth-child(1) {
              font-size: 28px;
              cursor: move;
            }
            .iconfont:nth-child(2) {
              font-size: 25px;
              margin: 0 6px;
            }
            .iconfont:nth-child(3) {
              font-size: 14px;
            }
          }
          .titRight {
            display: flex;
            align-items: center;
            span:nth-child(1) {
              width: 40px;
              text-align: center;
              display: block;
              height: 30px;
              line-height: 30px;
            }
          }
        }
        .addContent {
          padding: 5px 13px;
          .imgIsShow {
            display: flex;
            justify-content: space-between;
            margin: 18px 0 22px 0;
            span {
              font-size: 14px;
              color: #666666;
            }
          }
          .deleteItem {
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
            margin-bottom: 10px;
            span {
              font-size: 18px;
              color: #ffffff;
              margin-right: 5px;
            }
          }
        }
        .deleteItem {
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f7f9;
          cursor: pointer;
          color: var(--el-color-primary);
          font-size: 14px;
          span {
            font-size: 16px;
            margin-right: 5px;
          }
        }
      }
    }
    .textTit {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
  }
  :deep(.el-select) {
    width: 100%;
  }
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
    margin-bottom: 30px;
    span {
      font-size: 20px;
      margin-right: 5px;
    }
  }
  .labelList {
    .addLabelBox {
      padding: 10px;
    }
  }
}
</style>
