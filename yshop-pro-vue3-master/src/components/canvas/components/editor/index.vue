<template>
  <div class="edit">
    <quill-editor
      ref="myQuillEditor"
      v-model:content="editorContent"
      :options="editorOption"
      @textChange="textChange"
    />
  </div>
</template>
<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref, onMounted, toRefs } from 'vue';
const emits = defineEmits(['textChange'])
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});

const {
  content
} = toRefs(props);
const editorOption = ref({
  placeholder: '请输入',
  modules: {
    toolbar: [
      [{ size: [false, 'large', 'huge'] }, 'bold', 'italic', 'link'], // toggled buttons
    ],
  },
})
const editorContent = ref('');
const myQuillEditor = ref();
onMounted(() => {
  // 编辑器赋值
  myQuillEditor.value.setHTML(content.value);
});

//  编辑器改变回调
function textChange () {
  const html = myQuillEditor.value.getHTML();
  emits('textChange', html)
}
</script>
<style lang="scss" scoped>
  .edit{
    :deep(.ql-container) {
    height: 200px;
    }
  }
</style>
