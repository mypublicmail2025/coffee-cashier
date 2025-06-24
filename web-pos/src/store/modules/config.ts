import { store } from '../index'
import { defineStore } from 'pinia'
// import { getMallConfig } from '@/api/config'

interface ConfigVO {
  mallName: string
  adminLogo: string
  appLogo: string
}

export const useConfigStore = defineStore('admin-config', {
  state: (): ConfigVO => ({
    mallName: '',
    adminLogo: '',
    appLogo: '',
  }),
  getters: {
    getMallName(): string {
      return this.mallName
    },
    getAdminLogo(): string {
      return this.adminLogo
    },
    getAppLogo(): string {
      return this.appLogo
    },
  },
  actions: {
    async setConfigInfoAction() {
      console.log('setConfigInfoAction')
      // const configInfo = await getMallConfig()
      // this.mallName = configInfo.mallName
      // this.adminLogo = configInfo.adminLogo
      // this.appLogo = configInfo.appLogo
      // localStorage.setItem('config', JSON.stringify(configInfo))
    }
  }
})

export const useConfigStoreWithOut = () => {
  return useConfigStore(store)
}
