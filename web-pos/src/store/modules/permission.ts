import { defineStore } from 'pinia'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import remainingRouter from '@/router/modules/remaining'
import { generateRoute, flatMultiLevelRoutes } from '@/utils/routerHelper'
import { getAsyncRoutes } from '@/api/login'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {

    parseCashierRoutes(res: AppCustomRouteRecordRaw[]): AppCustomRouteRecordRaw[]{
      const route = res.find((item) => item.path?.indexOf('/cashier') === 0)
      return route?.children?.map((item) => {
        return {
          ...item,
          path:  '/'+item.path
        }
      })||[]
    
    },

    async generateRoutes(): Promise<unknown> {
      return new Promise<void>(async (resolve) => {
        let res: AppCustomRouteRecordRaw[]
        if (wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
          res = wsCache.get(CACHE_KEY.ROLE_ROUTERS) as AppCustomRouteRecordRaw[]
        } else {
          res =  await getAsyncRoutes()
          res = this.parseCashierRoutes(res)
          wsCache.set(CACHE_KEY.ROLE_ROUTERS, res)
        }
        console.log('res==', res)
        const routerMap: AppRouteRecordRaw[] = generateRoute(res  as AppCustomRouteRecordRaw[])
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(remainingRouter).concat(routerMap)
        resolve()
      })
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
