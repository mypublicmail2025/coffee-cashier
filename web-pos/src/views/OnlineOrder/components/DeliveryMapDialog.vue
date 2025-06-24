<template>
  <el-dialog
    v-model="dialogVisible"
    title="配送位置查看"
    width="800px"
    @closed="handleDialogClosed"
  >
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>
    
    <div v-else-if="error" class="error-container">
      <el-empty description="获取配送位置失败" :image-size="120">
        <template #description>
          <p>{{ errorMessage }}</p>
        </template>
        <el-button type="primary" @click="fetchDeliveryLocation">重试</el-button>
      </el-empty>
    </div>
    
    <div v-else-if="!locationData" class="empty-container">
      <el-empty description="暂无配送位置信息" :image-size="120" />
    </div>
    
    <div v-else class="map-container">
      <!-- 配送员信息显示区域 -->
      <div class="delivery-info">
        <el-avatar :src="locationData.headIcon || ''" :size="50">
          <el-icon><user /></el-icon>
        </el-avatar>
        <div class="info-detail">
          <div class="info-row">
            <span class="info-label">配送员:</span>
            <span class="info-value">{{ locationData.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话:</span>
            <span class="info-value">{{ locationData.mobile }}</span>
            <el-button 
              type="primary" 
              size="small" 
              link 
              @click="handleCall(locationData.mobile)"
            >
              拨打电话
            </el-button>
          </div>
          <div class="info-row">
            <span class="info-label">预计送达:</span>
            <span class="info-value estimate-time">{{ locationData.estimateDeliveryTimeTip }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">更新时间:</span>
            <span class="info-value">{{ locationData.time }}</span>
          </div>
        </div>
      </div>
      
      <!-- 百度地图容器 -->
      <div id="map-container" ref="mapContainer" class="baidu-map"></div>
      
      <!-- 刷新按钮 -->
      <el-button 
        type="primary" 
        class="refresh-btn" 
        :loading="refreshing" 
        circle 
        @click="fetchDeliveryLocation"
      >
        <el-icon><refresh /></el-icon>
      </el-button>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, shallowRef, defineProps,   nextTick, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { User, Refresh } from '@element-plus/icons-vue';
import { getShansongLocation } from '@/api/mall/order/onlineOrder';

// Props definition
const props = defineProps({
  orderId: {
    type: [Number, String],
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);

// Refs and reactive state
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const refreshing = ref(false);
const locationData = ref(null);
const mapContainer = ref(null);
const baiduMap = shallowRef(null);
const marker = shallowRef(null);

// BMap API loading state
const isBMapLoaded = ref(false);
const isBMapLoading = ref(false);


const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close');
    }
  }
});

// Get delivery location from API
const fetchDeliveryLocation = async () => {
  if (!props.orderId) {
    error.value = true;
    errorMessage.value = '订单ID不能为空';
    return;
  }
  
  loading.value = !refreshing.value;
  refreshing.value = true;
  error.value = false;
  
  try {
    const response = await getShansongLocation(props.orderId);
    
    if (response && response.code === 0 && response.data) {
      locationData.value = response.data;
      
      // Initialize map after fetching location data
      await loadBaiduMapScript();
      await nextTick();
      initMap();
    } else {
      error.value = true;
      errorMessage.value = response?.msg || '获取配送位置失败';
      locationData.value = null;
    }
  } catch (err) {
    console.error('获取配送位置失败:', err);
    error.value = true;
    errorMessage.value = '请求失败，请检查网络连接';
    locationData.value = null;
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// Load Baidu Map JavaScript API
const loadBaiduMapScript = () => {
  return new Promise((resolve) => {
    if (window.BMap) {
      isBMapLoaded.value = true;
      resolve();
      return;
    }
    
    if (isBMapLoading.value) {
      // Wait for loading to complete
      const checkInterval = setInterval(() => {
        if (window.BMap) {
          clearInterval(checkInterval);
          isBMapLoaded.value = true;
          resolve();
        }
      }, 100);
      return;
    }
    
    isBMapLoading.value = true;
    const ak = import.meta.env.VITE_BAIDU_MAP_KEY || 'your_baidu_map_key'

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=onBMapCallback`;
    document.head.appendChild(script);
    
    // Define callback function
    window.onBMapCallback = () => {
      isBMapLoaded.value = true;
      isBMapLoading.value = false;
      resolve();
    };
  });
};

// Initialize Baidu Map
const initMap = () => {
  if (!locationData.value || !locationData.value.longitude || !locationData.value.latitude) {
    return;
  }
  
  try {
    // If map already initialized, just update marker position
    if (baiduMap.value) {
      updateMarkerPosition();
      return;
    }
    
    // Create new map
    baiduMap.value = new window.BMap.Map(mapContainer.value);
    
    // Convert coordinates from GPS to Baidu Map (if needed)
    const point = new window.BMap.Point(
      parseFloat(locationData.value.longitude), 
      parseFloat(locationData.value.latitude)
    );
    
    // Center map on delivery location
    baiduMap.value.centerAndZoom(point, 16);
    
    // Add navigation control
    baiduMap.value.addControl(new window.BMap.NavigationControl());
    baiduMap.value.addControl(new window.BMap.ScaleControl());
    
    // Create marker with custom icon
    const customIcon = new window.BMap.Icon(
      "https://api.map.baidu.com/images/marker_red_sprite.png",
      new window.BMap.Size(39, 25),
      {
        imageOffset: new window.BMap.Size(0, 0)
      }
    );
    
    marker.value = new window.BMap.Marker(point, { icon: customIcon });
    baiduMap.value.addOverlay(marker.value);
    
    // Add info window with delivery info
    const infoWindow = new window.BMap.InfoWindow(
      `<div class="map-info-window">
        <div>配送员: ${locationData.value.name}</div>
        <div>电话: ${locationData.value.mobile}</div>
        <div>更新时间: ${locationData.value.time}</div>
      </div>`, 
      {
        width: 220,
        height: 100,
        title: "配送信息"
      }
    );
    
    marker.value.addEventListener("click", function() {
      this.openInfoWindow(infoWindow);
    });
    
    // Open info window by default
    marker.value.openInfoWindow(infoWindow);
    
  } catch (error) {
    console.error('初始化地图失败:', error);
    ElMessage.error('地图初始化失败');
  }
};

// Update marker position when location data changes
const updateMarkerPosition = () => {
  if (!baiduMap.value || !marker.value || !locationData.value) return;
  
  const point = new window.BMap.Point(
    parseFloat(locationData.value.longitude), 
    parseFloat(locationData.value.latitude)
  );
  
  marker.value.setPosition(point);
  baiduMap.value.panTo(point);
};

// Handle calling the delivery person
const handleCall = (mobile) => {
  if (!mobile) {
    ElMessage.warning('电话号码不可用');
    return;
  }
  
  // On mobile devices, directly call
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = `tel:${mobile}`;
  } else {
    // On desktop, just show the phone number
    ElMessage.info(`配送员电话: ${mobile}`);
  }
};

watch(() => props.visible, (newValue) => {
  if (newValue) {
    fetchDeliveryLocation();
  }
});


onBeforeUnmount(() => {
  // Clean up Baidu Map instance and markers if needed
  if (baiduMap.value) {
    baiduMap.value = null;
  }
  if (marker.value) {
    marker.value = null;
  }
});

</script>

<style scoped>
.loading-container,
.error-container,
.empty-container {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.map-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.delivery-info {
  display: flex;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.info-detail {
  margin-left: 16px;
  flex: 1;
}

.info-row {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: bold;
  width: 80px;
  color: #606266;
}

.info-value {
  color: #303133;
}

.estimate-time {
  color: var(--el-color-primary);
  font-weight: bold;
}

.baidu-map {
  flex: 1;
  width: 100%;
  min-height: 350px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.refresh-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* Styling for the Baidu Map info window (applied via global styles) */
:deep(.BMap_bubble_title) {
  font-weight: bold;
  color: var(--el-color-primary);
}

:deep(.BMap_bubble_content) {
  font-size: 14px;
  line-height: 1.5;
}
</style> 