<template>
  <div class="module-box link-select">
    <div class="module-box__title">
      <label class="module-box__label">{{ title }}</label>
    </div>
    <div class="link-select__confirm">
      <div
        v-if="selectedCategoryList && selectedCategoryList.length === 0"
        class="btn"
        @click="openDialog"
      >
        <span class="iconfont">&#xe685;</span> 添加类别
      </div>
      <div v-else class="info">
        <div>
          <span>{{ selectedCategoryList[0].categoryName }}</span><span v-if="selectedCategoryList.length > 1">+{{ selectedCategoryList.length - 1 }}</span>
        </div>
        <div class="operation">
          <i class="iconfont" @click="openDialog">&#xe66c;</i>
          <i class="iconfont" @click="deleteCategory">&#xe633;</i>
        </div>
      </div>
    </div>
    <el-dialog v-model="categoryVisible" width="500" title="选择类别">
      <el-select
        v-if="terminal === 4"
        v-model="categoryValue"
        multiple
        collapse-tags
        placeholder="请选择"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.categoryName"
          :value="item.id"
        />
      </el-select>
      <el-cascader
        v-else
        ref="cascader"
        :options="categoryList"
        :props="{
          multiple: true,
          label: 'categoryName',
          value: 'id',
          children: 'childs',
        }"
        clearable
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryVisible = false">取 消</el-button>
          <el-button type="primary" @click="categoryChanged">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue';
import api from '@/components/canvas/components/canvasShow/config/api'
import { checkEmptyChild } from '@/components/canvas/config/common'
import { sendReqMixin } from '@/components/canvas/components/canvasShow/config/mixin'
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { terminal } = storeToRefs(canvasStoreObj);
const { sendReq } = sendReqMixin()
const props = defineProps({
  title: {
    type: String,
    default: '链接',
  },
  category: {
    type: Array,
    default: () => [],
  },
});
const { title, category } = toRefs(props)
const emits = defineEmits(['update:category'])

const categoryValue = ref([])
const selectedCategoryList = ref([])
const categoryList = ref([])
const categoryVisible = ref(false)
const cascader = ref()
onMounted(() => {
  getCategory()
  selectedCategoryList.value = category.value
})

// 获取类别
function getCategory () {
  const params = {
    url: api.getClassify,
    method: 'GET',
  }
  sendReq(params, (res) => {
    categoryList.value = res.data
    checkEmptyChild(categoryList.value)
  })
}
// 打开添加弹窗
function openDialog () {
  categoryVisible.value = true
}
// 类别选择
function categoryChanged () {
  categoryVisible.value = false
  if (terminal.value === 4) {
    selectedCategoryList.value = categoryList.value.filter((item) => {
      for (let i = 0; i < categoryValue.value.length; i++) {
        if (categoryValue.value[i] === item.id) {
          return true
        }
      }
    })
  } else {
    let nodesArr = cascader.value.getCheckedNodes()
    if (nodesArr) {
      nodesArr = nodesArr.filter((item) => {
        return item.children.length === 0
      })
      selectedCategoryList.value = []
      for (let i = 0; i < nodesArr.length; i++) {
        selectedCategoryList.value.push(nodesArr[i].data)
      }
    }
  }
  emits('update:category', selectedCategoryList.value)
}
// 删除选择
function deleteCategory () {
  categoryValue.value = []
  emits('update:category', [])
}
</script>

<style lang="scss" scoped>
.link-select {
  &__select {
    width: 100%;
  }
  &__confirm {
    margin-top: 10px;
    .btn {
      text-align: center;
      background-color: var(--el-color-primary);
      color: #fff;
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      cursor: pointer;
    }
    .info {
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      padding: 0 10px;
      border: 1px solid var(--el-color-primary);
      display: flex;
      justify-content: space-between;
      span {
        background-color: #f4f4f5;
        border: 1px solid #e9e9eb;
        color: #909399;
        height: 26px;
        padding: 0 8px;
        line-height: 24px;
        border-radius: 4px;
        margin: 5px 6px 5px 0px;
        display: inline-block;
      }
      .operation {
        float: right;
        i {
          width: 35px;
          display: inline-block;
          height: 35px;
          line-height: 35px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
