<script lang="ts" name="Logo" setup>
import { computed, onMounted, ref, unref, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
// import LogoImg from '@/assets/imgs/logo.png'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

// let configInfo = JSON.parse(localStorage.getItem('config'))

const title = "FONVA梵花"

// const logoSrc = configInfo?.adminLogo || LogoImg

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse)

onMounted(() => {
  if (unref(collapse)) show.value = false
})

watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true
      return
    }
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse
      }, 400)
    } else {
      show.value = !collapse
    }
  }
)

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true
    } else {
      if (unref(collapse)) {
        show.value = false
      } else {
        show.value = true
      }
    }
  }
)
</script>

<template>
  <div>
    <router-link
      :class="[
        prefixCls,
        layout !== 'classic' ? `${prefixCls}__Top` : '',
        'flex !h-[var(--logo-height)] items-center cursor-pointer justify-center relative',
        'dark:bg-[var(--el-bg-color)]'
      ]"
      to="/"
    >
      <!-- <img
        class="w-[calc(var(--logo-height)-10px)] h-[calc(var(--logo-height)-10px)]"
        :src="logoSrc"
      /> -->
      <div
        v-if="show"
        :class="[
          'ml-10px text-14px font-700 whitespace-nowrap text-white bg-primary',
          
        ]"
      >
        {{ title }}
      </div>
    </router-link>
  </div>
</template>
