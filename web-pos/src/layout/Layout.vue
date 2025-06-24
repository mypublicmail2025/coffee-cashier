<script lang="tsx">
import { computed, defineComponent, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { Setting } from '@/layout/components/Setting'
import { useRenderLayout } from './components/useRenderLayout'
import { useDesign } from '@/hooks/web/useDesign'
import {getEachStatusOrderCount} from '@/api/mall/order/onlineOrder'
import {useUserStore} from '@/store/modules/user'
const userStore = useUserStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const layout = computed(() => appStore.getLayout)

const handleClickOutside = () => {
  appStore.setCollapse(true)
}
const orderInterval = ref<NodeJS.Timeout | null>(null)



// 横屏检测
const isLandscape = ref(window.innerWidth > window.innerHeight)

// 监听屏幕方向变化
const handleOrientationChange = () => {
  isLandscape.value = window.innerWidth > window.innerHeight
}


const renderLayout = () => {
  switch (unref(layout)) {
    case 'classic':
      const { renderClassic } = useRenderLayout()
      return renderClassic()
    case 'topLeft':
      const { renderTopLeft } = useRenderLayout()
      return renderTopLeft()
    case 'top':
      const { renderTop } = useRenderLayout()
      return renderTop()
    case 'cutMenu':
      const { renderCutMenu } = useRenderLayout()
      return renderCutMenu()
    default:
      break
  }
}

export default defineComponent({
  name: 'Layout',
  setup() {
    const requestOrder = async () => {
      const res = await getEachStatusOrderCount(userStore.shopId)
      // const {
      //   pendingCancellation,
      //   pendingOrders,
      //   inProduction,
      //   inDelivery
      // } = res;
      appStore.setEachStatusOrderCount(res)
      if (res?.pendingOrders > 0) {
        playOrderNotification()
      }
    }


    // 播放订单通知语音
    const playOrderNotification = () => {
      try {
        console.log('播放订单通知语音')

        // 检查浏览器是否支持语音合成
        if ('speechSynthesis' in window) {
          // 停止任何正在播放的语音
          window.speechSynthesis.cancel()

          // 创建语音对象
          const utterance = new SpeechSynthesisUtterance('您有新订单，请及时处理')

          // 设置语音属性
          utterance.lang = 'zh-CN' // 中文
          utterance.volume = 1.0   // 音量 (0-1)
          utterance.rate = 1.0     // 语速 (0.1-10)
          utterance.pitch = 1.0    // 音调 (0-2)

          // 语音开始和结束事件
          utterance.onstart = () => {
            console.log('语音播放开始')
          }

          utterance.onend = () => {
            console.log('语音播放结束')
          }

          utterance.onerror = (event) => {
            console.error('语音播放错误:', event)
          }

          // 获取可用的语音
          const voices = window.speechSynthesis.getVoices()

          // 尝试找到中文女声
          const chineseVoice = voices.find(voice =>
            (voice.lang === 'zh-CN' || voice.lang === 'zh-TW') &&
            voice.name.toLowerCase().includes('female')
          )

          // 如果找到了中文女声，使用它
          if (chineseVoice) {
            utterance.voice = chineseVoice
          } else if (voices.length > 0) {
            // 否则使用第一个可用的声音
            console.log('未找到中文女声，使用默认语音')
          }

          // 播放语音
          window.speechSynthesis.speak(utterance)
        } else {
          console.warn('浏览器不支持语音合成API')
          alert('您的浏览器不支持语音播放功能')
        }
      } catch (error) {
        console.error('播放语音通知失败:', error)
      }
    }

    // 在组件挂载时添加事件监听
    onMounted(() => {
      requestOrder()
      orderInterval.value = setInterval(() => {
        requestOrder()
      }, 1000 * 30)

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
      if (orderInterval.value) {
        clearInterval(orderInterval.value)
      }
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

    return () => (

    
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        {renderLayout()}

        <Backtop></Backtop>

        <Setting></Setting>
      </section>
    )
  }
})


</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout;

.#{$prefix-cls} {
  background-color: var(--app-content-bg-color);
  :deep(.#{$elNamespace}-scrollbar__view) {
    height: 100% !important;
  }
}

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
