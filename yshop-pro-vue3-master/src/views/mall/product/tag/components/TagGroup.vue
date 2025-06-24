<script setup lang="ts" name="TagGroup">
import { defineProps, toRefs, ref } from 'vue';
import * as TagGroupApi from "@/api/mall/product/tag/group";
import { GroupItem } from "@/types/member";
import UserGroupForm from "./TagGroupForm.vue";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const activeId = ref<number | null>(null)
const props = defineProps({
  groupList: {
    type: Array as () => GroupItem[],
    default: () => []
  }
})
const emit = defineEmits(['changeGroup', 'success'])
// 切换分组
const changeGroup = (id:number | null) => {
  activeId.value = id
  emit('changeGroup', id)
}

// 删除分组
/** 删除按钮操作 */
const deleteGroup = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TagGroupApi.deleteTagGroup(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    emit('success')
  } catch {}
}

/** 添加/修改操作 */
const formGroupRef = ref()
const openGroupForm = (type: string, row?: TagGroupApi.TagGroupVO) => {
  formGroupRef.value.open(type, row)
}

const refreshList = () => {
  emit('success')
}

const { groupList } = toRefs(props);
</script>

<template>
  <div class="group">
    <div class="group-box">
      <el-scrollbar height="600px">
        <div class="group-item-box">
          <div class="group-item" :class="{active: activeId === null}" @click="changeGroup(null)">
            <span>全部</span>
          </div>
        </div>
        <div class="group-item-box" v-for="item in groupList" :key="item.id">
          <div class="group-item  flex justify-between" :class="{active: activeId === item.id}" @click="changeGroup(item.id)">
            <span>{{item.groupName}}</span>
            <el-dropdown>
              <i>More</i>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openGroupForm('update', item)">修改</el-dropdown-item>
                  <el-dropdown-item @click="deleteGroup(item.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <UserGroupForm ref="formGroupRef" @success="refreshList" />
</template>

<style scoped lang="scss">
  .group {
    border: 1px solid #eeeeee;
    border-radius: 2px;
    padding: 15px 0;
    .group-box {
      .group-item-box {
        padding: 0 15px;
        align-items: center;
        .group-item {
          line-height: 20px;
          font-size: 14px;
          color: #666666;
          font-weight: 500;
          border-radius: 4px;
          margin-bottom: 15px;
          cursor: pointer;
          background: #fafafa;
          padding: 15px;
          i {
            font-size: 12px;
            color: #ffffff;
            font-style: normal;
            cursor: pointer;
            visibility: hidden;
            line-height: 20px;
          }
        }
        :deep(.el-tooltip__trigger:focus-visible){
          outline: unset;
        }
        .group-item:hover {
          background: #409eff;
          color: #ffffff;
          i {
            visibility: visible;
          }
        }
        .active {
          background: #409eff;
          color: #ffffff;
        }
      }
    }
  }
</style>
