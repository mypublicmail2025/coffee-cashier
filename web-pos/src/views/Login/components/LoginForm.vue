<template>
  <!-- <h3 class="form-title" :style="{ color: 'var(--btn-primary)' }">账密登录</h3> -->
  <el-form
v-show="getShow" ref="formLogin" :model="loginData.loginForm" :rules="LoginRules" class="login-form"
    label-position="top" label-width="120px" size="large">
    <el-row style="maring-left: -10px; maring-right: -10px">
     
      <el-row :span="24" class="shop-row mb-6 border border-gray-200 w-full flex items-center justify-between">
        <el-col :span="3">
          <img class="shop-icon" :src="company" />
        </el-col>
        <el-col :span="21">
          <el-select  class="no-border w-full" v-model="loginData.loginForm.shopId" clearable placeholder="请选择门店">
            <el-option v-for="item in shopList" :key="item.id" :label="item.storeName" :value="item.id" />
          </el-select>
        </el-col>
      </el-row>
      <el-col :span="24">
        <el-form-item prop="username">
          <el-input
v-model="loginData.loginForm.username" :placeholder="t('login.usernamePlaceholder')"
            :prefix-icon="iconAvatar" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="password">
          <el-input
v-model="loginData.loginForm.password" :placeholder="t('login.passwordPlaceholder')"
            :prefix-icon="iconLock" show-password type="password" @keyup.enter="getCode()" />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-left: 10px; padding-right: 10px; margin-top: -20px; margin-bottom: -20px">
        <el-form-item>
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6">
              <el-checkbox v-model="loginData.loginForm.rememberMe">
                {{ t('login.remember') }}
              </el-checkbox>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <XButton
class="w-[100%] btn-submit" :disabled="loading" :loading="loginLoading" :title="t('login.login')"
            type="primary" @click="getCode()" />
        </el-form-item>
      </el-col>
      <Verify
ref="verify" :captchaType="captchaType" :imgSize="{width: '400px', height: '200px'}" mode="pop"
        @success="handleLogin" />
    </el-row>
    <el-divider />

    <el-col :span="24" style="padding-left: 10px; padding-right: 10px">
      <div class="user-type">
        <p class="user-type-title">第三方账号登录</p>
        <div class="user-type-btns">
          <button class="wechat-btn" @click="handleWechatLogin">
            <img
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M2.54547%2010.9335C2.54547%207.00341%206.34806%203.81824%2011.0413%203.81824C15.2809%203.81824%2018.7926%206.41868%2019.4326%209.81689C19.2804%209.80807%2019.1268%209.80366%2018.9716%209.80366C14.6917%209.80366%2011.2233%2012.7097%2011.2233%2016.2915C11.2233%2016.8968%2011.3232%2017.4816%2011.5082%2018.0369C11.353%2018.0443%2011.1979%2018.0487%2011.0413%2018.0487C10.0716%2018.0487%209.13623%2017.9076%208.268%2017.6579C8.18894%2017.6329%208.1054%2017.6197%208.01887%2017.6197C7.85477%2017.6197%207.70709%2017.6696%207.56686%2017.7504L5.70659%2018.8303C5.65587%2018.8597%205.60515%2018.8832%205.54398%2018.8832C5.38734%2018.8832%205.26054%2018.7554%205.26054%2018.5996C5.26054%2018.5471%205.27564%2018.4953%205.29018%2018.4455C5.29556%2018.427%205.30086%2018.4089%205.30529%2018.391C5.31519%2018.3569%205.47377%2017.7613%205.6093%2017.2523C5.63725%2017.1473%205.66421%2017.0461%205.68869%2016.9541C5.7051%2016.8939%205.71852%2016.8366%205.71852%2016.7734C5.71852%2016.5824%205.62454%2016.4135%205.47983%2016.3106C3.68968%2015.006%202.54547%2013.077%202.54547%2010.9335ZM7.07588%208.65553C7.07588%209.28434%207.58458%209.79268%208.20964%209.79268C8.8347%209.79268%209.34192%209.28434%209.34192%208.65553C9.34192%208.02673%208.8347%207.51692%208.20964%207.51692C7.58458%207.51692%207.07588%208.02673%207.07588%208.65553ZM12.7404%208.65553C12.7404%209.28434%2013.2476%209.79268%2013.8741%209.79268C14.4992%209.79268%2015.0064%209.28434%2015.0064%208.65553C15.0064%208.02673%2014.4992%207.51692%2013.8741%207.51692C13.2476%207.51692%2012.7404%208.02673%2012.7404%208.65553ZM26.0522%2016.2907C26.0522%2018.0772%2025.0974%2019.6859%2023.6056%2020.7731C23.4848%2020.8598%2023.4072%2020.9994%2023.4072%2021.1595C23.4072%2021.2124%2023.4192%2021.2594%2023.4326%2021.3094C23.4842%2021.5032%2023.5492%2021.7468%2023.6071%2021.9637C23.6831%2022.2482%2023.7467%2022.4867%2023.7518%2022.5068C23.7557%2022.5228%2023.7604%2022.539%2023.7651%2022.5554C23.777%2022.5963%2023.7891%2022.6382%2023.7891%2022.6801C23.7891%2022.8109%2023.6832%2022.9167%2023.5534%2022.9167C23.5027%2022.9167%2023.4609%2022.8976%2023.4177%2022.8726L21.8662%2021.972C21.7498%2021.9059%2021.626%2021.8633%2021.4918%2021.8633C21.4187%2021.8633%2021.3485%2021.875%2021.2829%2021.8956C20.5594%2022.1042%2019.7792%2022.2203%2018.9721%2022.2203C15.0606%2022.2203%2011.8906%2019.5669%2011.8906%2016.2907C11.8906%2013.0173%2015.0606%2010.3625%2018.9721%2010.3625C22.8821%2010.3625%2026.0522%2013.0173%2026.0522%2016.2907ZM15.6681%2014.3937C15.6681%2014.9182%2016.0903%2015.3427%2016.6124%2015.3427C17.1331%2015.3427%2017.5553%2014.9182%2017.5553%2014.3937C17.5553%2013.8706%2017.1331%2013.446%2016.6124%2013.446C16.0903%2013.446%2015.6681%2013.8706%2015.6681%2014.3937ZM20.388%2014.3937C20.388%2014.9182%2020.8102%2015.3427%2021.3324%2015.3427C21.853%2015.3427%2022.2752%2014.9182%2022.2752%2014.3937C22.2752%2013.8706%2021.853%2013.446%2021.3324%2013.446C20.8102%2013.446%2020.388%2013.8706%2020.388%2014.3937Z%22%20fill%3D%22white%22%20style%3D%22fill%3Awhite%3Bfill-opacity%3A1%3B%22%2F%3E%3C%2Fsvg%3E"
              alt="微信登录" />
          </button>
        </div>
      </div>
    </el-col>
  </el-form>
</template>

<script lang="ts" setup>
import {ElLoading} from 'element-plus'
import type {RouteLocationNormalizedLoaded} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useIcon} from '@/hooks/web/useIcon'
import * as authUtil from '@/utils/auth'
import {usePermissionStore} from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import {LoginStateEnum, useFormValid, useLoginState} from './useLogin'
import {required} from '@/utils/formRules'
const {t} = useI18n()
const iconAvatar = useIcon({icon: 'ep:user'})
const iconLock = useIcon({icon: 'ep:unlock'})
import company from '@/assets/svgs/company.svg'
const formLogin = ref()
const {validForm} = useFormValid(formLogin)
const {getLoginState} = useLoginState()
const {currentRoute, push} = useRouter()
const message = useMessage() // 消息弹窗
import * as ShopApi from '@/api/mall/shop/shop'
import { getInfo } from '@/api/login'
import {CACHE_KEY, useCache} from '@/hooks/web/useCache'

const {wsCache} = useCache()
// 当前选中的门店
const shopList = ref<ShopApi.ShopVO[]>([]);

const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字
const loading = ref(false)

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  tenantName: [required],
  username: [required],
  shopId: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    // tenantName: 'yshop',
    username: '',
    password: '',
    captchaVerification: '',
    rememberMe: false,
    shopId: undefined
  }
})

// 获取验证码
const getCode = async () => {
  if (!loginData.loginForm.shopId) {
    message.error('请选择门店')
    return;
  }
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
//获取租户ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
    const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
    authUtil.setTenantId(res)
  }
}
// 记住我
const getCookie = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe ? true : false,
      shopId: loginForm.shopId ? loginForm.shopId : loginData.loginForm.shopId,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}

// 处理微信登录
function handleWechatLogin() {
  console.log('微信登录')
  // 这里可以添加微信登录的逻辑
  message.info('暂未开放')
}

// 登录
const handleLogin = async (params) => {
  loginLoading.value = true
  
  try {
    await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    loginData.loginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login(loginData.loginForm)
    if (!res) {
      return
    }
    ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm(loginData.loginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    const userInfo = await getInfo()
    wsCache.set(CACHE_KEY.USER, userInfo)

   

    localStorage.setItem('last_login', new Date().toISOString())
    if (!redirect.value) {
      redirect.value = '/'
    }
    // 判断是否为SSO登录
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      push({path: redirect.value || permissionStore.addRouters[0].path})
    }
  } catch {
    loginLoading.value = false
  } finally {
    setTimeout(() => {
      const loadingInstance = ElLoading.service()
      loadingInstance.close()
    }, 400)
  }
}

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 组件挂载时自动设置演示用户
onMounted(async () => {
  getCookie()
  shopList.value = (
    await ShopApi.getShopPage({
      pageNo: 1,
      pageSize: 100
    })
  ).list
})
</script>

<style lang="scss" scoped>
.login-form-container {
  width: 100%;
}

.login-header {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-container {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.5s ease;
}

.logo {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
}

.input-group {
  margin-bottom: 20px;
}
.shop-icon{
  margin-left: 10px;
  width: 16px;
  height: 16px;
  color: rgb(168, 171, 178);
}

.captcha-group {
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 120px;
  height: 42px;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dark);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: var(--btn-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  font-size: 16px;
  margin-bottom: 20px;
  position: relative;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.user-type {
  text-align: center;
  margin-top: 20px;
}

.user-type-title {
  color: #757575;
  margin-bottom: 15px;
}

.user-type-btns {
  display: flex;
  justify-content: center;
}

.wechat-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  transition: transform 0.3s ease;
  border-radius: 50%;
  background-color: #07c160;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shop-row {
  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    border: none !important;
  }
}
.wechat-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wechat-icon {
  font-size: 20px;
  color: white;
}
</style>
