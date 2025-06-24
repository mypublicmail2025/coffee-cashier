<template>
  <div class="brandListTool">
    <h3 class="toolTit">拼团专区</h3>
    <div v-if="terminal == 4" class="styleSelectLine">
      <div class="blockTit">
        <span>排列样式</span>
        <span>{{ activeComponent.componentContent.arrangeType }}</span>
      </div>
      <div class="selectCompose">
        <div class="composeList">
          <span
            v-for="item of arrangeList"
            :key="item.id"
            class="item iconfont"
            :class="{
              active:
                activeComponent.componentContent.arrangeType === item.name,
            }"
            @click="selectArrange(item)"
            v-html="item.Icon"
          />
        </div>
      </div>
    </div>

    <div class="itemChoice">
      <div class="Tit">查看更多</div>
      <div
        class="Info"
        v-text="activeComponent.componentContent.showMore ? '显示' : '隐藏'"
      />
      <div class="modifyBox">
        <el-checkbox
          v-model="activeComponent.componentContent.showMore"
        />
      </div>
    </div>
    <el-dialog v-model="showSkillActivity" title="选择活动" width="900px">
      <el-table
        :data="skillActivity"
        style="width: 100%"
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column label width="35">
          <template #default="scope">
            <el-radio v-model="radioId" :label="scope.row.id" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标题" />
        <el-table-column :formatter="getDate" width="400" label="开始时间" />
        <el-table-column prop="state" label="状态" :formatter="getState" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelSkill">取 消</el-button>
          <el-button type="primary" @click="confirmActivity">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <BgSelect :hasComBgColor="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { canvasStore } from '@/components/canvas/store/canvas';
import { parseTime } from '@/components/canvas/config/common';
import BgSelect from "@/components/canvas/components/toolBar/toolModule/bg-select.vue";
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent, terminal } = storeToRefs(canvasStoreObj);
const { setGroupNum } = canvasStoreObj

const radioId = ref('')
const skillActivity = ref([])
const selectSkill = ref({})
const showSkillActivity = ref(false)
const arrangeList = ref([
  // {
  //   id: 1,
  //   type: 'L1',
  //   name: '一行一个',
  //   Icon: '&#xe603'
  // },
  {
    id: 2,
    type: 'L2',
    name: '多行多列',
    Icon: '&#xe625',
  },
  {
    id: 3,
    type: 'L3',
    name: '横向滑动',
    Icon: '&#xe624;',
  }
])

// 时间变换
function getDate (row) {
  return `${parseTime(row.startTime)}至${parseTime(row.endTime)}`
}
// 状态变换
function getState (row) {
  const opt = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '预热中',
  }
  return opt[row.state]
}
// 行点击
function rowClick (row) {
  selectSkill.value = row
  radioId.value = row.shopGroupWorkId
}
// 确认活动选择
function confirmActivity () {
  activeComponent.value.componentContent.id =
        selectSkill.value.id
  activeComponent.value.componentContent.name =
        selectSkill.value.name
  showSkillActivity.value = false
  setGroupNum() // 通知画布刷新
}
// 取消活动选择
function cancelSkill () {
  showSkillActivity.value = false
  radioId.value = ''
}
// 布局选择
function selectArrange (item) {
  activeComponent.value.componentContent.arrangeType = item.name
}

</script>

<style lang="scss" scoped>
.config-content {
  .item {
    padding: 12px 0;
    border-bottom: 1px #ddd solid;
    &:nth-child(1) {
      border-top: 1px #ddd solid;
    }
  }
  .label-text {
    color: #666;
    span {
      color: hsl(357, 97%, 49%);
      font-size: 20px;
      vertical-align: middle;
      display: inline-block;
      margin-right: 5px;
    }
  }

  .add {
    margin-top: 10px;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px #ddd solid;
    box-shadow: 0 0 10px #ddd;
    .el-icon-plus {
      color: blue !important;
    }
    &:hover {
      cursor: pointer;
    }
  }
}

.brandListTool {
  padding: 20px 20px 0px 20px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .toolBox {
    padding-bottom: 10px;
    .itemBox {
      label {
        font-size: 14px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      margin-bottom: 15px;
    }
    .textTit {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #333333;
      display: flex;
      justify-content: space-between;
      span {
        font-weight: normal;
        font-size: 14px;
        color: #666666;
      }
    }
    .productTit {
      margin-top: 20px;
      color: #666666;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 14px;
        color: #666666;
      }
    }
  }
  .itemChoice {
    font-size: 14px;
    display: flex;
    margin: 20px 0;
    align-items: center;
    .Tit {
      color: #888888;
      margin-right: 10px;
      width: 70px;
    }
    .Info {
      color: #222222;
    }
    .modifyBox {
      text-align: right;
      margin-left: auto;
      span {
        height: 26px;
        line-height: 26px;
        float: left;
        display: block;
        text-align: center;
        cursor: pointer;
        width: 30px;
        border: 1px solid #e8eaec;
      }
      .textActive {
        border: 1px solid var(--el-color-primary);
        color: var(--el-color-primary);
      }
      .colorBox {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        span {
          margin-right: 10px;
          cursor: pointer;
          border: none;
          color: var(--el-color-primary);
        }
      }
    }
    .fontSize {
      span:nth-child(1) {
        font-size: 16px;
      }
      span:nth-child(2) {
        font-size: 14px;
      }
      span:nth-child(3) {
        font-size: 12px;
      }
    }
  }
  .moreBox {
    border: 1px solid #e8eaec;
    border-radius: 4px;
    padding: 20px 10px;
    .radio {
      margin-bottom: 20px;
    }
    .el-radio {
      margin-right: 10px;
    }
    .link {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .addImgBtn {
    border-radius: 4px;
    background: var(--el-color-primary);
    text-align: center;
    height: 36px;
    color: #ffffff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    span {
      font-size: 20px;
      margin-right: 5px;
    }
  }
  .labelLisTit {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .labelListWarp {
    padding-bottom: 20px;
    .imgListBox {
      margin-top: 20px;
      .item {
        border: 1px solid #e8eaec;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      .listItemBox {
        .addImgTit {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f6f7f9;
          cursor: pointer;
          .titLeft {
            display: flex;
            align-items: center;
            span {
              color: #7d7e80;
            }
            span:nth-child(1) {
              font-size: 28px;
            }
            span:nth-child(2) {
              font-size: 25px;
              margin: 0 6px;
            }
            span:nth-child(3) {
              font-size: 14px;
            }
          }
          .titRight {
            display: flex;
            align-items: center;
            span:nth-child(1) {
              width: 40px;
              text-align: center;
              display: block;
              height: 30px;
              line-height: 30px;
            }
          }
        }
        .addLabelBox {
          padding: 0 10px 10px;
          .itemBox {
            margin-bottom: 20px;
            label {
              font-size: 14px;
              color: #666666;
              height: 40px;
              line-height: 40px;
            }
          }
          :deep(.module-box) {
            margin-bottom: 10px;
          }
        }
        .deleteItem {
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f7f9;
          cursor: pointer;
          color: var(--el-color-primary);
          font-size: 14px;
          span {
            font-size: 16px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}

.styleSelectLine {
  margin-top: 30px;
  .blockTit {
    span {
      margin-right: 16px;
      &:last-child {
        color: var(--el-color-primary);
      }
    }
  }
  .composeList {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    .item {
      width: 50px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e8eaec;
      color: #999999;
      font-size: 18px;
      text-align: center;
      cursor: pointer;
      &:hover,
      &.active {
        color: var(--el-color-primary);
        border: 1px solid var(--el-color-primary);
      }
    }
  }
}

.porListBox {
  margin-top: 10px;
  padding: 10px;
  background: #f0f3f4;
  .addProduct {
    .categoryName {
      height: 35px;
      display: flex;
      align-items: center;
      background: #e9e9e9;
      border-radius: 4px;
      padding: 0 10px;
      justify-content: space-between;
      span {
        color: #333333;
      }
      span {
        color: #333333;
      }
      .operation {
        display: flex;
        span {
          width: 35px;
          display: block;
          height: 35px;
          line-height: 35px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
