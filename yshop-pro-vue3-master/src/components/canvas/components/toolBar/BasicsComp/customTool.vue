<template>
  <div class="customTool" :class="'terminal' + terminal">
    <h3 class="toolTit">自定义</h3>
    <div class="toolBox">
      <div class="selectBox">
        <div class="selectLayTit">
          选择模板<span>{{ selectTemplateName }}</span>
        </div>
        <div class="layoutList">
          <span
            v-for="(item, index) of layoutList"
            :key="item.id"
            class="item iconfont"
            :class="{
              active: activeComponent.componentContent.layoutType === item.type,
            }"
            @click="selectLayout(item, index)"
            v-html="item.Icon"
          ></span>
        </div>
      </div>
      <div class="itemBox flexStyle">
        <label>图片间隙</label>
        <div class="block">
          <el-slider
            v-model="activeComponent.componentContent.imgClearance"
            :show-input-controls="false"
            input-size="mini"
            show-input
          />
        </div>
      </div>
      <div class="itemBox flexStyle">
        <label>页面间距</label>
        <div class="block">
          <el-slider
            v-model="activeComponent.componentContent.pageSpacing"
            :show-input-controls="false"
            input-size="mini"
            show-input
          />
        </div>
      </div>

      <div class="itemBox">
        <div v-if="activeComponent.componentContent.layoutType !== 'average'">
          <div class="textTit">布局</div>
          <p>选定布局区域，在下方添加图片，建议添加比例一致的图片</p>
          <div
            class="layoutBox"
            :class="activeComponent.componentContent.layoutType"
          >
            <div
              v-for="index of activeComponent.componentContent.elementNum"
              :key="index"
              class="item"
              :class="{
                active:
                  activeComponent.componentContent.imgBoxActive === index - 1,
              }"
              @click="changeLayout(index - 1)"
            >
              <!--<span>宽度375像素</span>-->
              <img
                v-show="activeComponent.componentContent.imgData[index - 1].src"
                class="img"
                :src="activeComponent.componentContent.imgData[index - 1].src"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <dl class="densityList">
            <dt>密度</dt>
            <dd>
              <el-select
                v-model="activeComponent.componentContent.density"
                placeholder=""
                @change="densityChange"
              >
                <el-option label="4*4" value="4" />
                <el-option label="5*5" value="5" />
                <el-option label="6*6" value="6" />
                <el-option label="7*7" value="7" />
                <el-option label="10*10" value="10" />
              </el-select>
            </dd>
          </dl>
          <div class="textTit">布局</div>
          <p>移动鼠标选定布局区域大小</p>
          <div class="averageBoxWarp">
            <div class="averageBox" @mouseleave="averageBoxLeave">
              <ul
                v-for="i of parseInt(activeComponent.componentContent.density)"
                :key="'y' + i"
                :class="'col' + activeComponent.componentContent.density"
              >
                <li
                  v-for="j of parseInt(
                    activeComponent.componentContent.density
                  )"
                  :key="'x' + j"
                  :class="{
                    on: activeComponent.componentContent.averageBoxData[i - 1][
                      j - 1
                    ].hover,
                  }"
                  @click="averageBoxClick(i - 1, j - 1)"
                  @mouseover="averageBoxMouseover(i - 1, j - 1)"
                />
              </ul>
            </div>
            <div class="selectedCube">
              <ul>
                <li
                  v-for="(item, index) of activeComponent.componentContent
                    .imgData"
                  :key="index"
                  :class="{
                    active:
                      activeComponent.componentContent.imgBoxActive === index,
                  }"
                  :style="{
                    width: getItemValue(item.width) + '%',
                    height: getItemValue(item.height) + '%',
                    left: getItemValue(item.left) + '%',
                    top: getItemValue(item.top) + '%',
                  }"
                >
                  <div class="box" @click="changeLayout(index)">
                    <span>
                      {{ parseInt(getItemValue(item.width) * 12) }}x{{
                        parseInt(getItemValue(item.height) * 12)
                      }}
                    </span>
                    <img
                      v-if="activeComponent.componentContent.imgData[index].src"
                      class="img"
                      :src="activeComponent.componentContent.imgData[index].src"
                    />
                  </div>
                  <a
                    class="btn-close"
                    @click="delSelectedCube(item, index)"
                  ><i class="icon iconfont icon-close" /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="activeComponent.componentContent.imgData.length !== 0">
<!--          <div class="addImgTit">请添加图片</div>-->
          <div class="addImgBox">
            <div class="addImgBoxInner">
              <div class="addImg">
                <el-upload
                  drag
                  :headers="headers"
                  :action="fileUploadApi.fileUpload"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :show-file-list="false"
                >
                  <img v-if="activeComponent.componentContent.imgData[
                        activeComponent.componentContent.imgBoxActive
                      ].src" :src="activeComponent.componentContent.imgData[
                        activeComponent.componentContent.imgBoxActive
                      ].src" class="single-img__img" />
                  <div v-else>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                      <em>选择图片</em>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="addLink">
                <tool-select-link
                  v-model:linkObj="
                    activeComponent.componentContent.imgData[
                      activeComponent.componentContent.imgBoxActive
                    ].linkObj
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BgSelect :hasComBgColor="false" />
  </div>
</template>

<script setup>
import {toRefs, reactive, computed, onMounted, ref} from 'vue';
import { UploadFilled} from '@element-plus/icons-vue'
import ToolSelectLink from '../toolModule/tool-select-link.vue'
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import {getAccessToken, getTenantId} from "@/utils/auth";
import api from '@/components/canvas/components/canvasShow/config/api'
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { terminal, activeComponent } = storeToRefs(canvasStoreObj);
const headers = ref({
  Authorization: 'Bearer ' + getAccessToken(),
  'tenant-id': getTenantId()
})

const data = reactive({
  title: '', // 标题内容
  // imgClearance: 0, // 图片间隙
  // pageSpacing: 0, // 页面间距
  imgBoxActive: 0,
  imageUrl: '', // 图片地址
  linkValue: '', // 链接地址
  linkOptions: [
    {
      value: '/index',
      label: '首页',
    },
    {
      value: '/list',
      label: '列表页',
    },
    {
      value: '/detail',
      label: '详情页',
    },
    {
      value: '/about',
      label: '关于我们',
    },
  ],
  layoutList: [
    {
      id: 0,
      type: 'L1',
      name: '单图',
      number: 1, // 显示格子数
      Icon: '&#xe607;',
    },
    {
      id: 1,
      type: 'L2',
      name: '一行二个',
      number: 2, // 显示格子数
      Icon: '&#xe643;',
    },
    {
      id: 2,
      type: 'L3',
      name: '一行三个',
      number: 3,
      Icon: '&#xe644;',
    },
    {
      id: 3,
      type: 'L4',
      name: '一行四个',
      number: 4,
      Icon: '&#xe645;',
    },
    {
      id: 4,
      type: 'T2B2',
      name: '二左二右',
      number: 4,
      Icon: '&#xe647;',
    },
    {
      id: 5,
      type: 'L1R2',
      name: '一左二右',
      number: 3,
      Icon: '&#xe646;',
    },
    {
      id: 6,
      type: 'T1B2',
      name: '一上二下',
      number: 3,
      Icon: '&#xe648;',
    },
    {
      id: 7,
      type: 'L1T1B2',
      name: '一左三右',
      number: 4,
      Icon: '&#xe646;',
    },
    {
      id: 8,
      type: 'average',
      name: '自定义',
      number: 0,
      Icon: '&#xe642;',
    },
  ],
  activeLay: 0,
  elementNum: 2, // 生成格子数量
  // layoutType: 'L2',
  // density: '4',
  // averageBoxData: [], // 记录格子的激活状态
  beginAverageBox: [], // 记录开始点击的格子
  endAverageBox: [], // 记录结束点击的格子
  imgData: [], // 图片数据
  fileUploadApi: {
    fileUpload: '',
  },
})

const selectTemplateName = computed(() => {
  let name = ''
  for (let i = 0; i < data.layoutList.length; i++) {
    if (
      data.layoutList[i].type ===
        activeComponent.value.componentContent.layoutType
    ) {
      name = data.layoutList[i].name
      break
    } else {
      name = ''
      break
    }
  }
  return name
})

// 初始化
onMounted(() => {
  data.fileUploadApi = api
})

// 图片上传成功回调
function handleAvatarSuccess (res) {
  activeComponent.value.componentContent.imgData[
    activeComponent.value.componentContent.imgBoxActive
  ].src = res.data
}
// 图片上传先回调
function beforeAvatarUpload (file) {
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isLt1M) {
    data.$message.error('上传图片大小不能超过 1MB!')
  }
  return isLt1M
}
// 计算生成格子百分比
function getItemValue (val) {
  const density = parseInt(activeComponent.value.componentContent.density)
  if (val === 0 || density === 0) {
    return 0
  }
  return ((val / density) * 10000) / 100.0 // 小数点后两位百分比
}
// 选择布局
function selectLayout (item, index) {
  activeComponent.value.componentContent.imgBoxActive = 0
  activeComponent.value.componentContent.maxH = 0
  data.activeLay = index
  activeComponent.value.componentContent.elementNum = item.number
  activeComponent.value.componentContent.layoutType = item.type
  if (item.type === 'average') {
    densityChange(activeComponent.value.componentContent.density)
  } else {
    activeComponent.value.componentContent.imgData = []
    const obj = {
      src: '',
      linkObj: {
        selectValue: '',
        selectName: '',
        typeText: '',
        url: '',
      },
    }
    for (let i = 0; i < item.number; i++) {
      activeComponent.value.componentContent.imgData.push(
        JSON.parse(JSON.stringify(obj))
      )
    }
  }
}
// 选择格子
function changeLayout (index) {
  activeComponent.value.componentContent.imgBoxActive = index
}
// 切换密度
function densityChange (val) {
  activeComponent.value.componentContent.imgBoxActive = 0
  const densityVal = parseInt(val)
  activeComponent.value.componentContent.averageBoxData = []
  for (let i = 0; i < densityVal; i++) {
    activeComponent.value.componentContent.averageBoxData[i] = []
    for (let j = 0; j < densityVal; j++) {
      activeComponent.value.componentContent.averageBoxData[i].push({
        hover: false, // 判断经过激活的位置
        takeUp: false, // 判断占击占用的位置
      })
    }
  }
  activeComponent.value.componentContent.maxH = 0
  activeComponent.value.componentContent.imgData = []
}
// 自定义格子点击
function averageBoxClick (x, y) {
  if (data.beginAverageBox.length === 0) {
    data.beginAverageBox = [x, y]
    data.endAverageBox = [x, y]
    activeComponent.value.componentContent.averageBoxData[x][y].hover = true
    activeComponent.value.componentContent.averageBoxData =
        activeComponent.value.componentContent.averageBoxData.concat([]) // 触发视图更新
  } else {
    const bx = data.beginAverageBox[0] // 起点X
    const by = data.beginAverageBox[1] // 起点Y
    // 使用最后一次合理经过的位置
    x = data.endAverageBox[0]
    y = data.endAverageBox[1]
    // 计算占用位置
    if (x >= bx) {
      for (let i = bx; i <= x; i++) {
        if (y >= by) {
          for (let j = by; j <= y; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].takeUp = true
          }
        } else {
          for (let j = y; j <= by; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].takeUp = true
          }
        }
      }
    } else {
      for (let i = x; i <= bx; i++) {
        if (y >= by) {
          for (let j = by; j <= y; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].takeUp = true
          }
        } else {
          for (let j = y; j <= by; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].takeUp = true
          }
        }
      }
    }

    // 生成图片框
    var obj = {
      src: '',
      linkObj: {
        selectValue: '',
        selectName: '',
        typeText: '',
        url: '',
      },
    }
    if (x >= bx) {
      obj.width = x - bx + 1
      obj.left = bx
    } else {
      obj.width = bx - x + 1
      obj.left = x
    }
    const maxH = activeComponent.value.componentContent.maxH
    if (y >= by) {
      obj.height = y - by + 1
      obj.top = by
      if (y + 1 > maxH) {
        activeComponent.value.componentContent.maxH = y + 1
      }
    } else {
      obj.height = by - y + 1
      obj.top = y
      if (by + 1 > maxH) {
        activeComponent.value.componentContent.maxH = by + 1
      }
    }
    activeComponent.value.componentContent.imgData.push(
      JSON.parse(JSON.stringify(obj))
    )
    data.beginAverageBox = []
  }
}
// 自定义格子经过
function averageBoxMouseover (x, y) {
  if (data.beginAverageBox.length !== 0) {
    // 计算有没有经过有占用的位置
    const flag = isBoxTakeUp(x, y)
    if (!flag) {
      return false
    }
    // 每次经过洗白格子
    const bx = data.beginAverageBox[0] // 起点X
    const by = data.beginAverageBox[1] // 起点Y
    const densityVal = parseInt(
      activeComponent.value.componentContent.density
    )
    for (let i = 0; i < densityVal; i++) {
      for (let j = 0; j < densityVal; j++) {
        activeComponent.value.componentContent.averageBoxData[i][
          j
        ].hover = false
      }
    }
    activeComponent.value.componentContent.averageBoxData[x][y].hover = true
    // 起终点中间位置激活
    if (x >= bx) {
      for (let i = bx; i <= x; i++) {
        if (y >= by) {
          for (let j = by; j <= y; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].hover = true
          }
        } else {
          for (let j = y; j <= by; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].hover = true
          }
        }
      }
    } else {
      for (let i = x; i <= bx; i++) {
        if (y >= by) {
          for (let j = by; j <= y; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].hover = true
          }
        } else {
          for (let j = y; j <= by; j++) {
            activeComponent.value.componentContent.averageBoxData[i][
              j
            ].hover = true
          }
        }
      }
    }
    data.endAverageBox = [x, y] // 记录结束位置
    activeComponent.value.componentContent.averageBoxData =
        activeComponent.value.componentContent.averageBoxData.concat([]) // 触发视图更新
  }
}
// 计算有没有经过有占用的位置
function isBoxTakeUp (x, y) {
  if (data.beginAverageBox.length !== 0) {
    const bx = data.beginAverageBox[0] // 起点X
    const by = data.beginAverageBox[1] // 起点Y
    let flag = true
    if (x >= bx) {
      for (let i = bx; i <= x; i++) {
        if (y >= by) {
          for (let j = by; j <= y; j++) {
            if (
              activeComponent.value.componentContent.averageBoxData[i][j]
                .takeUp
            ) {
              flag = false
              break
            }
          }
        } else {
          for (let j = y; j <= by; j++) {
            if (
              activeComponent.value.componentContent.averageBoxData[i][j]
                .takeUp
            ) {
              flag = false
              break
            }
          }
        }
      }
    } else {
      for (let i = x; i <= bx; i++) {
        if (y >= by) {
          for (let j = by; j <= y; j++) {
            if (
              activeComponent.value.componentContent.averageBoxData[i][j]
                .takeUp
            ) {
              flag = false
              break
            }
          }
        } else {
          for (let j = y; j <= by; j++) {
            if (
              activeComponent.value.componentContent.averageBoxData[i][j]
                .takeUp
            ) {
              flag = false
              break
            }
          }
        }
      }
    }
    return flag
  }
}
// 移出盒子清空
function averageBoxLeave () {
  data.beginAverageBox = []
  data.endAverageBox = []
  const densityVal = parseInt(activeComponent.value.componentContent.density)
  for (let i = 0; i < densityVal; i++) {
    for (let j = 0; j < densityVal; j++) {
      activeComponent.value.componentContent.averageBoxData[i][
        j
      ].hover = false
    }
  }
}
// 删除选中格子
function delSelectedCube (item, index) {
  // 清除占用位置
  const bx = item.left
  const by = item.top
  const xl = item.width
  const yl = item.height
  for (let i = bx; i < bx + xl; i++) {
    for (let j = by; j < by + yl; j++) {
      activeComponent.value.componentContent.averageBoxData[i][
        j
      ].takeUp = false
    }
  }
  activeComponent.value.componentContent.imgBoxActive = 0
  activeComponent.value.componentContent.imgData.splice(index, 1)
  // 重新计算最大高度
  const imgData = activeComponent.value.componentContent.imgData
  let maxH = 0
  for (let i = 0; i < imgData.length; i++) {
    if (imgData[i].top + imgData[i].height > maxH) {
      maxH = imgData[i].top + imgData[i].height
    }
  }
  activeComponent.value.componentContent.maxH = maxH
}

const { layoutList, fileUploadApi } = toRefs(data)
</script>

<style lang="scss" scoped>
.customTool {
  padding: 20px 20px 0 20px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .toolBox {
    .selectLayTit {
      margin-bottom: 20px;
      font-size: 14px;
      color: #333333;
      span {
        font-size: 14px;
        color: var(--el-color-primary);
        margin-left: 20px;
      }
    }
    .layoutList {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 30px;
      span {
        margin: -1px 0 0 -1px;
        flex: 0 0 15.9%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e8eaec;
        color: #999999;
        font-size: 18px;
        text-align: center;
        height: 28px;
        cursor: pointer;
        position: relative;
        &.active,
        &:hover {
          color: var(--el-color-primary);
          &:after {
            content: '';
            width: 100%;
            height: 100%;
            border: 1px solid var(--el-color-primary);
            position: absolute;
            left: 0;
            top: 0;
            z-index: 2;
          }
        }
      }
    }
    padding-bottom: 10px;
    :deep(.flexStyle) {
      display: flex;
      label {
        margin-right: 20px;
      }
      .block {
        flex: 1;
      }
      .el-slider__input {
        width: 50px;
      }
      .el-slider__runway {
        height: 4px;
        margin: 18px 15px 18px 0;
      }
      .el-slider__bar {
        height: 4px;
      }
      .el-slider__button-wrapper {
        top: -17px;
      }
      .el-slider__button {
        width: 12px;
        height: 12px;
      }
      .el-input-number.is-without-controls .el-input__wrapper{
        padding: 0;
      }
    }
    .itemBox {
      width: 100%;
      label {
        font-size: 14px;
        color: #666666;
        height: 32px;
        line-height: 32px;
      }
      margin-bottom: 15px;
      p {
        font-size: 12px;
        color: #666666;
      }
      .layoutBox {
        margin-top: 20px;
        display: flex;
        .item {
          margin: -1px 0 0 -1px;
          flex: 0 0 50%;
          height: 142px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          z-index: 1;
          &:before {
            content: '600像素';
            font-size: 12px;
            color: #666666;
            padding: 0 10px;
            text-align: center;
          }
          &:after {
              content: '';
              width: 100%;
              height: 100%;
              border: 1px solid #e8eaec;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 2;
          }
          .img {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            object-fit: contain;
          }
          &.active {
            background: #fbf9f8;
            z-index: 3;
            &:before {
              color: var(--el-color-primary);
            }
            &:after {
              border: 1px solid var(--el-color-primary);
              z-index: 3;
            }
          }
        }
      }
      .L1 {
        .item {
          flex: 0 0 100%;
          height: 93px;
          &:before {
            content: '1200像素';
          }
        }
      }
      .L3 {
        .item {
          flex: 0 0 33.3%;
          height: 93px;
          &:before {
            content: '400像素';
          }
        }
      }
      .L4 {
        .item {
          flex: 0 0 25%;
          height: 71px;
          &:before {
            content: '300像素';
          }
        }
      }
      .T2B2 {
        flex-wrap: wrap;
        .item {
          flex: 0 0 50%;
          height: 142px;
          &:before {
            content: '600x600像素';
          }
        }
      }
      .L1R2 {
        flex-wrap: wrap;
        .item {
          &:before {
            content: '600x600像素';
          }
        }
        .item:nth-child(1) {
          height: 284px;
          &:before {
            content: '600x1200像素';
          }
        }
        .item:nth-child(3) {
          margin-left: 131px;
          margin-top: -143px;
        }
      }
      .T1B2 {
        flex-wrap: wrap;
        .item {
          &:before {
            content: '600x600像素';
          }
        }
        .item:nth-child(1) {
          flex: 0 0 100%;
          &:before {
            content: '1200x600像素';
          }
        }
      }
      .L1T1B2 {
        flex-wrap: wrap;
        .item {
          &:before {
            content: '300x300像素';
          }
        }
        .item:nth-child(1) {
          &:before {
            content: '600x600像素';
          }
        }
        .item:nth-child(2) {
          height: 72px;
          &:before {
            content: '600x300像素';
          }
        }
        .item:nth-child(3) {
          flex: 0 0 25%;
          height: 72px;
          margin: -71px 0 0 130.5px;
        }
        .item:nth-child(4) {
          margin-top: -71px;
          flex: 0 0 25%;
          height: 72px;
        }
      }
      .average {
        flex-wrap: wrap;
        .item {
          flex: 0 0 33.33%;
          height: 93px;
        }
      }

      .addImgBox {
        margin-top: 30px;
        .addImg {
          :deep(.el-upload-dragger) {
            width: 100%;
            height: 264px;
            padding: 0;
            text-align: center;
            .el-icon--upload{
              margin-top: 60px;
            }
            .el-upload__text {
              line-height: 40px;
            }
            .el-upload__tip {
              line-height: 1em;
            }

            .single-img__img {
              position: absolute;
              max-width: 100%;
              height: 100%;
              max-height: 100%;
              margin: auto;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
            }
          }
        }
      }
      .averageBoxWarp {
        position: relative;
      }
      .averageBox {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        ul {
          li {
            margin: -1px 0 0 -1px;
            border: 1px solid #e8eaec;
            background-color: #f8f8f8;
            &.on {
              background-color: #fbbe73;
            }
          }
          &.col4 {
            flex: 0 0 25%;
            li {
              height: 70px;
            }
          }
          &.col5 {
            flex: 0 0 20%;
            li {
              height: 56px;
            }
          }
          &.col6 {
            flex: 0 0 16.6%;
            li {
              height: 46px;
            }
          }
          &.col7 {
            flex: 0 0 14.2%;
            li {
              height: 40px;
            }
          }
          &.col10 {
            flex: 0 0 10%;
            li {
              height: 29px;
            }
          }
        }
      }
      .selectedCube {
        li {
          position: absolute;
          font-size: 12px;
          border: 1px solid #e8eaec;
          background-color: #fff;
          z-index: 2;
          margin: -1px 0 0 -1px;
          box-sizing: content-box;
          .box {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
          .img {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            object-fit: contain;
          }
          .btn-close {
            position: absolute;
            top: -10px;
            right: -10px;
            z-index: 4;
            cursor: pointer;
            opacity: 0.6;
            font-size: 20px;
            display: none;
          }
          &.active {
            z-index: 3;
            background: #fbf9f8;
            &:hover {
              .btn-close {
                display: block;
              }
            }
            span {
              color: var(--el-color-primary);
            }
            &:after {
              content: '';
              width: 100%;
              height: 100%;
              border: 1px solid var(--el-color-primary);
              position: absolute;
              left: 0;
              top: 0;
              z-index: 2;
            }
          }
        }
      }
    }
    .textTit {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #333333;
      margin-top: 30px;
      font-weight: bold;
    }
  }
  .densityList {
    display: flex;
    justify-content: space-between;
    dt {
      line-height: 40px;
    }
  }
}

.terminal1,
.terminal2,
.terminal3 {
  &.customTool {
    .toolBox {
      .itemBox {
        .layoutBox {
          .item {
            &:before {
              content: '360像素';
            }
          }
        }
        .L1 {
          .item {
            &:before {
              content: '720像素';
            }
          }
        }
        .L3 {
          .item {
            &:before {
              content: '240像素';
            }
          }
        }
        .L4 {
          .item {
            &:before {
              content: '180像素';
            }
          }
        }
        .T2B2 {
          .item {
            &:before {
              content: '360x360像素';
            }
          }
        }
        .L1R2 {
          .item {
            &:before {
              content: '360x360像素';
            }
          }
          .item:nth-child(1) {
            &:before {
              content: '360x720像素';
            }
          }
        }
        .T1B2 {
          .item {
            &:before {
              content: '360x360像素';
            }
          }
          .item:nth-child(1) {
            &:before {
              content: '720x360像素';
            }
          }
        }
        .L1T1B2 {
          .item {
            &:before {
              content: '180x180像素';
            }
          }
          .item:nth-child(1) {
            &:before {
              content: '360x360像素';
            }
          }
          .item:nth-child(2) {
            &:before {
              content: '360x180像素';
            }
          }
        }
      }
    }
  }
}
</style>
