<template>
  <el-form
    v-show="getShow"
    ref="formSmsLogin"
    :model="loginData.loginForm"
    :rules="rules"
    class="login-form"
    label-position="top"
    label-width="120px"
    size="large"
  >
    <el-row style="margin-left: -10px; margin-right: -10px">
      <!-- 租户名 -->
      <!-- <el-col :span="24" style="padding-left: 10px; padding-right: 10px">
        <el-form-item>
          <h3 class="form-title" :style="{ color: 'var(--btn-primary)' }">账密登录</h3>
        </el-form-item>
      </el-col> -->
      <el-col :span="24" style="padding-left: 10px; padding-right: 10px">
        <el-form-item v-if="loginData.tenantEnable === 'true'" prop="tenantName">
          <el-input
            v-model="loginData.loginForm.tenantName"
            :placeholder="t('login.tenantNamePlaceholder')"
            :prefix-icon="iconHouse"
            type="primary"
            link
          />
        </el-form-item>
      </el-col>
      <!-- 手机号 -->
      <el-col :span="24" style="padding-left: 10px; padding-right: 10px">
        <el-form-item prop="mobileNumber">
          <el-input
            v-model="loginData.loginForm.mobileNumber"
            :placeholder="t('login.mobileNumberPlaceholder')"
            :prefix-icon="iconCellphone"
          />
        </el-form-item>
      </el-col>
      <!-- 验证码 -->
      <el-col :span="24" style="padding-left: 10px; padding-right: 10px">
        <el-form-item prop="code">
          <el-row :gutter="5" justify="space-between" style="width: 100%">
            <el-col :span="24">
              <el-input
                v-model="loginData.loginForm.code"
                :placeholder="t('login.codePlaceholder')"
                :prefix-icon="iconCircleCheck"
              >
                <!-- <el-button class="w-[100%]"> -->
                <template #append>
                  <span
                    v-if="mobileCodeTimer <= 0"
                    class="getMobileCode"
                    style="cursor: pointer"
                    @click="getSmsCode"
                  >
                    {{ t('login.getSmsCode') }}
                  </span>
                  <span v-if="mobileCodeTimer > 0" class="getMobileCode" style="cursor: pointer">
                    {{ mobileCodeTimer }}秒后可重新获取
                  </span>
                </template>
              </el-input>
              <!-- </el-button> -->
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col
        :span="24"
        style="padding-left: 10px; padding-right: 10px; margin-top: -20px; margin-bottom: -20px"
      >
        <el-form-item :visible="false">
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6" style="visibility: hidden">213</el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <!-- 登录按钮 / 返回按钮 -->
      <el-col :span="24" style="padding-left: 10px; padding-right: 10px">
        <el-form-item>
          <XButton
            :loading="loginLoading"
            :title="t('login.login')"
            class="w-[100%] btn-submit"
            type="primary"
            @click="signIn()"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider />
    <el-col :span="24" style="padding-left: 10px; padding-right: 10px">
      <div class="user-type">
        <p class="user-type-title">第三方账号登录</p>
        <div class="user-type-btns">
          <button class="wechat-btn" @click="handleWechatLogin">
            <img
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M2.54547%2010.9335C2.54547%207.00341%206.34806%203.81824%2011.0413%203.81824C15.2809%203.81824%2018.7926%206.41868%2019.4326%209.81689C19.2804%209.80807%2019.1268%209.80366%2018.9716%209.80366C14.6917%209.80366%2011.2233%2012.7097%2011.2233%2016.2915C11.2233%2016.8968%2011.3232%2017.4816%2011.5082%2018.0369C11.353%2018.0443%2011.1979%2018.0487%2011.0413%2018.0487C10.0716%2018.0487%209.13623%2017.9076%208.268%2017.6579C8.18894%2017.6329%208.1054%2017.6197%208.01887%2017.6197C7.85477%2017.6197%207.70709%2017.6696%207.56686%2017.7504L5.70659%2018.8303C5.65587%2018.8597%205.60515%2018.8832%205.54398%2018.8832C5.38734%2018.8832%205.26054%2018.7554%205.26054%2018.5996C5.26054%2018.5471%205.27564%2018.4953%205.29018%2018.4455C5.29556%2018.427%205.30086%2018.4089%205.30529%2018.391C5.31519%2018.3569%205.47377%2017.7613%205.6093%2017.2523C5.63725%2017.1473%205.66421%2017.0461%205.68869%2016.9541C5.7051%2016.8939%205.71852%2016.8366%205.71852%2016.7734C5.71852%2016.5824%205.62454%2016.4135%205.47983%2016.3106C3.68968%2015.006%202.54547%2013.077%202.54547%2010.9335ZM7.07588%208.65553C7.07588%209.28434%207.58458%209.79268%208.20964%209.79268C8.8347%209.79268%209.34192%209.28434%209.34192%208.65553C9.34192%208.02673%208.8347%207.51692%208.20964%207.51692C7.58458%207.51692%207.07588%208.02673%207.07588%208.65553ZM12.7404%208.65553C12.7404%209.28434%2013.2476%209.79268%2013.8741%209.79268C14.4992%209.79268%2015.0064%209.28434%2015.0064%208.65553C15.0064%208.02673%2014.4992%207.51692%2013.8741%207.51692C13.2476%207.51692%2012.7404%208.02673%2012.7404%208.65553ZM26.0522%2016.2907C26.0522%2018.0772%2025.0974%2019.6859%2023.6056%2020.7731C23.4848%2020.8598%2023.4072%2020.9994%2023.4072%2021.1595C23.4072%2021.2124%2023.4192%2021.2594%2023.4326%2021.3094C23.4842%2021.5032%2023.5492%2021.7468%2023.6071%2021.9637C23.6831%2022.2482%2023.7467%2022.4867%2023.7518%2022.5068C23.7557%2022.5228%2023.7604%2022.539%2023.7651%2022.5554C23.777%2022.5963%2023.7891%2022.6382%2023.7891%2022.6801C23.7891%2022.8109%2023.6832%2022.9167%2023.5534%2022.9167C23.5027%2022.9167%2023.4609%2022.8976%2023.4177%2022.8726L21.8662%2021.972C21.7498%2021.9059%2021.626%2021.8633%2021.4918%2021.8633C21.4187%2021.8633%2021.3485%2021.875%2021.2829%2021.8956C20.5594%2022.1042%2019.7792%2022.2203%2018.9721%2022.2203C15.0606%2022.2203%2011.8906%2019.5669%2011.8906%2016.2907C11.8906%2013.0173%2015.0606%2010.3625%2018.9721%2010.3625C22.8821%2010.3625%2026.0522%2013.0173%2026.0522%2016.2907ZM15.6681%2014.3937C15.6681%2014.9182%2016.0903%2015.3427%2016.6124%2015.3427C17.1331%2015.3427%2017.5553%2014.9182%2017.5553%2014.3937C17.5553%2013.8706%2017.1331%2013.446%2016.6124%2013.446C16.0903%2013.446%2015.6681%2013.8706%2015.6681%2014.3937ZM20.388%2014.3937C20.388%2014.9182%2020.8102%2015.3427%2021.3324%2015.3427C21.853%2015.3427%2022.2752%2014.9182%2022.2752%2014.3937C22.2752%2013.8706%2021.853%2013.446%2021.3324%2013.446C20.8102%2013.446%2020.388%2013.8706%2020.388%2014.3937Z%22%20fill%3D%22white%22%20style%3D%22fill%3Awhite%3Bfill-opacity%3A1%3B%22%2F%3E%3C%2Fsvg%3E"
              alt="微信登录"
            />
          </button>
        </div>
      </div>
    </el-col>
  </el-form>
</template>
<script lang="ts" name="MobileForm" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useIcon } from '@/hooks/web/useIcon'

import { setTenantId, setToken } from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import { getTenantIdByName, sendSmsCode, smsLogin } from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'

const { t } = useI18n()
const message = useMessage()
const permissionStore = usePermissionStore()
const { currentRoute, push } = useRouter()
const formSmsLogin = ref()
const loginLoading = ref(false)
const iconHouse = useIcon({ icon: 'ep:house' })
const iconCellphone = useIcon({ icon: 'ep:cellphone' })
const iconCircleCheck = useIcon({ icon: 'ep:circle-check' })
const { validForm } = useFormValid(formSmsLogin)
const { getLoginState } = useLoginState()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE)

// 处理微信登录
function handleWechatLogin() {
  console.log('微信登录')
  // 这里可以添加微信登录的逻辑
  message.info('暂未开放')
}
const rules = {
  tenantName: [required],
  mobileNumber: [required],
  code: [required]
}
const loginData = reactive({
  codeImg: '',
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  token: '',
  loading: {
    signIn: false
  },
  loginForm: {
    uuid: '',
    tenantName: 'yshop',
    mobileNumber: '',
    code: ''
  }
})
const smsVO = reactive({
  smsCode: {
    mobile: '',
    scene: 21
  },
  loginSms: {
    mobile: '',
    code: ''
  }
})
const mobileCodeTimer = ref(0)
const redirect = ref<string>('')
const getSmsCode = async () => {
  await getTenantId()
  smsVO.smsCode.mobile = loginData.loginForm.mobileNumber
  await sendSmsCode(smsVO.smsCode).then(async () => {
    message.success(t('login.SmsSendMsg'))
    // 设置倒计时
    mobileCodeTimer.value = 60
    let msgTimer = setInterval(() => {
      mobileCodeTimer.value = mobileCodeTimer.value - 1
      if (mobileCodeTimer.value <= 0) {
        clearInterval(msgTimer)
      }
    }, 1000)
  })
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
// 获取租户 ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
    const res = await getTenantIdByName(loginData.loginForm.tenantName)
    setTenantId(res)
  }
}
// 登录
const signIn = async () => {
  await getTenantId()
  const data = await validForm()
  if (!data) return
  loginLoading.value = true
  smsVO.loginSms.mobile = loginData.loginForm.mobileNumber
  smsVO.loginSms.code = loginData.loginForm.code
  await smsLogin(smsVO.loginSms)
    .then(async (res) => {
      setToken(res?.token)
      if (!redirect.value) {
        redirect.value = '/'
      }
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    })
    .catch(() => {})
    .finally(() => {
      loginLoading.value = false
    })
}
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
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
.smsbtn {
  margin-top: 33px;
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

.wechat-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wechat-icon {
  font-size: 20px;
  color: white;
}
</style>
