<template>
  <div class="categoryTool">
    <h3 class="toolTit">类别列表</h3>
    <div class="toolBox">
      <div class="itemBox">
        <label>标题</label>
        <el-input
          v-model="activeComponent.componentContent.title"
          maxlength="20"
          placeholder="请输入内容"
        />
      </div>
      <tool-select
        v-model:linkValue="activeComponent.componentContent.textAlign"
        title="文字对齐方式"
        :options="alignList"
      />
      <div class="textTit">添加类别</div>
      <div class="categoryListBox">
        <VueDraggableNext v-model="activeComponent.componentContent.categoryData" handle=".iconDraggable">
          <div
            v-for="(item, index) in activeComponent.componentContent
              .categoryData"
            :key="index"
            class="item"
          >
            <div class="listItemBox">
              <div class="addImgTit" @click="openAddCategory(item, index)">
                <div class="titLeft">
                  <span class="iconfont iconDraggable">&#xe703;</span>
                  <span class="iconfont">&#xe64a;</span>
                  <span>类别</span>
                </div>
                <div class="titRight">
                  <span
                    class="iconfont"
                    @click.stop="deleteItem(item, index)"
                  >&#xe633;</span>
                  <span
                    class="iconfont"
                    v-html="categoryCurrent === index ? '&#xe660;' : '&#xe695;'"
                  />
                </div>
              </div>
              <div v-show="categoryCurrent === index" class="addBox">
                <div class="addContent">
                  <tool-single-img
                    v-model:imageUrl="item.img"
                    tip="建议尺寸5:4等比例图片"
                  />
                  <div
                    v-if="!item.selClassData.name"
                    class="addCategoryBox"
                    @click="addItemCategory(item, index)"
                  >
                    <span class="iconfont">&#xe685;</span>添加类别
                  </div>
                  <div v-else class="categoryName">
                    <span>{{ item.selClassData.name }}</span>
                    <div class="operation">
                      <span
                        class="iconfont"
                        @click="replaceCategory(index)"
                      >&#xe66c;</span>
                      <span
                        class="iconfont"
                        @click="deleteCategory(index)"
                      >&#xe633;</span>
                    </div>
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
    <div
      v-show="activeComponent.componentContent.categoryData.length < 6"
      class="addImgBtn"
      @click="addCategory"
    >
      <span class="iconfont">&#xe64a;</span>添加类别
    </div>
    <div
      v-show="activeComponent.componentContent.categoryData.length === 6"
      class="addImgBtn"
    >
      <span class="iconfont">&#xe608;</span>最多只能添加6个
    </div>
    <el-dialog v-model="dialogCategory" title="选择类别" width="480px">
      <category-select ref="categorySelectRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCategory = false">取 消</el-button>
          <el-button type="primary" @click="categoryChanged">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <BgSelect :hasComBgColor="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import categorySelect from '../toolModule/category-select.vue'
import ToolSingleImg from '../toolModule/tool-single-img.vue'
import ToolSelect from '../toolModule/tool-select.vue'
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);


const alignList = ref([
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
  {
    id: 3,
    label: '居右',
    value: 'right',
  },
])
const categoryCurrent = ref(null)
const dialogCategory = ref(false)
const categorySelectRef = ref();

function openAddCategory (item, index) {
  if (categoryCurrent.value === index) {
    categoryCurrent.value = null
    return false
  }
  categoryCurrent.value = index
}
// 添加类别
function addCategory () {
  activeComponent.value.componentContent.categoryData.push({
    selClassData: [],
    img: '',
  })
}
// 删除内容
function deleteItem (item, index) {
  ElMessageBox.confirm('确定删除此项？')
    .then(() => {
      activeComponent.value.componentContent.categoryData.splice(index, 1)
    })
    .catch(() => {})
}
function addItemCategory (item, index) {
  dialogCategory.value = true
  categoryCurrent.value = index
}
// 替换类别
function replaceCategory (index) {
  dialogCategory.value = true
  categoryCurrent.value = index
}
// 删除已选类别
function deleteCategory (index) {
  activeComponent.value.componentContent.categoryData[index].selClassData =
        ''
}
// 选择类别
function categoryChanged () {
  const nodesObj = categorySelectRef.value.cascader.getCheckedNodes()
  if (nodesObj) {
    var data = nodesObj[0].data
    dialogCategory.value = false
    activeComponent.value.componentContent.categoryData[
      categoryCurrent.value
    ].id = data.id
    activeComponent.value.componentContent.categoryData[
      categoryCurrent.value
    ].selClassData = data
  }
}

</script>

<style lang="scss" scoped>
.categoryTool {
  padding: 20px 20px 0 20px;
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
    .textTit {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
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
  }
  :deep(.ql-container) {
    height: 200px;
  }
  .categoryListBox {
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
        padding: 13px;
        .addCategoryBox {
          width: 100%;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: var(--el-color-primary);
          border-radius: 4px;
          margin: 15px 0;
          cursor: pointer;
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
        .categoryName {
          height: 35px;
          display: flex;
          align-items: center;
          background: #e9e9e9;
          padding: 0 10px;
          justify-content: space-between;
          margin: 15px 0;
          span {
            color: #333333;
          }
          span {
            color: #333333;
          }
          .operation {
            display: flex;
            span {
              width: 35px;
              display: block;
              height: 35px;
              line-height: 35px;
              text-align: center;
              cursor: pointer;
            }
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
  .classList {
    .classTit {
      display: flex;
      justify-content: space-between;
      height: 50px;
      align-items: center;
      padding: 0 20px;
      background: #eeeeee;
      span {
        display: block;
        width: 100px;
        text-align: center;
      }
    }
    .classListBox {
      max-height: 300px;
      overflow-y: auto;
      .classItemBox {
        display: flex;
        padding: 0 20px;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        div {
          display: flex;
          flex: 1;
          justify-content: space-between;
          height: 50px;
          align-items: center;
          span:nth-child(1) {
            padding-left: 5px;
          }
          span {
            display: block;
            width: 100px;
            text-align: left;
          }
          span:nth-child(2) {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
