<template>
  <div>
    <div class="search-bar">
      <el-tabs v-model="activeType" @tab-change="typeChange" v-if="type === 'all'">
        <el-tab-pane label="图片" :name="1" />
        <el-tab-pane label="视频" :name="2" />
      </el-tabs>
      <div class="search-box">
        <el-form
          class="-mb-15px"
          :model="page"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
          @submit.enter.prevent
        >
          <el-form-item label="文件名称" prop="name">
            <el-input
              v-model="page.name"
              placeholder="请输入文件名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-container>
      <el-aside width="100px">
        <div style="margin-bottom: 10px">
          <el-button v-hasPermi="['product:materials:groupAdd']" class="el-icon-plus" @click="handleMaterialgroupAdd()">
            添加分组
          </el-button>
        </div>
        <el-tabs
          v-model="materialgroupObjId"
          v-loading="materialgroupLoading"
          tab-position="left"
          @tab-click="tabClick"
        >
          <el-tab-pane v-for="item in materialgroupList" :key="item.id" :name="item.id">
            <template #label>
              <span> {{ item.name }}</span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main>
        <el-card>
          <template #header>
            <div>
              <el-row>
                <el-col :span="12">
                  <span>{{ materialgroupObj.name }}</span>
                  <span v-if="materialgroupObj.id != '-1'">
                      <el-button
                        v-hasPermi="['product:materials:groupEdit']"
                        size="small"
                        type="text"
                        class="el-icon-edit"
                        style="margin-left: 10px"
                        @click="handleMaterialgroupEdit(materialgroupObj)"
                      >重命名</el-button
                      >
                      <el-button
                        v-hasPermi="['product:materials:groupDelete']"
                        size="small"
                        type="text"
                        class="el-icon-delete"
                        style="margin-left: 10px; color: red"
                        @click="materialgroupDelete(materialgroupObj)"
                      >删除</el-button>
                    </span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <div class="btn-group">
                    <el-button type="primary" @click="openGroupDialog" v-hasPermi="['product:materials:groupEdit']">批量修改分组</el-button>
<!--                    <el-upload-->
<!--                      :action="uploadApi"-->
<!--                      :headers="headers"-->
<!--                      :on-progress="handleProgress"-->
<!--                      :before-upload="beforeUpload"-->
<!--                      :on-success="handleSuccess"-->
<!--                      :data="{ type: activeType }"-->
<!--                      :show-file-list="false"-->
<!--                      multiple-->
<!--                    >-->
<!--                      <el-button type="primary" v-hasPermi="['product:materials:materialUpload']">素材上传</el-button>-->
<!--                    </el-upload>-->
                    <el-button type="primary" v-hasPermi="['product:materials:materialUpload']" @click="materialAdd">素材上传</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
          <div v-loading="tableLoading">
            <el-alert
              v-if="tableData.length <= 0"
              title="暂无数据"
              type="info"
              :closable="false"
              center
              show-icon
            />
            <el-checkbox-group v-model="urls">
              <el-row :gutter="5">
                <el-col class="img-item" v-for="(item, index) in tableData" :key="index" :span="4">
                  <el-card :body-style="{ padding: '5px' }">
                    <el-image
                      style="width: 100%; height: 100px"
                      :src="item.url"
                      fit="contain"
                      :preview-src-list="[item.url]"
                      :z-index="9999"
                    >
                      <template #error>
                        <div class="image-slot" @click="materialVisit(item)">
                          <Icon class="icon" icon="fa:play-circle" :size="60" color="#409eff"/>
                        </div>
                      </template>
                    </el-image>
                    <div>
                      <el-checkbox class="material-name" :label="item">  {{item.name}} </el-checkbox>
                      <el-row>
                        <el-col :span="8" class="col-do">
                          <el-button type="text" size="medium" @click="materialEdit(item)" v-hasPermi="['product:materials:materialDel']"
                          >编辑</el-button
                          >
                        </el-col>
                        <el-col :span="8" class="col-do">
                          <el-button type="text" size="medium" @click="materialVisit(item)" v-hasPermi="['product:materials:materialDel']"
                          >查看</el-button
                          >
                        </el-col>
                        <el-col :span="8" class="col-do">
                          <el-button type="text" size="medium" @click="materialDel(item)" v-hasPermi="['product:materials:materialDel']"
                          >删除</el-button
                          >
                        </el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-checkbox-group>

            <el-pagination
              v-model:current-page="page.currentPage"
              :page-sizes="[12, 18, 24]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              class="pagination"
              @size-change="sizeChange"
              @current-change="pageChange"
            />
          </div>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog title="批量修改分组" append-to-body v-model="groupVisible" width="300">
      <el-select
        style="width: 100%"
        v-model="materialGroupValue"
        placeholder="请选择分组"
      >
        <el-option
          v-for="item in materialGroupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="groupVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditGroup">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <editForm ref="editFormRef" :materialGroupOptions="materialGroupOptions" @success="getMaterialPage(page)"/>
    <visitForm ref="visitFormRef" />
  </div>
</template>

<script setup name="MaterialsMain">
import editForm from './editForm.vue'
import visitForm from './visitForm.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {
  getList as materialgroupPage,
  addObj as materialgroupAdd,
  delObj as materialgroupDel,
  putObj as materialgroupEdit,
  batchUpdateObj as materialgroupBatchUpdate
} from '@/api/tools/materialgroup'
import { getPage, delObj } from '@/api/tools/material'
// import { getAccessToken } from '@/utils/auth'
import {ref} from "vue";
const props = defineProps({
  pageSize: {
    type: Number,
    default() {
      return 12
    }
  },
  // 素材类型
  type: {
    type: String,
    default: 'all'
  },
})

const { type } = toRefs(props);

const groupVisible = ref(false)
const materialgroupList = ref([])
const materialGroupValue = ref(0)
const materialGroupOptions = ref([])
const materialgroupObjId = ref('')
const materialgroupObj = ref({})
const materialgroupLoading = ref(false)
const tableData = ref([])
const activeType = ref(type.value === 'video'?2:1)
const page = ref({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: props.pageSize, // 每页显示多少条
  ascs: [], // 升序字段
  descs: 'create_time', // 降序字段
  name: ''
})
const tableLoading = ref(false)
const groupId = ref(null)
const urls = ref([])

function handleMaterialgroupAdd() {
  ElMessageBox.prompt('请输入分组名', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(({ value }) => {
      materialgroupAdd({
        name: value,
        type: activeType.value
      }).then(function () {
        getMaterialgroupPage()
      })
    })
    .catch(() => {})
}

function tabClick(tab) {
  urls.value = []
  const index = Number(tab.index)
  materialgroupObj.value = materialgroupList.value[index]

  console.log('🚀 ~ file: Materials.vue:351 ~ tabClick ~ materialgroupObj:', materialgroupObj)

  materialgroupObj.value.index = index
  materialgroupObjId.value = materialgroupObj.value.id

  page.value.currentPage = 1
  page.value.total = 0
  if (materialgroupObj.value.id != '-1') {
    groupId.value = materialgroupObj.value.id
  } else {
    groupId.value = null
  }
  getMaterialPage(page.value)
}

function handleMaterialgroupEdit(materialgroupObj) {
  ElMessageBox.prompt('请输入分组名', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: materialgroupObj.name
  })
    .then(({ value }) => {
      materialgroupEdit({
        id: materialgroupObj.id,
        name: value,
        type: materialgroupObj.type,
      }).then(function () {
        materialgroupObj.name = value
        materialgroupList.value[materialgroupObj.index] = materialgroupObj
      })
    })
    .catch(() => {})
}

function getMaterialPage(initPage) {
  tableLoading.value = true
  getPage(
    Object.assign(
      {
        pageNo: initPage.currentPage,
        pageSize: initPage.pageSize,
        descs: initPage.descs,
        ascs: initPage.ascs,
        sort: 'create_time,desc',
        name:  initPage.name,
        type: activeType.value
      },
      {
        groupId: groupId.value
      }
    )
  )
    .then((response) => {
      console.log('🚀 ~ file: Materials.vue:382 ~ .then ~ response:', response.list)
      console.log('🚀 ~ file: Materials.vue:382 ~ .then ~ response:', response.total)
      page.value.total = response.total
      page.value.currentPage = initPage.currentPage
      page.value.pageSize = initPage.pageSize
      tableData.value = response.list
      console.log('🚀 ~ file: Materials.vue:387 ~ .then ~ tableData.value:', tableData.value)
      tableLoading.value = false
    })
    .catch((error) => {
      console.log('🚀 ~ file: Materials.vue:391 ~ getMaterialPage ~ error:', error)
      tableLoading.value = false
    })
}
function sizeChange(val) {
  console.log(val)
  page.value.currentPage = 1
  page.value.pageSize = val
  getMaterialPage(page.value)
}
function pageChange(val) {
  page.value.currentPage = val
  // this.page.pageSize = val
  getMaterialPage(page.value)
}
function materialDel(item) {
  ElMessageBox.confirm('是否确认删除该素材？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    delObj(item.id).finally(function () {
      console.log('getMaterialPage')
      getMaterialPage(page.value)
    })
  })
}

function getMaterialgroupPage() {
  materialgroupLoading.value = true
  materialgroupPage({
    type: activeType.value,
  }).then((response) => {
    materialgroupLoading.value = false
    materialgroupList.value = response
    materialGroupOptions.value = JSON.parse(JSON.stringify(response))
    materialgroupList.value.unshift({
      id: '-1',
      name: '全部分组'
    })

    tabClick({
      index: 0
    })
  })
}
function materialgroupDelete(materialgroupObj) {
  ElMessageBox.confirm('是否确认删除该分组？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    materialgroupDel(materialgroupObj.id).then(function () {
      getMaterialgroupPage()
    })
  })
}

function openGroupDialog(){
  if(urls.value.length === 0){
    ElMessage.error(`请先选择图片`)
    return false
  }
  materialGroupValue.value  = ''
  groupVisible.value = true
}

function submitEditGroup() {
  if(!materialGroupValue.value){
    ElMessage.error(`请选择分组`)
    return false
  }
  const ids = urls.value.map(item=>{
    return item.id
  })
  materialgroupBatchUpdate({
    ids: ids,
    grouupId: materialGroupValue.value
  }).then(()=>{
    ElMessage.success(`修改成功`)
    groupVisible.value = false
    getMaterialgroupPage()
  })
}

// 文件新增
const editFormRef = ref()
function materialAdd(){
  editFormRef.value.open(activeType.value)
}
// 文件编辑
function materialEdit(row){
  editFormRef.value.open(activeType.value,row)
}

// 查看
const visitFormRef = ref()
function materialVisit(row){
  visitFormRef.value.open(row)
}

/** 搜索按钮操作 */
const handleQuery = () => {
  page.value.currentPage = 1
  getMaterialPage(page.value)
}

const typeChange = () => {
  getMaterialgroupPage()
}

defineExpose({ getMaterialgroupPage, urls }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
:deep(.material-name) {
  padding: 8px 0px;
  width: 100%;
  .el-checkbox__label{
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.col-do {
  text-align: center;
}

.btn-group{
  display: flex;
  justify-content: flex-end;
  .el-button{
    margin-left: 10px;
  }
}

.img-item{
  margin-bottom: 10px;
}

.pagination{
  margin-top: 10px;
}

.search-bar{
  position: relative;
  height: 40px;
  margin-bottom: 20px;
  .search-box{
    position: absolute;
    right: 0;
    top: 0;
  }
}

.image-slot{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}
</style>
