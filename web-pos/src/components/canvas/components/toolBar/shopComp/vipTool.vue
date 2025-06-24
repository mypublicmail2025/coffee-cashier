<template>
  <div class="brandListTool">
    <h3 class="toolTit">会员专区</h3>
    <div class="toolBox">
      <!--      <div class="itemBox" v-if="terminal !== 4">-->
      <!--        <label>标题</label>-->
      <!--        <el-input v-model="activeComponent.componentContent.title" placeholder="请输入内容"></el-input>-->
      <!--      </div>-->
      <div v-if="terminal == 4">
        <div class="styleSelectLine">
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
        <div v-if="activeComponent.componentContent.arrangeType === '多行多列'">
          <div class="productTit">
            <span>展示排数</span>
            <span>{{ activeComponent.componentContent.productRowNum }}</span>
          </div>
          <div class="itemBox">
            <div class="block">
              <el-slider
                v-model="activeComponent.componentContent.productRowNum"
                :max="9"
                :min="1"
              />
            </div>
          </div>
          <div class="productTit">
            <span>每排商品数</span>
            <span>{{ activeComponent.componentContent.productNum }}</span>
          </div>
          <div class="itemBox">
            <div class="block">
              <el-slider
                v-model="activeComponent.componentContent.productNum"
                :max="5"
                :min="2"
              />
            </div>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { canvasStore } from '@/components/canvas/store/canvas';
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent, terminal } = storeToRefs(canvasStoreObj);

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

// 布局选择
function selectArrange (item) {
  this.activeComponent.componentContent.arrangeType = item.name
}
</script>

<style lang="scss" scoped>
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
    .tool-select-product {
      .title {
        margin-bottom: 10px;
      }
    }
    padding-bottom: 10px;
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
  // :deep(.el-select) {
  //  width: 100%;
  //}
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
</style>
