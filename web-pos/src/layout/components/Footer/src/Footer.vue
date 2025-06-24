<script lang="ts" name="Footer" setup>
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import {computed} from "vue";

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('footer')

const appStore = useAppStore()

let configInfo = JSON.parse(localStorage.getItem('config'))
const title = configInfo?.mallName || computed(() => appStore.getTitle)
</script>

<template>
  <div
    v-if="false"
    :class="prefixCls"
    class="text-center text-[var(--el-text-color-placeholder)] bg-[var(--app-contnet-bg-color)] h-[var(--app-footer-height)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)]"
  >
    <p style="font-size: 14px">Copyright ©2025-{{ title }}</p>
  </div>
</template>
