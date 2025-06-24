<script lang="ts" name="APP" setup>
import { isDark } from '@/utils/is'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('app')
const appStore = useAppStore()
const currentSize = computed(() => appStore.getCurrentSize)
const greyMode = computed(() => appStore.getGreyMode)
const { wsCache } = useCache()

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  let isDarkTheme = wsCache.get(CACHE_KEY.IS_DARK)
  if (isDarkTheme === null) {
    isDarkTheme = isDark()
  }
  appStore.setIsDark(isDarkTheme)
}

setDefaultTheme()
</script>
<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>
<style lang="scss">
$prefix-cls: #{$namespace}-app;
.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  @extend .size;

  #app {
    @extend .size;
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
<style>
/* 全局主题色样式 */
:root {
  --theme-color: #237860;
  --theme-color-light: #e6f2ee;
}

/* 确保按钮使用主题色 */
.el-button--primary {
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
  --el-button-active-bg-color: var(--el-color-primary-dark-1);
  --el-button-active-border-color: var(--el-color-primary-dark-1);
}

/* 确保链接使用主题色 */
a {
  color: var(--el-color-primary);
}

/* 确保选中项使用主题色 */
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-radio__input.is-checked .el-radio__inner {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

/* 确保开关使用主题色 */
.el-switch.is-checked .el-switch__core {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

/* 确保滑块使用主题色 */
.el-slider__bar {
  background-color: var(--el-color-primary);
}

.el-slider__button {
  border-color: var(--el-color-primary);
}
</style>
