<template>
  <div class="brandListTool">
    <h3 class="toolTit">图文列表</h3>
    <div class="toolBox">
      <div class="itemBox">
        <label>标题</label>
        <el-input
          v-model="activeComponent.componentContent.title"
          maxlength="20"
          placeholder="请输入内容"
        />
      </div>
      <div class="itemBox">
        <label>文字对齐方式</label>
        <el-select
          v-model="activeComponent.componentContent.textAlign"
          placeholder="请选文字对齐方式"
        >
          <el-option
            v-for="item in alignList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="textTit">内容</div>
      <div class="imgListBox">
        <VueDraggableNext v-model="activeComponent.componentContent.imgTextData" handle=".iconDraggable">
          <div
            v-for="(item, index) in activeComponent.componentContent
              .imgTextData"
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
                  <div class="imgIsShow">
                    <span>图片是否展示</span>
                    <el-switch
                      v-model="item.isShow"
                      active-color="var(--el-color-primary)"
                      inactive-color="#E8EAEC"
                    />
                  </div>
                  <tool-single-img
                    v-model:imageUrl="item.imgData"
                    tip="建议尺寸5:4等比例图片"
                  />
                  <div class="itemImgTit itemBox">
                    <label>标题</label>
                    <el-input
                      v-model="item.title"
                      maxlength="20"
                      placeholder="请输入内容"
                    />
                  </div>
                  <div class="itemBox">
                    <label>描述内容</label>
                    <el-input
                      v-model="item.describe"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      resize="none"
                      maxlength="200"
                    />
                  </div>
                  <tool-select-link
                    v-model:linkObj="item.linkObj"
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
    </div>
    <div class="addImgBtn" @click="addImgText">
      <span class="iconfont">&#xe64a;</span>添加图文
    </div>
    <BgSelect :hasComBgColor="false" />
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import ToolSingleImg from '../toolModule/tool-single-img.vue'
import ToolSelectLink from '../toolModule/tool-select-link.vue'
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);
const data = reactive({
  alignList: [
    {
      id: 1,
      label: '居左',
      value: 'left',
    },
    {
      id: 2,
      label: '居中',
      value: 'center',
    },
  ],
  imgCurrent: null
})
function openAddImg (item, index) {
  if (data.imgCurrent === index) {
    data.imgCurrent = null
    return false
  }
  data.imgCurrent = index
}
// 添加图文
function addImgText () {
  activeComponent.value.componentContent.imgTextData.push({
    title: '',
    isShow: true,
    imgData: '',
    linkObj: {
      selectValue: '',
      selectName: '',
      typeText: '',
      url: '',
    },
  })
}
// 删除内容
function deleteItem (item, index) {
  ElMessageBox.confirm('确定删除此项？')
    .then(() => {
      activeComponent.value.componentContent.imgTextData.splice(index, 1)
    })
    .catch(() => {})
}

const { alignList, imgCurrent } = toRefs(data)
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
              cursor: move;
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
}
</style>
