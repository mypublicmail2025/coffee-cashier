<template>
  <div :class="prefixCls" class="h-[100%] relative" :style="themeStyles">
    <!-- <div class="theme-toggle" @click="manualToggleTheme">
      <i class="theme-icon"></i>
    </div> -->

    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <div class="logo-container" :style="{ backgroundColor: themeStyles['--btn-primary'] }">
            <img :src="logoSrc" alt="Logo" class="logo" />
          </div>
          <h1 class="login-title">{{ title }}</h1>
        </div>

        <!-- 登录方式切换 -->
        <div class="login-type-switch">
          <div
            class="switch-item"
            :class="{ active: getLoginState === LoginStateEnum.LOGIN }"
            @click="() => setLoginState(LoginStateEnum.LOGIN)"
          >
            账号登录
          </div>
          <div
            class="switch-item"
            :class="{ active: getLoginState === LoginStateEnum.MOBILE }"
            @click="() => setLoginState(LoginStateEnum.MOBILE)"
          >
            手机登录
          </div>
        </div>

        <LoginForm
          v-if="getLoginState === LoginStateEnum.LOGIN"
          @login-success="handleLoginSuccess"
        />
        <MobileForm v-else @login-success="handleLoginSuccess" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="Login" setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive, provide } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { LoginForm, MobileForm } from './components'
import LogoImg from '@/assets/imgs/logo.png'
import { LoginStateEnum, useLoginState } from './components/useLogin'
const { getLoginState, setLoginState } = useLoginState()

const appStore = useAppStore()

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
appStore.setIsDark(false)

let configInfo = JSON.parse(localStorage.getItem('config') || '{}')
const title = configInfo?.mallName || computed(() => appStore.getTitle)
const logoSrc = configInfo?.adminLogo || LogoImg

// 主题配置
const themes = reactive({
  blue: {
    '--primary-bg-start': '#E8EAF6',
    '--primary-bg-end': '#90CAF9',
    '--btn-primary': '#1976D2',
    '--btn-admin': '#7B1FA2',
    '--text-dark': '#212121',
    '--background-img': 'url(' + new URL('@/assets/imgs/login/bg_blue.png', import.meta.url).href + ')'
  },
  orange: {
    '--primary-bg-start': '#FFF3E0',
    '--primary-bg-end': '#FFA500',
    '--btn-primary': '#FF8F00',
    '--btn-admin': '#E65100',
    '--text-dark': '#212121',
    '--background-img': 'url(' + new URL('@/assets/imgs/login/bg_orange.png', import.meta.url).href + ')'
  },
  purple: {
    '--primary-bg-start': '#E1BEE7',
    '--primary-bg-end': '#CE93D8',
    '--btn-primary': '#9C27B0',
    '--btn-admin': '#7B1FA2',
    '--text-dark': '#212121',
    '--background-img': 'url(' + new URL('@/assets/imgs/login/bg_purple.png', import.meta.url).href + ')'
  }
})

// 当前主题
const currentTheme = ref('blue')

// 计算当前主题样式
const themeStyles = computed(() => {
  return themes[currentTheme.value]
})

// 提供主题样式给子组件
provide('themeStyles', themeStyles)
provide('logoSrc', logoSrc)

// 切换主题
function toggleTheme() {
  // 循环切换三种主题
  if (currentTheme.value === 'blue') {
    currentTheme.value = 'orange'
  } else if (currentTheme.value === 'orange') {
    currentTheme.value = 'purple'
  } else {
    currentTheme.value = 'blue'
  }
}

// 处理登录成功
function handleLoginSuccess() {
  // 登录成功后停止主题切换
  if (themeInterval) {
    clearInterval(themeInterval)
    themeInterval = null
  }
}

// 主题自动切换定时器
let themeInterval = null

// 组件挂载时启动自动主题切换
onMounted(() => {
  themeInterval = setInterval(toggleTheme, 10000)
})

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (themeInterval) {
    clearInterval(themeInterval)
    themeInterval = null
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-bg-start), var(--primary-bg-end));
  font-family: 'Segoe UI', Arial, sans-serif;
  transition: background 0.5s ease;
  background-image: var(--background-img);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 380px;
}

.login-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
  justify-content: flex-start;
}

.logo-container {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.5s ease;
  margin-right: 15px;
  flex-shrink: 0;
}

.logo {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.login-title {
  color: var(--text-dark);
  font-size: 22px;
  margin: 0;
  font-weight: 600;
}

.login-type-switch {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.switch-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.switch-item.active {
  color: var(--btn-primary);
  font-weight: 500;
}

.switch-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: var(--btn-primary);
}

.switch-item:hover {
  color: var(--btn-primary);
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.theme-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>');
}
</style>
