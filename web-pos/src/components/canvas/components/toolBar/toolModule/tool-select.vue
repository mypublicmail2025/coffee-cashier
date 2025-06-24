<template>
  <div class="module-box link-select">
    <div class="module-box__title">
      <label class="module-box__label">{{ title }}</label>
    </div>
    <el-select
      v-model="selectValue"
      class="link-select__select"
      placeholder="请选择跳转到的页面"
      @change="selectChanged"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue';
const selectValue = ref('');
const props = defineProps({
  title: {
    type: String,
    default: '标题',
  },
  linkValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
});
const { title, linkValue, options } = toRefs(props);
const emits = defineEmits(['update:linkValue']);
onMounted(() => {
  selectValue.value = linkValue.value; // props 不能直接修改
});

function selectChanged (value) {
  emits('update:linkValue', value);
}
</script>

<style lang="scss" scoped>
.link-select {
  &__select {
    width: 100%;
  }
}
</style>
