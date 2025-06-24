<template>
  <div class="textTool">
    <h3 class="toolTit">公告设置</h3>
    <div class="operationBox">
      <el-form
        ref="tabsFormRef"
        :model="activeComponent.componentContent"
        label-width="0px"
      >
      <VueDraggableNext
        v-model="activeComponent.componentContent.list"
      >
        <div class="draggableItem draggableItemMultiple" v-for="(item,index) in activeComponent.componentContent.list" :key="index">
          <span class="iconfont iconDraggable">&#xe703;</span>
          <div class="cont">
            <el-form-item
:prop="`list.${index}.title`"
                          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
              <el-input v-model="activeComponent.componentContent.list[index].title" placeholder="请输入公告标题" />
            </el-form-item>
            <el-form-item
:prop="`list.${index}.link`"
                          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
              <tool-select-link
                v-model:linkObj="activeComponent.componentContent.list[index].link"
                title=""
              />
            </el-form-item>
          </div>
          <div class="deleteItem" @click="delItem(item, index)">
            <span class="iconfont">&#xe633;</span>
          </div>
        </div>
      </VueDraggableNext>
      <div class="addImgBtn" @click="addItem">
        <span class="iconfont">&#xe685;</span>添加公告
      </div>
      </el-form>
    </div>
    <BgSelect />
  </div>
</template>
<script setup>
import { VueDraggableNext } from 'vue-draggable-next';
import { canvasStore } from '@/components/canvas/store/canvas';
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);

// 添加板块
function addItem () {
  activeComponent.value.componentContent.list.push({
    title: '',
    link: {
      selectValue: '',
      selectName: '',
      typeText: '',
      url: '',
    }
  });
}

// 删除板块
function delItem (item, index) {
  ElMessageBox.confirm('确定删除此项？')
    .then(() => {
      activeComponent.value.componentContent.list.splice(index, 1);
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
.textTool {
  padding: 20px 20px 0 20px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .operationBox {
    .draggableItem{
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      padding: 18px 5px 0;
      border-radius: 8px;
      background-color: #f8f8f8;
      .iconDraggable{
        font-size: 28px;
        line-height: 32px;
        cursor: move;
      }
      .cont{
        flex: 1;
        margin: 0 10px 0 5px;
        .el-form-item{
          margin-bottom: 0;
          :deep(.el-form-item__label){
            font-weight: normal;
            &:before{
              display: none;
            }
          }
        }
      }
      .deleteItem{
        .iconfont{
          font-size: 20px;
          line-height: 32px;
        }
      }
      &.draggableItemMultiple{
        align-items: center;
        .cont{
          .el-form-item{
            margin-bottom: 18px;
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
}
</style>
