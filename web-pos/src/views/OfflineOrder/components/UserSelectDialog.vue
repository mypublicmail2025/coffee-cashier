<template>
  <el-dialog
v-model="dialogVisible" title="关联会员" width="800px" :close-on-click-modal="false"
    class="user-select-dialog flex flex-col">
    <div class="search-container flex flex-row">
      <el-input v-model="searchKeyword" placeholder="请输入会员手机号" clearable @keyup.enter="handleSearch"/>
      <el-button class="ml-2px" type="primary" @click="handleSearch">搜 索</el-button>
    </div>

    <div class="user-list-container flex-1" v-loading="loading">
      <div v-if="users.length === 0 && !loading" class="empty-list">
        <el-empty description="暂无会员数据" />
      </div>
      <el-table v-else :data="users" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="nickname" label="会员名称" width="120" />
        <el-table-column prop="avatar" label="头像" width="60">
          <template #default="scope">
            <el-avatar :size="30" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120" />
        <el-table-column prop="nowMoney" label="用户余额" width="100">
          <template #default="scope">
            <span>¥{{ scope.row.nowMoney || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" width="150">
          <template #default="scope">
            <span>{{ dayjs(scope.row.create_time).format('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <el-button type="primary" size="small" @click="selectUser(scope.row)">
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination flex flex-end" v-if="totalCount > 0">
        <Pagination
:total="totalCount" v-model:page="currentPage" v-model:limit="pageSize"
          @pagination="handleCurrentChange" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
// import { ElMessage } from 'element-plus';
import * as MemberApi from '@/api/member/user'
import dayjs from 'dayjs'

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MemberApi.getUserPage({pageNo: currentPage.value, pageSize: pageSize.value,mobile: searchKeyword.value})
    users.value = data.list
    totalCount.value = data.total
  } finally {
    loading.value = false
  }
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'select-user']);

// 状态变量
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) {
      emit('close');
    }
  }
});

const loading = ref(false);
const searchKeyword = ref('');
const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// // 获取用户列表
// const fetchUserList = async () => {
//   loading.value = true;
//   try {
//     const params = {
//       page: currentPage.value,
//       limit: pageSize.value
//     };
    
//     // 添加搜索参数
//     if (searchKeyword.value) {
//       params.mobile = searchKeyword.value;
//     }
//     const data = await MemberApi.getUserPage({ page: currentPage.value, limit: pageSize.value })

//     if (data && data.data) {
//       users.value = data.data.list || [];
//       totalCount.value = data.data.total || 0;
//     } else {
//       users.value = [];
//       totalCount.value = 0;
//     }
//   } catch (error) {
//     console.error('获取会员列表失败:', error);
//     ElMessage.error('获取会员列表失败');
//     users.value = [];
//     totalCount.value = 0;
//   } finally {
//     loading.value = false;
//   }
// };

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  getList();
};

// 处理分页
const handleCurrentChange = (page) => {
  currentPage.value = page.page;
  pageSize.value = page.limit;
  getList();
};

// 选择用户
const selectUser = (user) => {
  emit('select-user', user);
  dialogVisible.value = false;
};

// 监听对话框显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 当对话框打开时，重置搜索并加载数据
    searchKeyword.value = '';
    currentPage.value = 1;
    getList();
  }
});
</script>

<style scoped>
.search-container {
  margin-bottom: 20px;
  width: 50%;
}

.user-list-container {
  min-height: 300px;
}

.empty-list {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}
</style> 