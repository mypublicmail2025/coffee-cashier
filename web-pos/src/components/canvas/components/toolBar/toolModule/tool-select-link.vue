<template>
  <div class="module-box link-select" :class="styleType && 'style' + styleType">
    <div class="link-select__warp">
      <div class="module-box__title" v-if="title">
        <label class="module-box__label">{{ title }}</label>
      </div>
    </div>
    <div v-if="linkObj.type && linkObj.value" class="link-select__confirm">
      <div class="info">
<!--        <span class="text">{{ linkObj.type }}</span>-->
        <span class="name">{{ linkObj.type === 'customLink'?linkObj.value:linkObj.value.name }}</span>
        <span class="iconfont" @click="openDialog">&#xe66c;</span>
        <span class="iconfont" @click="delSelect">&#xe651;</span>
      </div>
    </div>
    <el-button
      v-else
      class="link-select__btn"
      type="primary"
      @click="openDialog"
    >
      选择链接
    </el-button>
    <linkDialog ref="linkDialogRef" @submit="submit"/>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, watch } from 'vue';
import linkDialog from './link-dialog/index.vue';

const selectValue = ref('');
const confirmBtnVisible = ref(false);
const selectName = ref('');
const typeText = ref('');
const linkDialogRef = ref()

const props = defineProps({
  title: {
    type: String,
    default: '链接',
  },
  styleType: {
    type: String,
    default: '',
  },
  linkObj: {
    type: Object,
    default: () => ({}),
  }
});
const { title, styleType, linkObj } = toRefs(props);
const emits = defineEmits(['update:linkObj']);

onMounted(() => {
  selectValue.value = linkObj.value.selectValue;
  selectName.value = linkObj.value.selectName;
  typeText.value = linkObj.value.typeText;
  confirmBtnVisible.value = ['/category','/detail'].includes(selectValue.value)  && selectValue.value;
});

// 打开添加弹窗
function openDialog () {
  linkDialogRef.value.openDialog();
}
// 删除选择
function delSelect () {
  emits('update:linkObj', {});
}

function submit (data) {
  emits('update:linkObj', data);
}

watch(() => linkObj, (newVal) => {
  console.log(newVal, 'newVal')
  selectValue.value = newVal.value.selectValue
  selectName.value = newVal.value.selectName
  typeText.value = newVal.value.typeText
  confirmBtnVisible.value = ['/category','/detail'].includes(selectValue.value)  && selectValue.value;
}, { immediate: false, deep: true })
</script>

<style lang="scss" scoped>
.link-select {
  width: 100%;
  &__select {
    width: 100%;
  }
  &__btn{
    width: 100%;
    height: 36px;
  }
  &__confirm {
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
      .text {
        color: var(--el-color-primary);
      }
      .name {
        flex: 1;
        width: 0;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .iconfont {
        margin-left: 10px;
        cursor: pointer;
        color: #666;
      }
    }
  }
  &.style1 {
    .link-select__warp {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
    }
    width: 100%;
    margin-bottom: 0;
    .module-box__title {
      margin-bottom: 0;
    }
    .link-select__select {
      width: auto;
    }
  }
}
</style>
