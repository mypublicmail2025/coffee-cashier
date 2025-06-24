<template>
  <div class="canvas">
    <div class="topBox">
      <!--<a class="btn-black">返回店铺</a>-->
      <ul>
        <li
          v-for="(item, index) in deviceList"
          :key="index"
          :class="{ on: terminal == item.id }"
          @click="toggleDevice(item.id)"
        >
          <i class="iconfont" :class="'icon-' + item.name"></i>
        </li>
      </ul>
      <el-button
        class="btn-save"
        type="primary"
        @click="canvasSave"
        v-hasPermi="['shop:canvas:update-json']"
      >保存画布</el-button>
    </div>
    <div class="bottomWarp">
      <div class="leftBox">
        <left-bar />
      </div>
      <div class="mainContentWarp">
        <div class="mainContent" :class="'view-' + terminal">
          <cereshop-layout
            :terminal="terminal"
            :type-id="typeId"
            :shop-id="shopId"
            @showRightBox="showRightBox"
          />
        </div>
      </div>
      <div class="RightBox">
        <tool-panel v-if="comChoose" />
        <div v-else class="noChoose">
          <div>
            <i class="iconfont icon-kong" />
            <p>没有选定的组件<br />请拖拽左侧组件栏添加或者选择一个组件</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '../styles/index.scss'
import '../assets/font_icon/iconfont.css'
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { removeToken } from '@/utils/auth'
import leftBar from '../components/leftBar/panel.vue'
import toolPanel from '../components/toolBar/toolPanel.vue'
import CereshopLayout from '../components/canvasEditPage.vue'
import api from '../components/canvasShow/config/api'
import { sendReqMixin } from '../components/canvasShow/config/mixin'
import { canvasStore } from '../store/canvas'
const { sendReq } = sendReqMixin()
const canvasStoreObj = canvasStore();
const { terminal, componentsData, typeId } = storeToRefs(canvasStoreObj);
const { setTerminal, setActiveComponent, setComponentsData } = canvasStoreObj;
const comChoose = ref(false)
const deviceList = ref([
  {
    id: 2,
    name: 'h5',
  },
  {
    id: 1,
    name: 'xiaochengxu',
  },
  // {
  //   id: 4,
  //   name: 'pc',
  // },
  // {
  //   id: 3,
  //   name: 'app',
  // },
])
const canvasId = ref('')
const shopId = ref(0)
onMounted(() => {
  // shopId.value = parseInt(Cookies.get('cereShopId'))
  // canvasGet()
})

function toggleDevice (id) {
  setActiveComponent({})
  setTerminal(id)
  canvasGet()
}
// 保存画布
function canvasSave () {
  // 删除非必要的字符
  const cloneComponentsData = JSON.parse(JSON.stringify(componentsData.value))
  for (let i = 0; i < cloneComponentsData.length; i++) {
    delete cloneComponentsData[i].iconClass
    if (cloneComponentsData[i].type === 'productList') {
      cloneComponentsData[i].componentContent.productData.imgTextData = [] // 清除展示数据
    }
  }
  var paramsData = {
    terminal: terminal.value,
    json: JSON.stringify(cloneComponentsData),
  }
  if (canvasId.value) {
    paramsData.id = parseInt(canvasId.value)
  }
  paramsData.type = typeId.value
  const params = {
    url: api.saveCanvas,
    method: 'PUT',
    data: paramsData,
  }
  sendReq(params, (res) => {
    if (res.msg) {
      ElMessage.error(res.msg)
    } else {
      ElMessage.success({
        message: '保存成功！',
        type: 'success',
      })
    }
  })
}
// 读取画布
function canvasGet (id) {
  setComponentsData([])
  if(id){
    canvasId.value = id
  }
  var apiUrl = `${api.getCanvas}?id=${canvasId.value}&terminal=${terminal.value}`
  const params = {
    url: apiUrl,
    method: 'GET',
  }
  sendReq(
    params,
    (res) => {
      checkToken(res)
      console.log(res,'res')
      if (typeof uni !== 'undefined') {
        uni.setStorage({ key: 'sendNum', data: 0 })
      } else {
        localStorage.setItem('sendNum', 0)
      }
      const json = res.data.json
      if (json) {
        var componentsData = JSON.parse(res.data.json)
        for (let i = 0; i < componentsData.length; i++) {
          componentsData[i].componentContent.hasDatas = true
        }
        setComponentsData(componentsData)
      }
    },
    () => {
    }
  )
}

defineExpose({ canvasGet })
// 判断token是否失效
function checkToken (res) {
  const tokenErr = [20003, '20003', 20004, '20004', 20005, '20005']
  if (tokenErr.includes(res.code)) {
    localStorage.clear()
    removeToken()
    window.location.href = '/index.html'
  }
}
// 右侧工具栏显隐
function showRightBox (flag) {
  comChoose.value = flag
}
</script>

<style lang="scss" scoped>
.canvas {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--top-tool-height) - var(--tags-view-height) - var(--app-footer-height) - var(--app-content-padding) * 2);
  overflow: hidden;

  .topBox {
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #f0f3f4;
    position: relative;
    display: flex;
    justify-content: center;
    .btn-black {
      position: absolute;
      left: 20px;
      top: 0;
    }
    li {
      width: 56px;
      height: 52px;
      cursor: pointer;
      text-align: center;
      display: inline-block;
      .iconfont {
        font-size: 24px;
      }
      &:hover,
      &.on {
        background-color: var(--el-color-primary);
        color: #fff;
      }
    }
    .btn-save {
      position: absolute;
      right: 20px;
      top: 5px;
    }
  }
  .bottomWarp {
    flex: 1;
    display: flex;
    height: 0;
    border-bottom: 1px solid #f0f3f4;
    border-right: 1px solid #f0f3f4;
  }
  .leftBox {
    height: 100%;
    border-right: 1px solid #f0f3f4;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .mainContentWarp {
    background-color: #f0f3f4;
    overflow: auto;
    height: 100%;
    flex: 1;
    .mainContent {
      margin: 0 auto;
      max-width: 100%;
      width: 750px;
      &.view-4 {
        width: 100%;
        // max-width: 1200px;
      }
    }
  }
  .RightBox {
    height: 100%;
    border-left: 1px solid #f0f3f4;
    width: 320px;
    overflow: auto;
    .noChoose {
      width: 100%;
      display: flex;
      height: 100%;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: center;
      justify-content: center;
      color: #999;
      text-align: center;
      font-size: 16px;
      line-height: 1.8;
      .iconfont {
        font-size: 100px;
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
