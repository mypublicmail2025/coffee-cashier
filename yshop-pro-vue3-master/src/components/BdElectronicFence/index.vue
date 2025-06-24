<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { onBeforeUnmount, ref, watch } from 'vue'
import markerImg from '@/assets/imgs/marker.png'
const props = defineProps({
  // 多边形点位数据
  points: {
    type: Array,
    default: () => []
  },
  // 中心点位置 [经度, 纬度]
  center: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['confirm:points'])

// 多边形围栏点位
const polygonPoints = ref(cloneDeep(props.points))

// 临时存储编辑中的点位，用于取消操作
const tempPolygonPoints = ref([])

// 监听外部传入的点位变化
watch(
  () => props.points,
  (newPoints) => {
    polygonPoints.value = cloneDeep(newPoints)
    if (map.value && polygon.value) {
      updatePolygon()
    }
  },
  { deep: true }
)

// 手动输入多边形点位
const manualPointInput = ref('')
const showManualInput = ref(false)

// 地图相关
const mapContainer = ref(null)
const map = ref(null)
const BMap = ref(null)
const polygon = ref(null)
const mapVisible = ref(false)
const isDrawing = ref(false)
const drawingPoints = ref([])
const drawingManager = ref(null)

// 切换手动输入模式
function toggleManualInput() {
  showManualInput.value = !showManualInput.value
  if (!showManualInput.value) {
    manualPointInput.value = ''
  } else {
    // 如果已有点位，填充到输入框
    if (polygonPoints.value.length > 0) {
      manualPointInput.value = polygonPoints.value
        .map((point) => `${point[0]},${point[1]}`)
        .join('\n')
    }
  }
}

// 解析手动输入的点位
function parseManualInput() {
  try {
    const lines = manualPointInput.value.trim().split('\n')
    const points = lines.map((line) => {
      const [lon, lat] = line.split(',').map((val) => parseFloat(val.trim()))
      if (isNaN(lon) || isNaN(lat)) {
        throw new Error('格式错误')
      }
      return [lon, lat]
    })

    if (points.length < 3) {
      ElMessage.warning('多边形围栏至少需要3个点')
      return
    }

    polygonPoints.value = points
    showManualInput.value = false
    manualPointInput.value = ''
    ElMessage.success('已成功添加 ' + points.length + ' 个点位')

    // 如果地图已加载，更新多边形
    if (map.value && polygon.value) {
      updatePolygon()
    }
  } catch (error) {
    ElMessage.error('点位格式错误，请按照经度,纬度格式输入，每行一个点位')
  }
}

// 打开地图编辑围栏
function openMapEditor() {
  if (!props.center || props.center.length !== 2) {
    ElMessage.warning('请先选择中心点位置')
    return
  }

  // 保存当前点位，用于取消操作
  tempPolygonPoints.value = cloneDeep(polygonPoints.value)

  mapVisible.value = true

  // 延迟初始化地图，确保DOM已渲染
  nextTick(() => {
    initMap()
  })
}

// 清空多边形点位
function clearPolygonPoints() {
  polygonPoints.value = []
  ElMessage.success('已清空围栏点位')

  // 如果地图已加载，清空多边形
  if (map.value && polygon.value) {
    map.value.removeOverlay(polygon.value)
    polygon.value = null
  }
}

// 初始化地图
function initMap() {
  // 确保百度地图脚本已加载
  loadBaiduMapScript()
    .then(() => {
      createMap()
    })
    .catch((error) => {
      console.error('百度地图加载失败', error)
      ElMessage.error('地图加载失败，请刷新重试')
    })
}

// 加载百度地图脚本
function loadBaiduMapScript() {
  return new Promise((resolve, reject) => {
    if (window.BMap) {
      resolve(window.BMap)
      return
    }

    // 百度地图API密钥
    const ak = import.meta.env.VITE_BAIDU_MAP_KEY || 'sT9shHPjuTbD7jHY9nC1grdjB0BR2LO2'
    
    // 创建script标签
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=initBMap&s=1`
    
    // 设置超时处理
    const timeout = setTimeout(() => {
      reject(new Error('百度地图脚本加载超时'))
    }, 10000)

    // 设置回调函数
    window.initBMap = function () {
      clearTimeout(timeout)
      if (window.BMap) {
        resolve(window.BMap)
      } else {
        reject(new Error('百度地图加载失败，BMap对象不存在'))
      }
    }

    script.onerror = function () {
      clearTimeout(timeout)
      reject(new Error('百度地图脚本加载失败'))
    }

    document.head.appendChild(script)
  })
}

// 创建地图
function createMap() {
  BMap.value = window.BMap

  // 创建地图实例
  map.value = new BMap.value.Map(mapContainer.value)

  // 设置中心点和缩放级别
  const centerPoint = new BMap.value.Point(props.center[0], props.center[1])
  map.value.centerAndZoom(centerPoint, 15)

  
  const icon = new BMap.value.Icon(
  markerImg,// 图标 URL
  new BMap.value.Size(60, 60), // 图标显示大小（宽, 高）
  {
    anchor: new BMap.value.Size(15, 15), // 锚点位置（图标中心点）
    imageSize: new BMap.value.Size(60, 60) // 图片实际大小（可选，默认与显示大小一致）
  }
 );
 const marker = new BMap.value.Marker(centerPoint, {icon: icon})
  map.value.addOverlay(marker)
  // 添加地图控件
  map.value.addControl(new BMap.value.NavigationControl()) // 添加平移缩放控件
  map.value.addControl(new BMap.value.ScaleControl()) // 添加比例尺控件
  map.value.enableScrollWheelZoom() // 启用滚轮缩放

  // 创建绘制管理器
  if (window.BMapLib && window.BMapLib.DrawingManager) {
    const styleOptions = {
      strokeColor: '#1989fa', // 边线颜色
      fillColor: '#1989fa', // 填充颜色
      strokeWeight: 3, // 边线宽度
      strokeOpacity: 1, // 边线透明度
      fillOpacity: 0.3, // 填充透明度
      strokeStyle: 'solid' // 边线样式
    }

    drawingManager.value = new window.BMapLib.DrawingManager(map.value, {
      isOpen: false, // 是否开启绘制模式
      enableDrawingTool: false, // 是否显示工具栏
      drawingToolOptions: {
        anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
        offset: new BMap.value.Size(5, 5) // 偏离值
      },
      polygonOptions: styleOptions // 多边形样式
    })

    // 添加鼠标绘制完成事件
    drawingManager.value.addEventListener('overlaycomplete', handleDrawComplete)
  }

  // 如果已有点位，创建多边形
  if (polygonPoints.value.length >= 3) {
    createPolygon()
  }

  // 添加地图点击事件
  map.value.addEventListener('click', handleMapClick)
}

// 更新地图视图
function updateMapView() {
  if (!map.value) return

  // 如果有多边形点位，将视图调整到多边形区域
  if (polygonPoints.value.length >= 3 && polygon.value) {
    // 计算多边形的边界
    const bounds = new BMap.value.Bounds()
    const points = polygon.value.getPath()
    for (let i = 0; i < points.length; i++) {
      bounds.extend(points[i])
    }
    map.value.setViewport(bounds)
  } else {
    // 否则居中到指定位置
    const centerPoint = new BMap.value.Point(props.center[0], props.center[1])
    map.value.centerAndZoom(centerPoint, 15)
  }
}

// 创建多边形
function createPolygon() {
  if (!map.value || !BMap.value) return

  // 如果已有多边形，先移除
  if (polygon.value) {
    map.value.removeOverlay(polygon.value)
  }

  // 创建百度地图点位数组
  const points = polygonPoints.value.map((point) => {
    return new BMap.value.Point(point[0], point[1])
  })

  // 创建新的多边形
  polygon.value = new BMap.value.Polygon(points, {
    strokeColor: '#1989fa',
    strokeWeight: 3,
    strokeOpacity: 1,
    fillColor: '#1989fa',
    fillOpacity: 0.3,
    enableEditing: true // 可编辑
  })

  // 添加到地图
  map.value.addOverlay(polygon.value)

  // 添加编辑事件
  polygon.value.addEventListener('lineupdate', handlePolygonEdit)
}

// 更新多边形
function updatePolygon() {
  if (!map.value || !BMap.value) return

  if (polygonPoints.value.length >= 3) {
    // 如果已有多边形，更新点位
    if (polygon.value) {
      const points = polygonPoints.value.map((point) => {
        return new BMap.value.Point(point[0], point[1])
      })
      polygon.value.setPath(points)
    } else {
      // 否则创建新的多边形
      createPolygon()
    }

    // 调整视图以适应多边形
    updateMapView()
  } else if (polygon.value) {
    // 如果点位不足3个，移除多边形
    map.value.removeOverlay(polygon.value)
    polygon.value = null
  }
}

// 处理多边形编辑事件
function handlePolygonEdit() {
  if (!polygon.value) return

  // 获取编辑后的路径
  const path = polygon.value.getPath()

  // 更新点位数据
  polygonPoints.value = path.map((point) => [point.lng, point.lat])
}

// 处理地图点击事件
function handleMapClick(e) {
  if (!isDrawing.value) return

  // 添加点到绘制中的点位
  drawingPoints.value.push([e.point.lng, e.point.lat])

  // 如果是第一个点，创建临时多边形
  if (drawingPoints.value.length === 1) {
    createTempPolygon()
  } else {
    // 更新临时多边形
    updateTempPolygon()
  }
}

// 开始绘制多边形
function startDrawing() {
  isDrawing.value = true
  drawingPoints.value = []
  polygonPoints.value = []

  // 如果使用绘制库
  if (drawingManager.value) {
    // 清除现有多边形
    if (polygon.value) {
      map.value.removeOverlay(polygon.value)
      polygon.value = null
    }

    // 开启绘制模式
    drawingManager.value.setDrawingMode(window.BMAP_DRAWING_POLYGON)
    drawingManager.value.open()

    // 提示用户
    ElMessage.info('请在地图上绘制围栏区域')
    return
  }

  // 手动绘制模式
  // 移除现有多边形
  if (polygon.value) {
    map.value.removeOverlay(polygon.value)
    polygon.value = null
  }

  // 更改鼠标样式
  map.value.setDefaultCursor('crosshair')
}

// 创建临时多边形
function createTempPolygon() {
  if (!map.value || !BMap.value) return

  // 创建百度地图点位数组
  const points = drawingPoints.value.map((point) => {
    return new BMap.value.Point(point[0], point[1])
  })

  polygon.value = new BMap.value.Polygon(points, {
    strokeColor: '#1989fa',
    strokeWeight: 3,
    strokeOpacity: 1,
    fillColor: '#1989fa',
    fillOpacity: 0.3,
    enableEditing: false
  })

  map.value.addOverlay(polygon.value)
}

// 更新临时多边形
function updateTempPolygon() {
  if (!polygon.value) return

  // 创建百度地图点位数组
  const points = drawingPoints.value.map((point) => {
    return new BMap.value.Point(point[0], point[1])
  })

  polygon.value.setPath(points)
}

// 完成绘制
function finishDrawing() {
  if (!isDrawing.value) return

  // 检查是否有足够的点位
  if (drawingPoints.value.length < 3) {
    ElMessage.warning('多边形围栏至少需要3个点')
    return
  }

  // 恢复鼠标样式
  map.value.setDefaultCursor('default')

  // 结束绘制状态
  isDrawing.value = false

  // 更新点位数据
  polygonPoints.value = drawingPoints.value

  // 清空绘制中的点位
  drawingPoints.value = []

  // 更新多边形为可编辑状态
  if (polygon.value) {
    polygon.value.enableEditing()
    polygon.value.addEventListener('lineupdate', handlePolygonEdit)
  }
}

// 处理绘制完成事件（绘制库）
function handleDrawComplete(e) {
  // 获取绘制的多边形
  const overlay = e.overlay

  // 获取多边形的点位
  const path = overlay.getPath()

  // 更新点位数据
  polygonPoints.value = path.map((point) => [point.lng, point.lat])

  // 关闭绘制模式
  drawingManager.value.close()

  // 移除自动创建的多边形
  map.value.removeOverlay(overlay)

  // 创建可编辑的多边形
  createPolygon()

  // 结束绘制状态
  isDrawing.value = false
}

// 取消绘制
function cancelDrawing() {
  if (!isDrawing.value) return

  // 如果使用绘制库
  if (drawingManager.value) {
    drawingManager.value.close()
  } else {
    // 恢复鼠标样式
    map.value.setDefaultCursor('default')
  }

  // 清空绘制中的点位
  drawingPoints.value = []

  // 移除临时多边形
  if (polygon.value) {
    map.value.removeOverlay(polygon.value)
    polygon.value = null
  }

  // 结束绘制状态
  isDrawing.value = false

  // 如果之前有多边形，恢复它
  if (polygonPoints.value.length >= 3) {
    createPolygon()
  }

  ElMessage.info('已取消绘制')
}

// 关闭地图
function closeMap() {
  // 恢复之前的点位数据
  polygonPoints.value = cloneDeep(tempPolygonPoints.value)

  // 关闭弹窗
  mapVisible.value = false

  ElMessage.info('已取消围栏编辑')
}

// 确认地图编辑
function confirmMap() {
  // 检查是否有有效的围栏
  if (polygonPoints.value.length < 3) {
    ElMessage.warning('围栏至少需要3个点位，请重新绘制')
    return
  }

  // 关闭弹窗
  mapVisible.value = false

  // 清空临时数据
  tempPolygonPoints.value = []
  emit('confirm:points', polygonPoints.value)
  ElMessage.success('围栏设置已保存')
}

// 监听地图弹窗显示状态
watch(mapVisible, (visible) => {
  if (visible) {
    // 弹窗打开时，延迟初始化地图
    nextTick(() => {
      initMap()
    })
  }
})

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (map.value) {
    // 移除事件监听
    map.value.removeEventListener('click', handleMapClick)
    if (polygon.value) {
      polygon.value.removeEventListener('lineupdate', handlePolygonEdit)
      map.value.removeOverlay(polygon.value)
    }

    // 清理绘制管理器
    if (drawingManager.value) {
      drawingManager.value.close()
      drawingManager.value.removeEventListener('overlaycomplete', handleDrawComplete)
    }
  }
})
</script>

<template>
  <div class="electronic-fence">
    <div class="fence-tools">
      <el-button type="primary" @click="openMapEditor">
        <el-icon><EditPen /></el-icon> 绘制围栏
      </el-button>
      <el-button type="warning" @click="toggleManualInput">
        <el-icon><Edit /></el-icon> {{ showManualInput ? '取消输入' : '手动输入' }}
      </el-button>
      <el-button type="danger" @click="clearPolygonPoints">
        <el-icon><Delete /></el-icon> 清空围栏
      </el-button>
    </div>

    <!-- 手动输入点位 -->
    <div v-if="showManualInput" class="manual-input-area">
      <el-alert
        title="手动输入点位格式说明"
        type="info"
        :closable="false"
        description="请按照经度,纬度格式输入，每行一个点位，至少需要3个点位。例如：116.404,39.915"
        show-icon
        class="mb-10"
      />
      <el-input
        v-model="manualPointInput"
        type="textarea"
        :rows="5"
        placeholder="请输入点位坐标，每行一个点，格式：经度,纬度"
      />
      <div class="manual-input-actions">
        <el-button type="primary" @click="parseManualInput">确认添加</el-button>
        <el-button @click="showManualInput = false">取消</el-button>
      </div>
    </div>

    <!-- 显示围栏点位信息 -->
    <div class="polygon-info" v-else-if="polygonPoints.length > 0">
      <div class="info-header">
        <span>已设置 {{ polygonPoints.length }} 个围栏点位</span>
      </div>
      <div class="polygon-points-list">
        <div v-for="(point, index) in polygonPoints" :key="index" class="point-item">
          <span>点 {{ index + 1 }}: [{{ point[0].toFixed(6) }}, {{ point[1].toFixed(6) }}]</span>
        </div>
      </div>
    </div>

    <el-empty v-else description="暂未设置围栏区域" />

    <el-alert
      title="围栏设置提示"
      type="info"
      :closable="false"
      description="电子围栏用于限定门店的服务范围。您可以通过绘制围栏或手动输入来创建多边形区域，至少需要3个点位。"
      show-icon
      class="mt-10"
    />

    <!-- 地图弹窗 -->
    <el-dialog
      v-model="mapVisible"
      title="电子围栏设置"
      width="80%"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <div class="map-container">
        <div class="map-tools">
          <el-button v-if="!isDrawing" type="primary" @click="startDrawing"> 开始绘制 </el-button>
          <el-button v-else type="success" @click="finishDrawing"> 结束绘制 </el-button>
          <el-button v-if="isDrawing" type="warning" @click="cancelDrawing"> 取消绘制 </el-button>
          <el-button v-else type="danger" @click="clearPolygonPoints"> 清空围栏 </el-button>
          <el-alert
            v-if="isDrawing"
            type="info"
            :closable="false"
            description="请在地图上点击添加围栏顶点，双击结束绘制，或点击结束绘制按钮完成"
            show-icon
            style="margin-left: 10px; flex: 1"
          />
        </div>
        <div ref="mapContainer" class="map"></div>

        <!-- 地图中显示当前围栏点位信息 -->
        <div v-if="polygonPoints.length > 0" class="map-polygon-info">
          <div class="info-header">
            <span>当前围栏点位 ({{ polygonPoints.length }}个)</span>
          </div>
          <div class="polygon-points-list">
            <div v-for="(point, index) in polygonPoints" :key="index" class="point-item">
              <span
                >点 {{ index + 1 }}: [{{ point[0].toFixed(6) }}, {{ point[1].toFixed(6) }}]</span
              >
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="closeMap">取消</el-button>
        <el-button type="primary" :disabled="!polygonPoints.length" @click="confirmMap">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.electronic-fence {
  width: 100%;
}

.fence-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.polygon-info {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.info-header {
  background-color: #f5f7fa;
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid #ebeef5;
}

.polygon-points-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
}

.point-item {
  padding: 5px 0;
  border-bottom: 1px dashed #ebeef5;
  font-size: 13px;
  color: #606266;
}

.point-item:last-child {
  border-bottom: none;
}

.manual-input-area {
  margin-bottom: 15px;
}

.manual-input-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.map-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.map-tools {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.map {
  width: 100%;
  height: 500px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px;
}

/* 地图中的围栏点位信息样式 */
.map-polygon-info {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
  max-height: 200px;
  display: flex;
  flex-direction: column;
}

.map-polygon-info .polygon-points-list {
  flex: 1;
  overflow-y: auto;
}

.mb-10 {
  margin-bottom: 10px;
}

.mt-10 {
  margin-top: 10px;
}
</style> 