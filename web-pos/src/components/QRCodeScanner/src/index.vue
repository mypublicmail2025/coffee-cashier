<template>
  <div class="qrcode-scanner">
    <el-dialog
      v-model="dialogVisible"
      title="扫描二维码"
      width="600px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="scanner-container">
        <div v-if="!isBrowserSupported" class="browser-not-supported">
          <el-icon class="permission-icon"><Warning /></el-icon>
          <div class="permission-message">
            <h3>浏览器不支持</h3>
            <p>您的浏览器不支持摄像头访问功能。请使用最新版本的Chrome、Firefox或Safari浏览器。</p>
          </div>
        </div>
        
        <div v-else-if="cameraPermissionState === 'granted'" class="video-container">
          <video id="video" ref="videoRef" class="scanner-video" autoplay playsinline muted></video>
          <div class="scanner-overlay">
            <div class="scanner-frame"></div>
          </div>
        </div>
        
        <div v-else-if="cameraPermissionState === 'denied'" class="permission-denied">
          <el-icon class="permission-icon"><Warning /></el-icon>
          <div class="permission-message">
            <h3>摄像头权限被拒绝</h3>
            <p>请在浏览器设置中允许访问摄像头，然后刷新页面重试。</p>
            <el-button type="primary" @click="requestCameraPermission">重新请求权限</el-button>
          </div>
        </div>
        
        <div v-else-if="cameraPermissionState === 'prompt'" class="permission-prompt">
          <el-icon class="permission-icon"><Camera /></el-icon>
          <div class="permission-message">
            <h3>需要摄像头权限</h3>
            <p>扫码功能需要使用您的摄像头，请点击下方按钮授权。</p>
            <el-button type="primary" @click="requestCameraPermission">授权摄像头</el-button>
          </div>
        </div>
        
        <div v-else-if="cameraPermissionState === 'error'" class="permission-error">
          <el-icon class="permission-icon"><CircleClose /></el-icon>
          <div class="permission-message">
            <h3>摄像头初始化失败</h3>
            <p>{{ cameraErrorMessage }}</p>
            <el-button type="primary" @click="requestCameraPermission">重试</el-button>
          </div>
        </div>
        
        <div class="scanner-status">{{ scanStatus }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
           
          <div class="footer-actions">
            <el-button 
              v-if="availableCameras.length > 1"
              type="primary" 
              @click="switchCamera" 
              :disabled="cameraPermissionState !== 'granted'"
              class="camera-switch-btn"
            >
              {{ isUsingFrontCamera ? '切换到后置摄像头' : '切换到前置摄像头' }}
            </el-button>
            
            <el-button 
              type="primary" 
              @click="toggleFlashlight" 
              :disabled="!hasFlashlight || cameraPermissionState !== 'granted'"
            >
              {{ flashlightOn ? '关闭闪光灯' : '打开闪光灯' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { 
  // MultiFormatReader,
  BrowserMultiFormatReader,
  // DecodeHintType, 
  // BarcodeFormat, 
  // BinaryBitmap,
  // HybridBinarizer,
  NotFoundException,
  // RGBLuminanceSource
} from '@zxing/library'
import { Camera, Warning, CircleClose } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'scan-success'])

// 状态变量
const videoRef = ref(null)
const stream = ref(null)
const scanningAnimationId = ref(null)
const scanStatus = ref('准备扫描...')
const hasFlashlight = ref(false)
const flashlightOn = ref(false)
const scanning = ref(false)
const codeReader = ref(null)
const cameraPermissionState = ref('prompt') // 'prompt', 'granted', 'denied', 'error'
const cameraErrorMessage = ref('')
const isUsingFrontCamera = ref(false)
const availableCameras = ref([])
let selectedDeviceId = null
// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close')
    }
  }
})

const getMediaDevices = () => {
  return (
    navigator.mediaDevices ||
    (navigator.mozGetUserMedia || navigator.webkitGetUserMedia 
      ? { getUserMedia: (constraints) => {
          return new Promise((resolve, reject) => {
            (navigator.mozGetUserMedia || navigator.webkitGetUserMedia)
              .call(navigator, constraints, resolve, reject);
          });
        }}
      : null)
  );
};

const isBrowserSupported = computed(() => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
})

// 检查可用的摄像头设备
const checkAvailableCameras = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.warn('不支持枚举视频设备')
    return
  }
  
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    availableCameras.value = videoDevices
    
    // 如果有多个摄像头，按照常见命名尝试识别前置和后置
    if (videoDevices.length > 1) {
      // 尝试找到后置摄像头
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('后置') ||
        device.label.toLowerCase().includes('environment')
      )
      
      // 如果找到后置摄像头，默认选择它
      if (backCamera) {
        selectedDeviceId = backCamera.deviceId
        isUsingFrontCamera.value = false
        console.log('找到后置摄像头:', backCamera.label)
      } else {
        // 如果没有明确标识的后置摄像头，默认选择非前置摄像头
        const frontCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('front') || 
          device.label.toLowerCase().includes('前置') ||
          device.label.toLowerCase().includes('facetime')
        )
        
        if (frontCamera && videoDevices.length > 1) {
          // 如果找到前置摄像头但有多个摄像头，选择不是前置的那个
          const nonFrontCamera = videoDevices.find(device => device.deviceId !== frontCamera.deviceId)
          if (nonFrontCamera) {
            selectedDeviceId = nonFrontCamera.deviceId
            isUsingFrontCamera.value = false
            console.log('使用非前置摄像头:', nonFrontCamera.label)
          }
        } else {
          // 默认使用第一个摄像头
          selectedDeviceId = videoDevices[0].deviceId
          isUsingFrontCamera.value = false
          console.log('默认使用第一个摄像头:', videoDevices[0].label)
        }
      }
    } else if (videoDevices.length === 1) {
      // 只有一个摄像头时直接使用
      selectedDeviceId = videoDevices[0].deviceId
      console.log('只有一个摄像头可用:', videoDevices[0].label)
    }
  } catch (error) {
    console.error('枚举摄像头设备失败:', error)
  }
}

// 切换摄像头
const switchCamera = async () => {
  if (availableCameras.value.length <= 1 || cameraPermissionState.value !== 'granted') {
    return
  }
  
  isUsingFrontCamera.value = !isUsingFrontCamera.value
  scanStatus.value = '切换摄像头中...'
  
  // 完全停止当前摄像头
  stopCamera()
  
  // 等待DOM更新
  await nextTick()
  
  // 找到合适的摄像头
  if (availableCameras.value.length > 1) {
    // 如果当前是使用前置摄像头状态，切换到后置
    if (!isUsingFrontCamera.value) {
      const backCamera = availableCameras.value.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('后置') ||
        device.label.toLowerCase().includes('environment')
      )
      
      if (backCamera) {
        selectedDeviceId = backCamera.deviceId
        console.log('切换到后置摄像头:', backCamera.label)
      } else {
        // 使用非前置摄像头
        const frontCamera = availableCameras.value.find(device => 
          device.label.toLowerCase().includes('front') || 
          device.label.toLowerCase().includes('前置') ||
          device.label.toLowerCase().includes('facetime')
        )
        
        if (frontCamera) {
          const nonFrontCamera = availableCameras.value.find(device => device.deviceId !== frontCamera.deviceId)
          if (nonFrontCamera) {
            selectedDeviceId = nonFrontCamera.deviceId
            console.log('切换到非前置摄像头:', nonFrontCamera.label)
          }
        }
      }
    } else {
      // 使用前置摄像头
      const frontCamera = availableCameras.value.find(device => 
        device.label.toLowerCase().includes('front') || 
        device.label.toLowerCase().includes('前置') ||
        device.label.toLowerCase().includes('facetime')
      )
      
      if (frontCamera) {
        selectedDeviceId = frontCamera.deviceId
        console.log('切换到前置摄像头:', frontCamera.label)
      }
    }
  }
  
  // 延迟重新初始化，确保资源已释放
  setTimeout(() => {
    requestCameraPermission()
  }, 300)
}

// 请求摄像头权限
const requestCameraPermission = async () => {
  try {
    cameraPermissionState.value = 'prompt'
    scanStatus.value = '正在请求摄像头权限...'
    
    // 检查浏览器是否支持摄像头API
    if (!getMediaDevices() || !getMediaDevices().getUserMedia) {
      throw new Error('您的浏览器不支持摄像头访问，请使用最新版本的Chrome、Firefox或Safari浏览器')
    }
    
    // 检查可用摄像头
    await checkAvailableCameras()
    
    // 检查权限状态
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' })
        
        if (permissionStatus.state === 'denied') {
          cameraPermissionState.value = 'denied'
          scanStatus.value = '摄像头权限被拒绝'
          return
        }
        
        // 监听权限变化
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            cameraPermissionState.value = 'granted'
            // 重新初始化摄像头
            stopCamera()
            initCamera()
          } else if (permissionStatus.state === 'denied') {
            cameraPermissionState.value = 'denied'
            scanStatus.value = '摄像头权限被拒绝'
            stopCamera()
          }
        }
      } catch (permError) {
        console.warn('权限查询失败，将直接尝试访问摄像头:', permError)
        // 某些浏览器可能不支持permissions API，继续尝试直接访问摄像头
      }
    }
    
    // 尝试获取媒体流，这会触发权限请求
    const mediaStream = await navigator.mediaDevices.getUserMedia({ 
      video: selectedDeviceId ? 
        { deviceId: { exact: selectedDeviceId } } : 
        { facingMode: { exact: 'environment' } }, // 优先使用后置摄像头
      audio: false
    }).catch(async (err) => {
      console.warn('无法使用指定设备或后置摄像头，尝试任意可用摄像头:', err);
      // 如果指定设备或后置摄像头不可用，尝试使用任意摄像头
      return await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
    });
    
    if (mediaStream) {
      cameraPermissionState.value = 'granted'
      stream.value = mediaStream
      console.log('摄像头权限已获取，流:', mediaStream)
      await nextTick()
      // 等待DOM更新后初始化摄像头
      setTimeout(() => {
        initCamera()
      }, 100)
    } else {
      throw new Error('无法获取摄像头视频流')
    }
  } catch (error) {
    console.error('请求摄像头权限失败:', error)
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      cameraPermissionState.value = 'denied'
      scanStatus.value = '摄像头权限被拒绝'
    } else {
      cameraPermissionState.value = 'error'
      cameraErrorMessage.value = getErrorMessage(error)
      scanStatus.value = '摄像头初始化失败'
    }
  }
}

// 获取错误信息
const getErrorMessage = (error) => {
  if (error.message) {
    return error.message
  }
  
  switch (error.name) {
    case 'NotFoundError':
      return '找不到摄像头设备，请确保您的设备有摄像头并且正常工作'
    case 'NotReadableError':
      return '摄像头被占用或无法访问，请关闭其他可能使用摄像头的应用'
    case 'OverconstrainedError':
      return '摄像头不满足要求，请尝试使用其他摄像头'
    case 'AbortError':
      return '摄像头访问被中断'
    case 'NotSupportedError':
      return '您的浏览器不支持摄像头访问，请使用最新版本的Chrome、Firefox或Safari浏览器'
    case 'SecurityError':
      return '摄像头访问被安全策略阻止'
    default:
      return `摄像头错误: ${error.name || '未知错误'}`
  }
}

// 初始化摄像头和扫码器
const initCamera = async () => {
  try {
    scanning.value = true
    scanStatus.value = '初始化摄像头...'
    console.log('开始初始化摄像头')
    
    // 如果已经有流，先停止
    if (stream.value) {
      const tracks = stream.value.getTracks()
      tracks.forEach(track => track.stop())
      stream.value = null
    }
    
    // 等待DOM更新
    await nextTick()
    
    codeReader.value = new BrowserMultiFormatReader()
    codeReader.value.listVideoInputDevices()
      .then((videoInputDevices) => {
        // 如果之前已经选择了设备ID，使用它
        const deviceId = selectedDeviceId || videoInputDevices[0].deviceId
      
        
        console.log('使用摄像头设备ID:', deviceId)
        
        codeReader.value.decodeFromVideoDevice(deviceId, 'video', (result, err) => {
          if (result) {
            console.log(result)
            handleSuccessfulScan(result)
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err)
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
  } catch (error) {
    console.error('初始化摄像头失败:', error)
    cameraPermissionState.value = 'error'
    cameraErrorMessage.value = getErrorMessage(error)
    scanStatus.value = '初始化摄像头失败'
    scanning.value = false
  }
}

// 停止扫描循环
const stopManualScanning = () => {
  if (scanningAnimationId.value) {
    cancelAnimationFrame(scanningAnimationId.value)
    scanningAnimationId.value = null
  }
  
  if (codeReader.value) {
    try {
      codeReader.value.reset()
    } catch (error) {
      console.warn('重置扫码器失败:', error)
    }
  }
}

// 停止摄像头
const stopCamera = () => {
  try {
    console.log('停止摄像头')
    // 停止扫描循环
    stopManualScanning()
    
    if (codeReader.value) {
      console.log('重置codeReader')
      try {
        codeReader.value.reset()
      } catch (error) {
        console.warn('重置codeReader失败:', error)
      }
      codeReader.value = null
    }
    
    if (stream.value) {
      console.log('停止视频流')
      const tracks = stream.value.getTracks()
      tracks.forEach(track => {
        console.log(`停止视频轨道: ${track.kind}`, track)
        track.stop()
      })
      stream.value = null
    }
    
    scanning.value = false
    hasFlashlight.value = false
    flashlightOn.value = false
  } catch (error) {
    console.error('停止摄像头时出错:', error)
  }
}

// 切换闪光灯
const toggleFlashlight = async () => {
  if (!stream.value || !hasFlashlight.value) return
  
  const videoTrack = stream.value.getVideoTracks()[0]
  if (videoTrack) {
    try {
      flashlightOn.value = !flashlightOn.value
      await videoTrack.applyConstraints({
        advanced: [{ torch: flashlightOn.value }]
      })
    } catch (error) {
      console.error('控制闪光灯失败:', error)
      flashlightOn.value = false
    }
  }
}

// 播放成功提示音
const playSuccessSound = () => {
  try {
    console.log('播放成功提示音')
    // 使用Web Audio API替代直接Audio对象
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // 设置音调特性
    oscillator.type = 'sine' // 正弦波
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5音
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime) // 降低音量
    
    // 连接节点
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // 创建双音
    oscillator.start()
    // 短暂的提示音
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    // 0.3秒后停止
    setTimeout(() => {
      oscillator.stop()
      // 尝试关闭 AudioContext
      try {
        if (audioContext.state !== 'closed') {
          audioContext.close()
        }
      } catch (closeError) {
        console.warn('关闭音频上下文失败:', closeError)
      }
    }, 300)
  } catch (error) {
    console.error('播放提示音失败:', error)
  }
}


// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  emit('close')
}

// 监听对话框可见性变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 对话框打开时请求摄像头权限
    // 延迟初始化，确保对话框已完全打开
    nextTick(() => {
      setTimeout(() => {
           requestCameraPermission()
      }, 300)
    })
  } else {
    // 对话框关闭时停止摄像头
    stopCamera()
  }
})

// 监听组件卸载
onBeforeUnmount(() => {
  console.log('组件卸载，停止摄像头')
  stopCamera()
})

// 处理成功扫描
const handleSuccessfulScan = (result) => {
  const scannedText = result.getText()
  const resultFormat = result.getBarcodeFormat()
  
  console.log('扫描成功:', scannedText, '格式:', resultFormat)
  scanStatus.value = `扫描成功: ${scannedText}`
  
  // 播放成功提示音
  playSuccessSound()
  
  // 判断父组件是否支持复杂结果对象，如果不支持则仅发送文本
  if (typeof props.visible === 'boolean') {
    // 简单接口模式
    emit('scan-success', scannedText)
  } else {
    // 增强接口模式
    emit('scan-success', {
      text: scannedText,
      format: resultFormat,
      timestamp: new Date().getTime()
    })
  }
  
  // 关闭扫码对话框
  dialogVisible.value = false
}
</script>

<style scoped>
.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.video-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #000;
  z-index: 1;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block; /* 确保视频元素正确显示 */
  z-index: 2;
  opacity: 1 !important;
  visibility: visible !important;
  transform: scaleX(1); /* 防止某些设备镜像显示 */
  background-color: transparent;
  /* Safari 支持 */
  -webkit-transform: scaleX(1);
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  pointer-events: none; /* 确保不阻碍视频交互 */
}

.scanner-frame {
  width: 250px;  /* 增大扫描区域 */
  height: 250px; /* 增大扫描区域 */
  border: 2px solid #fff;
  border-radius: 8px;
  box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.5); /* 增加阴影对比度 */
  position: relative;
  animation: pulse 2s infinite;
}

.scanner-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(35,120,96,0.3), #237860, rgba(35,120,96,0.3));
  animation: scan-line 2s ease-in-out infinite;
}

.scanner-frame::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
  animation: highlight 2s linear infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.4);
  }
  100% {
    box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
  }
}

@keyframes scan-line {
  0% {
    top: 0;
  }
  50% {
    top: calc(100% - 2px);
  }
  100% {
    top: 0;
  }
}

@keyframes highlight {
  0% {
    background-position: -200px -200px;
  }
  100% {
    background-position: 200px 200px;
  }
}

.scanner-status {
  margin-top: 16px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.camera-switch-btn {
  margin-right: 0;
}

/* 权限相关样式 */
.permission-denied,
.permission-prompt,
.permission-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  height: 300px;
}

.permission-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.permission-denied .permission-icon {
  color: #f56c6c;
}

.permission-prompt .permission-icon {
  color: #409eff;
}

.permission-error .permission-icon {
  color: #f56c6c;
}

.permission-message h3 {
  margin-bottom: 8px;
  font-size: 18px;
}

.permission-message p {
  margin-bottom: 16px;
  color: #606266;
}

/* 添加浏览器不支持的样式 */
.browser-not-supported {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  height: 300px;
}

.browser-not-supported .permission-icon {
  color: #e6a23c;
}
</style> 