<template>
  <landscape-layout>
    <el-container class="layout">
      <el-header v-if="getShowHeader" class="layout-header">
        <Header />
      </el-header>
      <el-container>
        <el-aside v-if="getShowMenu" class="layout-aside" :style="getAsideStyle">
          <Menu />
        </el-aside>
        <el-container>
          <el-main class="layout-main">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <keep-alive v-if="getKeepAlive" :include="getCacheRoutes">
                  <component :is="Component" :key="key" />
                </keep-alive>
                <component v-else :is="Component" :key="key" />
              </transition>
            </router-view>
          </el-main>
         
        </el-container>
      </el-container>
    </el-container>
  </landscape-layout>
</template>

<script setup>
import { computed, unref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useKeepAliveStore } from '@/store/modules/keepAlive'
import Menu from './components/Menu/index.vue'
import Header from './components/Header/index.vue'
import Footer from './components/Footer/index.vue'
import LandscapeLayout from '@/layouts/LandscapeLayout.vue'


const appStore = useAppStore()
const keepAliveStore = useKeepAliveStore()
const route = useRoute()

const getShowMenu = computed(() => appStore.getMenuSetting.show)
const getShowHeader = computed(() => appStore.getHeaderSetting.show)
const getShowFooter = computed(() => appStore.getFooterSetting.show)
const getKeepAlive = computed(() => appStore.getKeepAliveSetting.show)
const getCacheRoutes = computed(() => keepAliveStore.getCacheRoutes)

const key = computed(() => {
  return unref(route).path
})

const getAsideStyle = computed(() => {
  const width = appStore.getMenuSetting.width
  return {
    width: width + 'px',
    overflow: 'hidden'
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout;

.#{$prefix-cls} {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color-page);

  &-aside {
    transition: width 0.2s;
    background-color: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color-light);
  }

  &-header {
    display: flex;
    align-items: center;
    height: var(--el-header-height);
    background-color: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-light);
  }

  &-main {
    padding: 0;
    overflow: hidden;
    background-color: var(--el-bg-color-page);
  }

  &-footer {
    height: var(--el-footer-height);
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-light);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 