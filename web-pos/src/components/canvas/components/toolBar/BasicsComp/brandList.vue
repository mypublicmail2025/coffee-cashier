<template>
  <div class="brandListTool">
    <h3 class="toolTit">品牌列表</h3>
    <div class="toolBox">
      <div class="itemBox">
        <label>标题</label>
        <el-input
          v-model="activeComponent.componentContent.title"
          maxlength="20"
          placeholder="请输入内容"
        />
      </div>
      <div class="textTit">内容</div>
      <div class="imgListBox">
        <VueDraggableNext v-model="activeComponent.componentContent.imgList">
          <div
            v-for="(item, index) in activeComponent.componentContent.imgList"
            :key="index"
            class="item"
          >
            <div class="listItemBox">
              <div class="addImgTit" @click="openAddImg(item, index)">
                <div class="titLeft">
                  <span class="iconfont">&#xe703;</span>
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
                    v-html="
                      activeComponent.componentContent.imgCurrent === index
                        ? '&#xe660;'
                        : '&#xe695;'
                    "
                  />
                </div>
              </div>
              <div
                v-show="activeComponent.componentContent.imgCurrent === index"
                class="addBox"
              >
                <div class="addContent">
                  <tool-single-img
                    v-model:imageUrl="item.imgData"
                    tip="建议尺寸5:4等比例图片"
                  />
                  <tool-select-link
                    v-model:linkObj="item.linkObj"
                  />
                  <div class="itemImgTit itemBox">
                    <label>标题</label>
                    <el-input
                      v-model="item.title"
                      maxlength="20"
                      placeholder="请输入内容"
                    />
                  </div>
                </div>
                <div class="deleteItem" @click="deleteItem(item, index)">
                  <span class="iconfont">&#xe633;</span>删除内容
                </div>
              </div>
            </div>
          </div>
        </VueDraggableNext>
      </div>
    </div>
    <div class="addImgBtn" @click="addImgText">
      <span class="iconfont">&#xe64a;</span>添加品牌图
    </div>
    <div class="itemChoice">
      <div class="Tit">查看更多</div>
      <div
        class="Info"
        v-text="activeComponent.componentContent.showMore ? '显示' : '隐藏'"
      />
      <div class="modifyBox">
        <el-checkbox
          v-model="activeComponent.componentContent.showMore"
        />
      </div>
    </div>
    <tool-select-link
      v-if="activeComponent.componentContent.showMore"
      v-model:linkObj="activeComponent.componentContent.linkObj"
      title=""
    />
    <BgSelect :hasComBgColor="false" />
    <!--    <el-dialog-->
    <!--      title="提示"-->
    <!--      v-model="dialogVisible"-->
    <!--      width="30%"-->
    <!--      :before-close="deleteItem"-->
    <!--    >-->
    <!--      <span>点击确定删除此项</span>-->
    <!--      <template #footer>-->
    <!--        <span class="dialog-footer">-->
    <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="dialogVisible = false"-->
    <!--          >确 定</el-button-->
    <!--        >-->
    <!--      </span>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next'
import ToolSelectLink from '../toolModule/tool-select-link.vue'
import ToolSingleImg from '../toolModule/tool-single-img.vue'
import { canvasStore } from '@/components/canvas/store/canvas';
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);

function openAddImg (item, index) {
  if (activeComponent.value.componentContent.imgCurrent === index) {
    activeComponent.value.componentContent.imgCurrent = null
    return false
  }
  activeComponent.value.componentContent.imgCurrent = index
}
// 添加图文
function addImgText () {
  activeComponent.value.componentContent.imgList.push({
    title: '标题',
    imgData: '',
    url: '',
  })
}
// 删除内容
function deleteItem (item, index) {
  ElMessageBox.confirm('确定删除此项？')
    .then(() => {
      activeComponent.value.componentContent.imgList.splice(index, 1)
    })
}
</script>

<style lang="scss" scoped>
.brandListTool {
  padding: 20px 20px 0px 20px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .toolBox {
    padding-bottom: 10px;
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
      margin-top: 30px;
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
            span {
              color: #7d7e80;
            }
            span:nth-child(1) {
              font-size: 28px;
            }
            span:nth-child(2) {
              font-size: 25px;
              margin: 0 6px;
            }
            span:nth-child(3) {
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
          .addImgBox {
            margin-bottom: 10px;
            :deep(.el-upload) {
              width: 100%;
              .el-upload-dragger {
                width: 100%;
              }
            }
            .uploadTip {
              text-align: center;
              font-size: 14px;
              color: #999999;
              line-height: 25px;
              margin-bottom: 10px;
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
    span {
      font-size: 20px;
      margin-right: 5px;
    }
  }

  .itemChoice {
    font-size: 14px;
    display: flex;
    margin: 20px 0 10px;
    align-items: center;
    .Tit {
      color: #888888;
      margin-right: 10px;
      width: 70px;
    }
    .Info {
      color: #222222;
    }
    .modifyBox {
      text-align: right;
      margin-left: auto;
    }
  }
}
</style>
