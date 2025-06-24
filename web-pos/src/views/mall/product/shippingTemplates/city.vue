<template>
  <el-dialog
:close-on-click-modal="false"
              v-model="addressView"
             append-to-body
             class="modal"
             title="选择城市" width="950px">
    <el-row :gutter="24" type="flex">
      <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" class="item">
        <div class="acea-row row-right row-middle">
          <el-checkbox v-model="iSselect" @change="allCheckbox">全选</el-checkbox>
          <div class="empty" @click="empty">清空</div>
        </div>
      </el-col>
    </el-row>
    <el-row  :gutter="24"  :loading="loading" >
      <el-col  :xl="6" :lg="6" :md="6" :sm="8" :xs="6" class="item"  v-for="(item,index) in cityList" :key="index">

        <div @mouseenter="enter(index)" @mouseleave="leave()">
          <el-checkbox v-model="item.checked" :label="item.name" @change="checkedClick(index)">{{item.name}}</el-checkbox>
          <span class="red">({{(item.count || 0) + '/' + item.children.length}})</span>
          <div class="city" v-show="activeCity===index">
            <div class="checkBox">
              <div class="arrow"></div>
              <div>
                <el-checkbox
v-model="city.checked" :label="city.name" @change="primary(index,indexn)"
                class="itemn" v-for="(city,indexn) in item.children"
                :key="indexn">{{city.name}}</el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <div>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as AreaApi from '@/api/system/area'
const message = useMessage() // 消息弹窗

const props = defineProps({
  type: {
    type: String
  }
})
// const type = ref(props.type)
const iSselect = ref(false)
const addressView = ref(false)
const cityList = ref([])
const activeCity = ref(-1)
const loading = ref(false)

const enter = (index) => {
  activeCity.value = index
}
const leave = () => {
  activeCity.value = null;
}

const getCityList = () => {
  addressView.value = true
  loading.value = true
  AreaApi.getAreaTree().then(res => {
    loading.value = false;
    cityList.value = res;
  })
}
defineExpose({ getCityList })

/**
 * 全选或者反选
 * @param checked
 */
const allCheckbox =  () => {
  let checked = iSselect.value;
  cityList.value.forEach(function (item, key) {
    cityList.value[key]['checked'] = checked
    if (checked) {
      cityList.value[key]['count'] = cityList.value[key].children.length
    } else {
      cityList.value[key]['count'] = 0
    }
    cityList.value[key].children.forEach(function (val, k) {
      console.log(k)
      cityList.value[key].children[k]['checked'] = checked
    })
  });
}

// 清空；
const empty = () => {
  cityList.value.forEach(function (item, key) {
    cityList.value[key]['checked'] = false
    cityList.value[key].children.forEach(function (val, k) {
      console.log(k)
      cityList.value[key].children[k]['checked'] = false
    });
    cityList.value[key]['count'] = 0
  });
  iSselect.value = false;
}
/**
 * 点击省
 * @param index
 */
const checkedClick = (index) => {
  //let that = this;
  if (cityList.value[index].checked) {
    cityList.value[index]['count'] = cityList.value[index].children.length
    cityList.value[index].children.forEach(function (item, key) {
      cityList.value[index].children[key]['checked'] = true
    });
  } else {
    cityList.value[index]['count'] = 0
    cityList.value[index]['checked'] = false
    cityList.value[index].children.forEach(function (item, key) {
      cityList.value[index].children[key]['checked'] = false
    });
    iSselect.value = false
  }
}
/**
 * 点击市区
 * @param index
 * @param ind
 */
const primary =  (index, ind) => {
  let checked = false, count = 0;
  cityList.value[index].children.forEach(function (item, key) {
 
    if (item.checked) {
         console.log(ind)
     console.log(key)
      checked = true;
      count++;
    }
  });
  cityList.value[index]['count'] = count
  cityList.value[index]['checked'] = checked
  console.log('cityList:',cityList.value)
}

const emit = defineEmits(['selectCity']) // 定义 success 事件，用于操作成功后的回调
// 确定;
const confirm = () => {
  // 被选中的省市；
  let selectList = [];
  cityList.value.forEach(function (item, key) {
    let data = {};
    if (item.checked) {
      data = {
        name: item.name,
        city_id: item.id,
        children: []
      };

    }
    cityList.value[key].children.forEach(function (i, k) {
      console.log(k)
      if (i.checked) {
        data.children.push({
          city_id: i.id
        })
      }
    });
    if (data.city_id !== undefined) {
      selectList.push(data);
    }
  });
  console.log(selectList);
  if (selectList.length === 0) {
    message.error('至少选择一个省份或者城市')
  } else {
    emit('selectCity',selectList, props.type)
    addressView.value = false;
    cityList.value = []
  }
}
const close = () => {
  addressView.value = false
  cityList.value = []
}


</script>

<style scoped>
.acea-row {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-lines: multiple;
    -moz-box-lines: multiple;
    -o-box-lines: multiple;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    /* 辅助类 */
}
.acea-row.row-right {
    -webkit-box-pack: end;
    -moz-box-pack: end;
    -o-box-pack: end;
    -ms-flex-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
}
.acea-row.row-middle {
    -webkit-box-align: center;
    -moz-box-align: center;
    -o-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
}

  .modal .item {
    position: relative;
    margin-bottom: 20px;
  }

  .modal .item .city {
    position: absolute;
    z-index: 9;
    top: 17px;
    width: 100%;
    padding-top: 18px;
  }

  .modal .item .city .checkBox {
    width: 97%;
    padding: 10px;
    border: 1px solid #eee;
    background-color: #fff;
    max-height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .modal .item .city .checkBox .arrow {
    position: absolute;
    top: 3px;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-bottom-color: #ddd;
  }

  .modal .item .city .checkBox .arrow:before {
    position: absolute;
    bottom: -8px;
    right: -7px;
    content: "";
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-bottom-color: #fff;
  }

  .modal .item .city .checkBox .itemn {
    margin-bottom: 10px;
  }

  .radio {
    padding: 5px 0;
    font-size: 14px !important;
  }

  .red {
    color: #ff0000;
  }

  .empty {
    cursor: pointer;
    margin-left:10px
  }
</style>
