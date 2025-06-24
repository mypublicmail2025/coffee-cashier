<template>
  <div>
    <ul
      v-for="(item, index) in value"
      :key="index"
      class="el-upload-list el-upload-list--picture-card"
    >
      <li
        tabindex="0"
        class="el-upload-list__item is-ready"
        :style="'width: ' + width + 'px;height: ' + height + 'px'"
      >
        <div>
          <el-image
            class="image"
            :src="item"
            fit="contain"
            :z-index="9999"
          >
            <template #error>
              <div class="image-slot">
                <Icon class="icon" icon="fa:play-circle" :size="60" color="#409eff"/>
              </div>
            </template>
          </el-image>
          <span class="el-upload-list__item-actions">
            <span
              v-if="index != 0"
              class="el-upload-list__item-preview"
              @click="moveMaterial(index, 'up')"
            >
            <Icon icon="ep:back" />
            </span>
            <span class="el-upload-list__item-preview" @click="zoomMaterial(index)">
              <i class="el-icon-view"></i>
              <Icon icon="ep:view" />
            </span>
            <span class="el-upload-list__item-delete" @click="deleteMaterial(index)">
              <Icon icon="ep:delete" />
            </span>
            <span
              v-if="index != value.length - 1"
              class="el-upload-list__item-preview"
              @click="moveMaterial(index, 'down')"
            >
              <Icon icon="ep:right" />
            </span>
          </span>
        </div>
      </li>
    </ul>
    <div
      v-if="num > value.length"
      tabindex="0"
      class="el-upload el-upload--picture-card"
      :style="'width: ' + width + 'px;height: ' + height + 'px;' + 'line-height:' + height + 'px;'"
      @click="toSeleteMaterial">
      <Icon icon="ep:plus" />
    </div>
    <visitForm ref="visitFormRef" />
    <el-dialog title="图片素材库" append-to-body v-model="listDialogVisible" width="70%">
      <MaterialsMain :type="type" ref="materialsMainRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="listDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureUrls">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Materials">
import { ElMessageBox, ElMessage } from 'element-plus'
import MaterialsMain from './MaterialsMain.vue'
import { isImage } from '@/utils'
import { ref,nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  // 素材类型
  type: {
    type: String
  },
  // 素材限制数量，默认5个
  num: {
    type: Number,
    default() {
      return 5
    }
  },
  // 宽度
  width: {
    type: Number,
    default() {
      return 150
    }
  },
  // 宽度
  height: {
    type: Number,
    default() {
      return 150
    }
  }
})


//const value = ref(props.value)
const listDialogVisible = ref(false)
const materialsMainRef = ref()
const visitFormRef = ref()

const value = computed({
  get() {
     if(!props.modelValue || props.modelValue.length == 0){
        return []
    }
    if (Array.isArray(props.modelValue)) {
      return props.modelValue
    }
    return [props.modelValue]

  }
})

// const store = useStore()

function moveMaterial(index, type) {
  if (type == 'up') {
    const tempOption = value.value[index - 1]
    value.value[index - 1] = value.value[index]
    value.value[index] = tempOption
  }
  if (type == 'down') {
    const tempOption = value.value[index + 1]
    value.value[index + 1] = value.value[index]
    value.value[index] = tempOption
  }
}
function zoomMaterial(index) {
  if(isImage(value.value[index])){
    visitFormRef.value.open({
      name: '查看图片',
      url: value.value[index],
      type: 1
    })
  } else {
    visitFormRef.value.open({
      name: '查看视频',
      url: value.value[index],
      type: 2
    })
  }
}

function deleteMaterial(index) {
  // 修改为新的提示
  ElMessageBox.confirm('是否确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    value.value.splice(index, 1)
    emit('update:modelValue', value.value)
  })
}
function toSeleteMaterial() {
  listDialogVisible.value = true
  nextTick(()=>{
    materialsMainRef.value.getMaterialgroupPage()
  })
}

const emit = defineEmits(['update:modelValue'])
function sureUrls() {
  let urls = materialsMainRef.value.urls
  if(urls.length > props.num){
    ElMessage.error(`选择数量不能超过${props.num}张`)
    return false
  }
  urls.forEach((item) => {
    value.value[value.value.length] = item.url
  })
  listDialogVisible.value = false
  if (urls.length > 1 || props.num > 1) {
    emit('update:modelValue', value.value)
  } else {
    emit('update:modelValue', value.value[0])
  }
}
</script>
<style scoped>
.image{
  width: 148px;
  height: 148px;
}
.image-slot{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}
</style>
