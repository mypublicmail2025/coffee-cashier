<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, ref, watch, nextTick } from 'vue'

const props = defineProps({
  // 初始中心点位置 [经度, 纬度]
  center: {
    type: Array,
    default: () => [116.404, 39.915] // 默认北京市中心
  },
  // 初始缩放级别
  zoom: {
    type: Number,
    default: 15
  }
})

const emit = defineEmits(['confirm', 'map-loaded'])

// 地图相关
const mapContainer = ref(null)
const map = ref(null)
const BMap = ref(null)
const mapVisible = ref(false)
const searchInput = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const selectedLocation = ref({
  address: '',
  point: null
})
const geocoder = ref(null)
// const localSearch = ref(null)
// const autoComplete = ref(null)

// 打开地图选择器
function open(options = {}) {
  mapVisible.value = true
  if (options?.lnglat) {
    selectedLocation.value = {
      address: options.address,
      point: {
        lng: options.lnglat[0],
        lat: options.lnglat[1]
      }
    }
  }
  // 延迟初始化地图，确保DOM已渲染
  nextTick(() => {
    initMap()
  })
}

async function loadSelectMarker({ lng, lat }) {
  // 由于浏览器获取的是WGS84坐标系，需要转换为百度坐标系
  const point = new BMap.value.Point(lng, lat)

  try {
    // 清除之前的标记
    map.value.clearOverlays()

    // 添加新标记
    const marker = new BMap.value.Marker(point)
    map.value.addOverlay(marker)

    // 居中到当前位置
    map.value.panTo(point)

    // 获取地址信息
    geocoder.value.getLocation(point, (geoResult) => {
      if (geoResult) {
        selectedLocation.value = {
          address: geoResult.address,
          point: {
            lng: point.lng,
            lat: point.lat
          }
        }

        // 显示信息窗口
        const infoWindow = new BMap.value.InfoWindow(geoResult.address, {
          width: 250,
          height: 80,
          title: '当前位置'
        })

        marker.addEventListener('click', function () {
          map.value.openInfoWindow(infoWindow, point)
        })

        // 自动打开信息窗口
        map.value.openInfoWindow(infoWindow, point)
      }
    })
  } catch (error) {
    console.error('坐标转换失败', error)
    ElMessage.error('位置坐标转换失败')
  }
}

// 初始化地图
async function initMap() {
  // 如果地图已经初始化，只需要更新视图

  // 确保百度地图脚本已加载
  try {
    await loadBaiduMapScript()

    // 使用setTimeout确保DOM已完全渲染
    setTimeout(() => {
      createMap()
    }, 0)
  } catch (error) {
    console.error('百度地图加载失败', error)
    ElMessage.error('地图加载失败，请刷新重试')
  }
}

// 加载百度地图脚本
function loadBaiduMapScript() {
  return new Promise((resolve, reject) => {
    if (window.BMapGL) {
      resolve(window.BMapGL)
      return
    }

    // 百度地图API密钥
    const ak = import.meta.env.VITE_BAIDU_MAP_KEY || 'sT9shHPjuTbD7jHY9nC1grdjB0BR2LO2'

    // 创建script标签
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=initBMap&s=1` // 使用普通版本

    // 设置超时处理
    const timeout = setTimeout(() => {
      reject(new Error('百度地图脚本加载超时'))
    }, 10000)

    // 设置回调函数
    window.initBMap = function () {
      clearTimeout(timeout)
      if (window.BMap) {
        // 为了兼容性，将BMap赋值给BMapGL
        window.BMapGL = window.BMap
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
  try {
    BMap.value = window.BMap || window.BMapGL

    if (!BMap.value) {
      throw new Error('百度地图API未正确加载')
    }

    // 检查容器是否存在
    if (!mapContainer.value) {
      console.error('地图容器不存在')
      return
    }

    // 创建地图实例
    map.value = new BMap.value.Map(mapContainer.value)

    // 设置中心点和缩放级别
    const centerPoint = new BMap.value.Point(props.center[0], props.center[1])
    map.value.centerAndZoom(centerPoint, props.zoom)

    // 添加地图控件
    map.value.addControl(new BMap.value.ScaleControl()) // 添加比例尺控件
    map.value.enableScrollWheelZoom() // 启用滚轮缩放

    // 创建地址解析器
    geocoder.value = new BMap.value.Geocoder()
    // localSearch.value = new BMap.value.LocalSearch(map.value, {
    //   onSearchComplete: handleSearchComplete,
    //   pageCapacity: 10
    // })

    // 初始化自动完成
    // initAutoComplete()

    // 如果有选中位置，加载标记
    if (selectedLocation.value && selectedLocation.value.point) {
      loadSelectMarker(selectedLocation.value.point)
    } else {
      // 否则尝试获取当前位置
      getCurrentLocation()
    }

    // 添加地图点击事件
    map.value.addEventListener('click', handleMapClick)

    // 通知父组件地图已加载完成
    emit('map-loaded')
  } catch (error) {
    console.error('创建地图失败', error)
    ElMessage.error('地图初始化失败，请刷新页面重试')
  }
}

// // 初始化自动完成
// function initAutoComplete() {
//   try {
//     // 确保搜索输入框已经渲染
//     nextTick(() => {
//       // 创建自动完成实例
//       autoComplete.value = new BMap.value.Autocomplete({
//         input: 'bmap-search-input', // 指定建议框绑定的input元素ID
//         location: map.value // 设置自动完成的范围为地图实例
//       })

//       // 添加选中建议的事件监听
//       autoComplete.value.addEventListener('onconfirm', function (e) {
//         const item = e.item
//         searchInput.value = item.value

//         console.log(item)
//         debugger
//         // 搜索选中的地址
//         localSearch.value.search(item.value)
//       })
//     })
//   } catch (error) {
//     console.error('初始化自动完成失败', error)
//   }
// }

// 搜索地址
function searchAddress() {
  if (!map.value || !BMap.value) {
    ElMessage.warning('地图尚未初始化，请稍后再试')
    return
  }

  if (!searchInput.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  isSearching.value = true
  searchResults.value = []

  // 使用百度地图本地搜索
  const local = new BMap.value.LocalSearch(map.value, {
    renderOptions: { map: map.value },
    onSearchComplete: function (results) {
      isSearching.value = false

      if (!results || !results.getPoi || results.getCurrentNumPois() === 0) {
        ElMessage.warning('未找到相关地址，请尝试其他关键词')
        return
      }

      for (var i = 0; i < results.getCurrentNumPois(); i++) {
        const poi = results.getPoi(i)

        searchResults.value.push({
          title: poi.title,
          address: poi.address,
          point: {
            lng: poi.point.lng,
            lat: poi.point.lat
          }
        })
      }
      // 处理搜索结果
      // const pois = results.getPoi()
      // searchResults.value = pois.map((poi) => ({
      //   title: poi.title,
      //   address: poi.address,
      //   point: {
      //     lng: poi.point.lng,
      //     lat: poi.point.lat
      //   }
      // }))

      // 自动选择第一个结果
      if (searchResults.value.length > 0) {
        selectSearchResult(searchResults.value[0])
      }
    }
  })

  // 执行搜索
  local.search(searchInput.value)
}

// 选择搜索结果
function selectSearchResult(result) {
  if (!map.value || !BMap.value) return

  selectedLocation.value = result

  // 清除之前的标记
  map.value.clearOverlays()

  // 创建新的点和标记
  const point = new BMap.value.Point(result.point.lng, result.point.lat)
  const marker = new BMap.value.Marker(point)

  // 添加标记并居中
  map.value.addOverlay(marker)
  map.value.panTo(point)

  // 显示信息窗口
  const infoWindow = new BMap.value.InfoWindow(result.address, {
    width: 250,
    height: 80,
    title: result.title
  })

  marker.addEventListener('click', function () {
    map.value.openInfoWindow(infoWindow, point)
  })

  // 自动打开信息窗口
  map.value.openInfoWindow(infoWindow, point)
}

// 获取当前位置
function getCurrentLocation() {
  if (!map.value || !BMap.value) {
    ElMessage.warning('地图尚未初始化，请稍后再试')
    return
  }

  if (navigator.geolocation) {
    isSearching.value = true
    ElMessage.info('正在获取您的位置...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 由于浏览器获取的是WGS84坐标系，需要转换为百度坐标系
        const point = new BMap.value.Point(position.coords.longitude, position.coords.latitude)
        loadSelectMarker(point)
        isSearching.value = false
      },
      (error) => {
        let errorMessage = '获取位置失败'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝了位置请求'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用'
            break
          case error.TIMEOUT:
            errorMessage = '获取位置超时'
            break
        }

        ElMessage.error(errorMessage)
        isSearching.value = false
      }
    )
  } else {
    ElMessage.error('您的浏览器不支持地理定位')
  }
}

// 处理地图点击事件
function handleMapClick(e) {
  const point = e.point

  // 逆地址解析，根据点击位置获取地址信息
  geocoder.value.getLocation(point, (result) => {
    if (result) {
      selectedLocation.value = {
        address: result.address,
        point: {
          lng: point.lng,
          lat: point.lat
        }
      }

      // 清除之前的标记
      map.value.clearOverlays()

      // 添加新标记
      const marker = new BMap.value.Marker(point)
      map.value.addOverlay(marker)

      // 显示信息窗口
      const infoWindow = new BMap.value.InfoWindow(result.address, {
        width: 250,
        height: 80,
        title: '当前位置'
      })

      marker.addEventListener('click', function () {
        map.value.openInfoWindow(infoWindow, point)
      })

      // 自动打开信息窗口
      map.value.openInfoWindow(infoWindow, point)
    }
  })
}

// 确认选择
function confirmSelection() {
  if (!selectedLocation.value.point) {
    ElMessage.warning('请先选择位置')
    return
  }

  // 发送确认事件
  emit('confirm', {
    address: selectedLocation.value.address,
    longitude: selectedLocation.value.point.lng,
    latitude: selectedLocation.value.point.lat
  })

  // 关闭地图
  mapVisible.value = false
}

// 取消选择
function cancelSelection() {
  mapVisible.value = false
}

// 监听地图弹窗显示状态
watch(mapVisible, (visible) => {
  if (visible) {
    // 弹窗打开时，延迟初始化地图
    nextTick(async () => {
      initMap()
    })
  }
})

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (map.value) {
    // 移除事件监听
    map.value.removeEventListener('click', handleMapClick)

    // 清除覆盖物
    map.value.clearOverlays()

    // 释放地图实例
    map.value = null
  }

  // 清除全局回调
  if (window.initBMap) {
    window.initBMap = null
  }

  // 清除搜索结果
  searchResults.value = []
})

defineExpose({
  open,
  close: () => {
    mapVisible.value = false
  }
})
</script>

<template>
  <div class="bmap-container">
    <!-- 地图弹窗 -->
    <el-dialog
      v-model="mapVisible"
      title="选择位置"
      width="80%"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <!-- 搜索框 -->
      <div class="map-search">
        <el-input
          v-model="searchInput"
          placeholder="搜索地址"
          @keyup.enter="searchAddress"
          id="bmap-search-input"
        />
        <el-button type="primary" @click="getCurrentLocation" class="location-btn">
          <el-icon><Location /></el-icon> 定位
        </el-button>
      </div>

      <!-- 搜索结果列表 -->
      <!-- <div v-if="searchResults.length > 0" class="search-results">
        <div class="results-header">搜索结果</div>
        <div class="results-list">
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="result-item"
            @click="selectSearchResult(result)"
          >
            <div class="result-title">{{ result.title }}</div>
            <div class="result-address">{{ result.address }}</div>
          </div>
        </div>
      </div> -->

      <!-- 地图容器 -->
      <div ref="mapContainer" class="map"></div>

      <!-- 当前选择的位置 -->
      <div v-if="selectedLocation.address" class="selected-location">
        <div class="location-header">当前选择的位置</div>
        <div class="location-address">{{ selectedLocation.address }}</div>
        <div class="location-coordinates" v-if="selectedLocation.point">
          经度: {{ selectedLocation.point.lng.toFixed(6) }}, 纬度:
          {{ selectedLocation.point.lat.toFixed(6) }}
        </div>
      </div>

      <template #footer>
        <el-button @click="cancelSelection">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确认选择</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.bmap-container {
  width: 100%;
}

.map-search {
  display: flex;
  margin-bottom: 10px;
  gap: 10px;
}

.map-search .el-input {
  flex: 1;
}

.location-btn {
  white-space: nowrap;
}

.search-results {
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.results-header {
  background-color: #f5f7fa;
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid #ebeef5;
}

.results-list {
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f5f7fa;
}

.result-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.result-address {
  font-size: 12px;
  color: #909399;
}

.map {
  width: 100%;
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 10px;
}

.selected-location {
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.location-header {
  background-color: #f5f7fa;
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid #ebeef5;
}

.location-address {
  padding: 10px 12px;
  border-bottom: 1px solid #ebeef5;
}

.location-coordinates {
  padding: 8px 12px;
  font-size: 12px;
  color: #909399;
}
</style> 