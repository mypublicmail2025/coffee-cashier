<template>
  <div class="profile-page ">
    <!-- 顶部 ActionBar -->
    <div class="profile-content flex flex-col h-full">
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="userAvatar" />
          <div class="avatar-upload">
            <button class="upload-button">
              <span class="upload-icon">+</span>
            </button>
            <input type="file" accept="image/*" class="file-input" @change="handleAvatarChange" />
          </div>
        </div>
        <div class="profile-info">
          <h2>{{ settings.user.nickname || '用户' }}</h2>
          <!-- <p class="user-role">
            {{ userRoleText }}
          </p> -->
          <p class="last-login">
            上次登录: {{ lastLoginTime }}
          </p>
        </div>
      </div>

      <div class="profile-tabs-container flex-1">
        <div class="profile-tabs">
          <button
v-for="tab in tabs" :key="tab.id" :class="['tab-button', {active: activeTab === tab.id}]"
            @click="activeTab = tab.id">
            {{ tab.name }}
          </button>
        </div>

        <div class="profile-content-section">
          <!-- 个人资料 -->
          <div v-if="activeTab === 'profile'" class="profile-section">
            <h2 class="section-title">
              个人资料
            </h2>

            <div class="profile-form">

              <div class="form-group">
                <label>显示名称</label>
                <el-input :disabled="true" v-model="settings.user.nickname" type="text" />
              </div>

              <!-- <div class="form-group">
                <label>电子邮箱</label>
                <input v-model="settings.user.email" type="email" />
              </div> -->

              <!-- <div class="form-group">
                <label>手机号码</label>
                <input v-model="settings.user.mobile" type="tel" />
              </div> -->



              <!-- <div class="form-actions">
                <button class="primary-button" @click="saveProfile">
                  保存资料
                </button>
              </div> -->
            </div>

            <div class="password-section">
              <h3>安全设置</h3>
              <el-switch  inactive-text="修改密码" v-model="showChangePassword" @change="switchShowPwd" />

              <div v-if="showChangePassword" class="password-change-form">
                <ResetPassword />
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'shop'" class="profile-section">
            <h2 class="section-title">
              店铺设置
            </h2>

            <div class="shop-form ">
              <el-form
ref="formRef" :model="settings.shop" :rules="formRules" label-width="100px"
                v-loading="formLoading">
                <el-form-item class="is-required" label="核销时间">
                  <el-date-picker
                  :disabled="!formShopEdit"
v-model="settings.timeData" type="datetimerange" :popper-options="{
                  placement: 'top',
                  boundariesPadding: 10
                }" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item class="is-required" label="营业时间">
                  <div class="demo-time-range">
                    <el-time-select
                      :disabled="!formShopEdit"
v-model="settings.shop.businessStartTime" :max-time="settings.shop.businessEndTime"
                      class="mr-4" placeholder="开始时间" start="00:00" step="00:15" end="24:00" />
                    至
                    <el-time-select
                      :disabled="!formShopEdit"
v-model="settings.shop.businessEndTime" :min-time="settings.shop.businessStartTime"
                      placeholder="结束时间" start="00:00" step="00:15" end="24:00" />
                  </div>
                </el-form-item>
                <el-form-item label="闪送Id" prop="lat">
                  <el-input :disabled="!formShopEdit" v-model="settings.shop.shanSongId" placeholder="请输入闪送Id" />
                </el-form-item>
              </el-form>
            </div>
            <el-button class="primary-button" @click="saveShop">保存</el-button>
            <el-button v-if="formShopEdit" @click="formShopEdit = false" >取 消</el-button>
            <el-button v-if="!formShopEdit" @click="formShopEdit = true" >编 辑</el-button>
          </div>


          <!-- 关于 -->
          <div v-if="activeTab === 'about'" class="profile-section">
            <h2 class="section-title">
              关于系统
            </h2>

            <div class="about-info">
              <p><strong>系统名称:</strong> WebPOS 收银系统</p>
              <p><strong>版本:</strong> v1.0.0</p>
              <p><strong>开发者:</strong> Your Company</p>
              <p><strong>联系方式:</strong> support@example.com</p>
              <p>
                <strong>官方网站:</strong> <a href="https://example.com" target="_blank">https://example.com</a>
              </p>
            </div>

            <div class="setting-item">
              <div class="setting-label">
                <span>检查更新</span>
              </div>
              <div class="setting-control">
                <el-button class="primary-button" @click="checkUpdate">
                  检查更新
                </el-button>
              </div>
            </div>

            <div class="license-info">
              <h3>许可证信息</h3>
              <p>© 2023 Your Company. 保留所有权利。</p>
              <p>本软件受版权法和国际条约保护。未经授权复制或分发本软件或其任何部分可能导致严重的民事和刑事处罚，并将在法律允许的最大范围内被起诉。</p>
            </div>
          </div>
        </div>


      </div>


    </div>

    <!-- 底部 TabBar -->
    <AppFooter />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
// import AppHeader from '@/components/AppHeader.vue'
import ResetPassword from './components/ResetPwd.vue'
import defaultAvatar from '@/assets/imgs/avatar.gif'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
import * as ShopApi from '@/api/mall/shop/shop'

function formatTimestamp(timestamp) {
  if(!timestamp){
    return ''
  }
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
export default {
  name: 'ProfileView',
  components: {
    ResetPassword,
    // AppFooter
  },
  setup() {
    const activeTab = ref('profile')
    const showChangePassword = ref(false)
    
    // 默认头像
    const userAvatar = ref(userStore.getUser.avatar || defaultAvatar)
    const formShopEdit = ref(false) // 表单的编辑状态

    // 上次登录时间
    const lastLoginTime = ref(new Date().toLocaleString())
    const formRules = reactive({
      shanSongId: [{ required: true, message: '闪送Id不能为空', trigger: 'blur' }],
      businessStartTime: [{ required: true, message: '营业开始时间不能为空', trigger: 'blur' }],
      businessEndTime: [{ required: true, message: '营业结束时间不能为空', trigger: 'blur' }],
     
    })
    const formRef = ref() 
    // 模拟打印机列表
    const printers = ref([
      { id: 'printer1', name: '收银台打印机' },
      { id: 'printer2', name: '厨房打印机' },
      { id: 'printer3', name: '前台打印机' }
    ])
    // 设置数据
    const settings = reactive({
      user: {
        nickname: userStore.getUser.nickname || '',
        email: userStore.getUser.email || '',
        mobile: userStore.getUser.phone || '',
      },
      timeData: [],
      shop: {
        id: userStore.shopId,
        shanSongId: '',
        businessStartTime: '',
        businessEndTime: '',
       
      },
      print: {
        defaultPrinter: 'printer1',
        paperSize: '80mm',
        autoPrint: true,
        printShopInfo: true
      }
    })
    
    // 用户角色文本
    const userRoleText = computed(() => {
      const role = userStore.getUser.role || ''
      switch (role) {
        case 'admin':
          return '管理员'
        case 'user':
          return '普通用户'
        default:
          return '未知角色'
      }
    })
    const switchShowPwd = (val) => {
      showChangePassword.value = val
    }
    // 修改密码表单
    const passwordForm = reactive({
      current: '',
      new: '',
      confirm: ''
    })
    
    // 标签页定义
    const tabs = [
      { id: 'profile', name: '个人资料' },
      { id: 'shop', name: '店铺设置' },
      // { id: 'print', name: '打印设置' },
      { id: 'about', name: '关于' }
    ]
    
    // 加载设置
    onMounted(() => {
      // 这里可以从本地存储或API加载设置
      const savedSettings = localStorage.getItem('app_settings')
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          Object.assign(settings, parsed)
        } catch (e) {
          console.error('Failed to parse settings:', e)
        }
      }
      ShopApi.getShop(userStore.shopId).then(res => {
        console.log(res)
        settings.shop = res
        settings.timeData = [
          formatTimestamp(res.writeOffStartTime),
          formatTimestamp(res.writeOffEndTime)
        ]
      })
      
      // 模拟获取上次登录时间
      const lastLogin = localStorage.getItem('last_login')
      if (lastLogin) {
        lastLoginTime.value = new Date(lastLogin).toLocaleString()
      } else {
        // 保存当前时间作为上次登录时间
        localStorage.setItem('last_login', new Date().toISOString())
      }
    })
    
    // 保存个人资料
    const saveProfile = () => {
      // 更新用户显示名称
      if (userStore.userInfo) {
        userStore.userInfo.name = settings.user.displayName
      }
      
      alert('个人资料已保存')
    } 
    
    const saveShop = async () => {
      // 更新用户显示名称
      const valid = await formRef.value.validate()
      if(!valid){
        return
      }
      const shop = {
        ...settings.shop,
        writeOffStartTime: settings.timeData[0],
        writeOffEndTime: settings.timeData[1],
      }
      const res = await ShopApi.updateShop(shop)
      if(res){
        ElMessage.success('保存成功')
      }else{
        ElMessage.error('保存失败')
      }
    }
    
    // 处理头像上传
    const handleAvatarChange = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }
      
      // 读取文件并显示预览
      const reader = new FileReader()
      reader.onload = (e) => {
        userAvatar.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
   
    
    // 重置设置
    const resetSettings = () => {
      if (confirm('确定要重置所有设置吗？')) {
        // 重置为默认值
        settings.system.offlineMode = true
        settings.system.autoSync = true
        settings.system.syncInterval = '15'
        settings.system.theme = 'light'
        settings.print.defaultPrinter = 'printer1'
        settings.print.paperSize = '80mm'
        settings.print.autoPrint = true
        settings.print.printShopInfo = true
      }
    }
    
    // 清除缓存
    const clearCache = () => {
      if (confirm('确定要清除所有本地缓存数据吗？这将删除所有未同步的数据。')) {
        // 这里实现清除缓存的逻辑
        alert('缓存已清除')
      }
    }
    
    // 修改密码
    const changePassword = () => {
      if (!passwordForm.current) {
        alert('请输入当前密码')
        return
      }
      
      if (!passwordForm.new) {
        alert('请输入新密码')
        return
      }
      
      if (passwordForm.new !== passwordForm.confirm) {
        alert('两次输入的新密码不一致')
        return
      }
      
      // 这里实现修改密码的逻辑
      alert('密码修改成功')
      showChangePassword.value = false
      
      // 清空表单
      passwordForm.current = ''
      passwordForm.new = ''
      passwordForm.confirm = ''
    }
    
    // 测试打印
    const testPrint = () => {
      if (!settings.print.defaultPrinter) {
        alert('请先选择默认打印机')
        return
      }
      
      // 这里实现测试打印的逻辑
      alert(`正在使用 ${settings.print.defaultPrinter} 打印测试页`)
    }
    
    // 检查更新
    const checkUpdate = () => {
      // 这里实现检查更新的逻辑
      alert('当前已是最新版本')
    }
   
    return {
      activeTab,
      tabs,
      settings,
      printers,
      showChangePassword,
      passwordForm,
      userAvatar,
      lastLoginTime,
      userRoleText,
      saveProfile,
      handleAvatarChange,
      switchShowPwd,
      saveShop,
      formRules,
      formRef,
      formShopEdit,
      // saveSettings,
      resetSettings,
      clearCache,
      changePassword,
      testPrint,
      checkUpdate
    }
  }
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.profile-content {
  flex: 1;
  overflow-y: auto;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.profile-tabs-container{
  background-color: white;
}

.avatar-upload {
  position: absolute;
  right: 0;
  bottom: 0;
}

.upload-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.profile-info h2 {
  margin: 0 0 5px;
  font-size: 20px;
  color: #333;
}

.user-role {
  color: var(--el-color-primary);
  font-weight: bold;
  margin: 0 0 5px;
  font-size: 14px;
}

.last-login {
  color: #999;
  font-size: 12px;
  margin: 0;
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin: 0 20px 20px;
  overflow-x: auto;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-button.active {
  color: var(--el-color-primary);
  border-bottom-color: var(--el-color-primary);
}

.profile-content-section {
  padding: 0 20px;
}

.profile-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.profile-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  margin-top: 20px;
}

.password-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.password-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.setting-label {
  flex: 1;
}

.setting-label span {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.setting-description {
  margin: 5px 0 0;
  font-size: 12px;
  color: #999;
}

.setting-control {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #409eff;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.primary-button,
.secondary-button,
.danger-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.primary-button {
  background-color: var(--el-color-primary);
  color: white;
}

.primary-button:hover {
  background-color: var(--el-color-primary);
}

.secondary-button {
  background-color: var(--el-color-primary);
  color: white;
}

.secondary-button:hover {
  background-color: #85ce61;
}

.danger-button {
  background-color: #f56c6c;
  color: white;
}

.danger-button:hover {
  background-color: #f78989;
}

.cancel-button {
  background-color: #909399;
  color: white;
}

.cancel-button:hover {
  background-color: #a6a9ad;
}

.password-change-form {
  margin-top: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.password-change-form h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.profile-actions button {
  margin-left: 10px;
}

.about-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.about-info p {
  margin: 10px 0;
}

.about-info a {
  color: #409eff;
  text-decoration: none;
}

.about-info a:hover {
  text-decoration: underline;
}

.license-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.license-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.license-info p {
  margin: 10px 0;
  font-size: 12px;
  color: #666;
}
</style> 