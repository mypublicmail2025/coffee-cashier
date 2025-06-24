<template>
  <div class="landscape-layout">
    <div v-if="!isLandscape" class="rotate-device-message">
      <div class="rotate-icon">⟳</div>
      <div class="rotate-text">请旋转设备至横屏模式</div>
    </div>
    
    <div v-else class="content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 横屏检测
const isLandscape = ref(window.innerWidth > window.innerHeight)

// 监听屏幕方向变化
const handleOrientationChange = () => {
  isLandscape.value = window.innerWidth > window.innerHeight
}

// 在组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('resize', handleOrientationChange)
  
  // 强制横屏（仅在移动设备上）
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (window.screen && window.screen.orientation) {
      try {
        // 尝试锁定屏幕方向为横屏
        window.screen.orientation.lock('landscape').catch(e => {
          console.warn('无法锁定屏幕方向:', e)
        })
      } catch (e) {
        console.warn('设备不支持屏幕方向锁定:', e)
      }
    }
  }
})

// 在组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleOrientationChange)
  
  // 解锁屏幕方向
  if (window.screen && window.screen.orientation) {
    try {
      window.screen.orientation.unlock()
    } catch (e) {
      console.warn('解锁屏幕方向失败:', e)
    }
  }
})
</script>

<style scoped>
.landscape-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.rotate-device-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  z-index: 9999;
}

.rotate-icon {
  font-size: 48px;
  animation: rotate 2s infinite linear;
  margin-bottom: 16px;
}

.rotate-text {
  font-size: 18px;
  font-weight: bold;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.content-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* 针对iPad Pro 11寸的优化 */
@media screen and (width: 1194px) and (height: 834px) {
  .content-container {
    max-width: 1194px;
    max-height: 834px;
    margin: 0 auto;
  }
}

/* 针对iPad Air 10.9寸的优化 */
@media screen and (width: 1180px) and (height: 820px) {
  .content-container {
    max-width: 1180px;
    max-height: 820px;
    margin: 0 auto;
  }
}

/* 针对iPad 10.2寸的优化 */
@media screen and (width: 1080px) and (height: 810px) {
  .content-container {
    max-width: 1080px;
    max-height: 810px;
    margin: 0 auto;
  }
}
</style> 