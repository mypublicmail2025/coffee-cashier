<!--
    @name: AMap
    @author: kahu4
    @date: 2024-02-01 17:41
    @description：高德地图组件
    @update: 2024-02-01 17:41
-->
<script
    setup
    lang="ts">
import { AMapDialogOptionsModel } from "@/components/AMap/index.model";
import AMapLoader from "@amap/amap-jsapi-loader";
import { cloneDeep, debounce } from "lodash-es";
import { Ref } from "vue";

defineComponent({
  name: 'AMap'
})

const emits = defineEmits(['confirm'])
const show = ref(false)
const dialogOptions = ref({
  title: '选择地址',
  width: '80%'
})

async function open(options: AMapDialogOptionsModel = {}) {
  dialogOptions.value = { ...dialogOptions.value, ...options }
  show.value = true
  await initAMap()
  if(options.lnglat){
    addMarker([options.lnglat[0],options.lnglat[1]])
    map.value.setZoomAndCenter(18, [options.lnglat[0],options.lnglat[1]], false, 500)
    doSelect([options.lnglat[0],options.lnglat[1]])
  }
}

function close() {
  clearMarker()
  searchTipList.value = 0
  map.value.destroy()
  show.value = false
}

onBeforeMount(()=>{
  map.value?.destroy()
})
defineExpose({ open, close })

// ============================= 地图相关 ================================
// 密钥

const map = ref()
const AMap = ref()
const autoComplete = ref()
const placeSearch = ref()
const geocoder = ref()

/**
 * 初始化地图
 */
async function initAMap() {
  try {
    const pluginList = ['AMap.Geocoder', 'AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.ToolBar', 'AMap.Scale', 'AMap.ControlBar', 'AMap.Geolocation', 'AMap.HawkEye', 'AMap.MapType']
    // 加载高德地图
    AMap.value = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: pluginList, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    });
    // 使用nextTick防止先加载拿不到container
    await nextTick(() => {
      map.value = new AMap.value.Map('amap-container', {
        zoom: 11, // 初始化地图级别
      })
      // 添加控件
      AMap.value.plugin(pluginList, () => {
        const toolbar = new AMap.value.ToolBar({
          position: {
            bottom: '60px',
            right: '16px'
          }
        }); //缩放工具条实例化
        const scale = new AMap.value.Scale(); //比例尺
        const controlBar = new AMap.value.ControlBar({
          position: {
            bottom: '140px',
            right: '5px'
          }
        }); //控制罗盘
        const geolocation = new AMap.value.Geolocation(); //定位控件
        const hawkEye = new AMap.value.HawkEye({
          position: 'LB'
        });  // 鹰眼控件
        const mapType = new AMap.value.MapType();  // 图层切换控件
        map.value.addControl(toolbar)
        map.value.addControl(scale);
        map.value.addControl(controlBar);
        map.value.addControl(geolocation);
        map.value.addControl(hawkEye);
        map.value.addControl(mapType);
        autoComplete.value = new AMap.value.AutoComplete({
          //city 限定城市，默认全国
          city: "全国",
        });
        placeSearch.value = new AMap.value.PlaceSearch({})
        geocoder.value = new AMap.value.Geocoder({})
      })
      // 添加事件监听
      map.value.on('click', ({ lnglat }: any) => {
        searchTipList.value = []
        selectAddress.value = undefined
        clearMarker()
        map.value.setZoomAndCenter(18, [lnglat.lng, lnglat.lat], false, 500)
        addMarker([lnglat.lng, lnglat.lat])
        doSelect([lnglat.lng, lnglat.lat])
      })
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * 地图提示插件
 * @param keyword
 */
async function searchMapTip(keyword: string) {
  //异步加载 AutoComplete 插件
  return new Promise((resolve, reject) => {
    //根据关键字进行搜索 keyword 为搜索的关键词
    autoComplete.value.search(keyword, (status, result) => {
      //搜索成功时，result 即是对应的匹配数据
      if (status === 'complete') {
        resolve(result.tips)
      } else {
        reject(result)
      }
    });
  })
}

/**
 * 地图搜索
 * 成功以后添加mark
 * @param keyword
 */
async function searchMap(keyword: string) {
  //异步加载 AutoComplete 插件
  return new Promise((resolve, reject) => {
    //根据关键字进行搜索 keyword 为搜索的关键词
    placeSearch.value.search(keyword, (status, result) => {
      //搜索成功时，result 即是对应的匹配数据
      if (status === 'complete') {
        resolve(result.poiList.pois)
      } else {
        reject(result)
      }
    })
  })
}

// 当前地图上的marker
const markerList: Ref<any> = ref([])

/**
 * 添加marker
 * @param position
 */
function addMarker(position: any[]) {
  const marker = new AMap.value.Marker({
    position: new AMap.value.LngLat(position[0], position[1])
  })
  // marker添加点击事件
  marker.on('click', ({ lnglat }: any) => {
    doSelect([lnglat.lng, lnglat.lat])
  });
  markerList.value.push(marker)
  map.value.add(markerList.value)
}

/**
 * 清空marker
 */
function clearMarker() {
  map.value.remove(markerList.value)
  markerList.value = []
}

// ============================= 搜索 ===============================
const searchName = ref('') // 搜索字符串
const searchTipList: Ref<any> = ref([]) // 搜索返回的提示列表

/**
 * 搜索提示
 * @param keyword
 */
const searchInputTips = debounce(async (keyword) => {
  searchTipList.value = await searchMapTip(keyword)
}, 300)

async function searchTipsClick(tipItem: any) {
  const res: any[] = await searchMap(tipItem.name) as any[];
  if (res.length <= 0) return
  searchTipList.value = []
  selectAddress.value = undefined
  clearMarker()
  const firstAddress = res[0]
  // 设置第一个点为地图中心点
  map.value.setZoomAndCenter(18, [firstAddress.location.lng, firstAddress.location.lat], false, 500)
  res.forEach(item => {
    addMarker([item.location.lng, item.location.lat])
  })
}

// ============================= 选中 ==================================
const selectAddress:Ref<any> = ref()
function doSelect(position: any[]) {
  // 根据经纬度逆编码
  geocoder.value.getAddress(position, function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      // result为对应的地理位置详细信息
      selectAddress.value = {
        position,
        addressInfo:result.regeocode
      }
    }
  })
}

function confirm(){
  emits('confirm',cloneDeep(selectAddress.value))
  close()
}


</script>

<template>
  <el-dialog
      v-model="show"
      append-to-body
      v-bind="dialogOptions">
    <div class="map">
      <div class="search ">
        <div class="flex items-center">
          <el-input
              placeholder="请输入搜索的地址"
              class="input"
              clearable
              v-model="searchName"
              @input="searchInputTips"
              @clear="searchTipList.length=0"
          />

        </div>
        <div
            class="tips-content"
            :class="{'show-tips':searchTipList.length>0}">
          <div
              class="tip"
              v-for="tip in searchTipList"
              :key="tip.id"
              @click="searchTipsClick(tip)">
            {{ tip.name }}
          </div>
        </div>
      </div>
      <div id="amap-container">
      </div>
    </div>
    <div class="mt-[10px]" v-if="selectAddress">
      当前选中地址：<el-tag>{{ selectAddress.addressInfo.formattedAddress }}</el-tag>
    </div>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :disabled="!selectAddress" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style
    scoped
    lang="scss">
.map {
  position: relative;
  width: 100%;
  height: 60vh;
  border-radius: 15px;
  overflow: hidden;

  .search {
    z-index: 999;
    position: absolute;
    top: 30px;
    left: 30px;

    .input {
      width: 200px;
      border: none;
      box-shadow: 0 0 10rpx #cecece;
    }

    .tips-content {
      scale: 0;
      width: 200px;
      max-height: 400px;
      overflow-y: auto;
      box-sizing: border-box;
      margin-top: 10px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10rpx #cecece;
      transition: all .3s;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }

      .tip {
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 15px 10px;
        border-bottom: 1px solid #f4f4f4;
        cursor: pointer;
        transition: all .3s;

        &:hover {
          background: #f3f3f3;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }

    .show-tips {
      scale: 1;
    }
  }

  #amap-container {
    width: 100%;
    height: 100%;
  }
}

</style>
<style>
.custom-content-marker {
  position: relative;
  width: 25px;
  height: 34px;
}

.custom-content-marker img {
  width: 100%;
  height: 100%;
}

.custom-content-marker .close-btn {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 15px;
  height: 15px;
  font-size: 12px;
  background: #ccc;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 15px;
  box-shadow: -1px 1px 1px rgba(10, 10, 10, .2);
}

.custom-content-marker .close-btn:hover {
  background: #666;
}
</style>
