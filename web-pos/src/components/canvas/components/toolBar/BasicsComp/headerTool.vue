<template>
  <div class="headerTool">
    <h3 class="toolTit">头部设置</h3>
    <div class="imgBox">
      <div class="subTitle">设置LOGO</div>
      <tool-single-img
        v-model:imageUrl="activeComponent.componentContent.imageUrl"
        tip="建议尺寸: 高度100px, 宽度自适应"
      />
    </div>

    <el-radio-group
      class="radioGroup"
      v-model="activeComponent.componentContent.type">
      <el-radio-button :label="1">搜索</el-radio-button>
      <el-radio-button :label="2">选项卡</el-radio-button>
    </el-radio-group>

    <div v-if="activeComponent.componentContent.type === 1">
      <el-form
        ref="keyListFormRef"
        :model="activeComponent.componentContent"
        label-width="0px"
      >
        <VueDraggableNext
          :list="activeComponent.componentContent.keyList"
          handle=".iconDraggable"
        >
          <div
            class="draggableItem"
            v-for="(item,index) in activeComponent.componentContent.keyList"
            :key="index">
            <span class="iconfont iconDraggable">&#xe703;</span>
            <div class="cont">
              <el-form-item
                :prop="`keyList.${index}`"
                :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                <el-input
                  v-model="activeComponent.componentContent.keyList[index]"
                  placeholder="请输入" />
              </el-form-item>
            </div>
            <div
              class="deleteItem"
              @click="delKeyItem(item, index)">
              <span class="iconfont">&#xe633;</span>
            </div>
          </div>
        </VueDraggableNext>
        <div
          class="addImgBtn"
          @click="addKeyItem">
          <span class="iconfont">&#xe685;</span>添加热词
        </div>
      </el-form>
    </div>
    <div v-else>
      <el-form
        ref="tabsFormRef"
        :model="activeComponent.componentContent"
        label-width="40px"
      >
        <VueDraggableNext
          :list="activeComponent.componentContent.tabs"
          handle=".iconDraggable"
        >
          <div
            class="draggableItem draggableItemMultiple"
            v-for="(item,index) in activeComponent.componentContent.tabs"
            :key="index">
            <span class="iconfont iconDraggable">&#xe703;</span>
            <div class="cont">
              {{ item.name }}
            </div>
            <div
              class="deleteItem"
              @click="handleDeleteCategory(index)">
              <span class="iconfont">&#xe633;</span>
            </div>
          </div>
        </VueDraggableNext>
        <div
          class="addImgBtn"
          @click="handleOpenCategory">
          <span class="iconfont">&#xe685;</span>添加分类
        </div>
      </el-form>
    </div>
    <BgSelect :hasComBgColor="false" />
    <el-dialog
      v-model="categoryVisible"
      width="600px"
      title="选择类别">
      <category-select ref="categorySelectRef" v-if="categoryVisible" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleAddCategory">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { VueDraggableNext } from 'vue-draggable-next';
import ToolSingleImg from '../toolModule/tool-single-img.vue'
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
import { ElMessage, ElMessageBox } from "element-plus";
import CategorySelect from "@/components/canvas/components/toolBar/toolModule/category-select.vue";
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";

const canvasStoreObj = canvasStore();
const {activeComponent} = storeToRefs(canvasStoreObj);

// 添加热词
function addKeyItem() {
  activeComponent.value.componentContent.keyList.push('');
}

// 删除热词
function delKeyItem(item, index) {
  ElMessageBox.confirm('确定删除此项？')
    .then(() => {
      activeComponent.value.componentContent.keyList.splice(index, 1);
    })
    .catch(() => {
    });
}


/************************** 分类相关 ********************************/
const categorySelectRef = ref()
const categoryVisible = ref(false)

// 打开添加分类
function handleOpenCategory() {
  categoryVisible.value = true
}

// 添加分类confirm
function handleAddCategory() {
  const nodesObj = categorySelectRef.value.cascader.getCheckedNodes();
  if (!(nodesObj && nodesObj.length > 0)) return ElMessage.warning(`请选择类别`)
  const {data, label} = nodesObj[0]
  activeComponent.value.componentContent.tabs.push({
    name: label,
    category: data
  })
  categoryVisible.value = false
}

// 删除板块
function handleDeleteCategory(index) {
  ElMessageBox.confirm('确定删除此项？')
    .then(() => {
      activeComponent.value.componentContent.tabs.splice(index, 1);
    })
    .catch(() => {
    });
}

</script>

<style
  lang="scss"
  scoped>
.headerTool {
  padding: 20px 20px 0 20px;

  .toolTit {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }

  .subTitle {
    margin-bottom: 10px;
  }

  .radioGroup {
    margin: 20px 0;
  }

  .draggableItem {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    margin-bottom: 18px;
    background-color: #f7f7f7;
    border-radius: 5px;

    .iconDraggable {
      font-size: 28px;
      line-height: 32px;
      cursor: move;
    }

    .cont {
      flex: 1;
      margin: 0 10px 0 5px;

      .el-form-item {
        margin-bottom: 0;

        :deep(.el-form-item__label) {
          &:before {
            display: none;
          }
        }
      }
    }

    .deleteItem {
      .iconfont {
        font-size: 20px;
        line-height: 32px;
      }
    }

    &.draggableItemMultiple {
      margin-bottom: 5px;
      align-items: center;

      .cont {
        .el-form-item {
          margin-bottom: 18px;

          &.last {
            margin-bottom: 0;
          }
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
    margin-top: 20px;

    span {
      font-size: 20px;
      margin-right: 5px;
    }
  }
}


</style>
