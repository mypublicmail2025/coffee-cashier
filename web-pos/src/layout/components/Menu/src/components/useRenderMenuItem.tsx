import { ElSubMenu, ElMenuItem } from 'element-plus'
import type { RouteMeta } from 'vue-router'
import { hasOneShowingChild } from '../helper'
import { isUrl } from '@/utils/is'
import { useRenderMenuTitle } from './useRenderMenuTitle'
import { useDesign } from '@/hooks/web/useDesign'
import { pathResolve } from '@/utils/routerHelper'

export const useRenderMenuItem = (
  // allRouters: AppRouteRecordRaw[] = [],
  menuMode: 'vertical' | 'horizontal',
) => {
  const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/',showBadge?:boolean) => {
    return routers.map((v) => {
      const meta = (v.meta ?? {}) as RouteMeta
      const isShowBadge = showBadge||v.name === "OnlineOrder"
      if (!meta.hidden) {
        const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)
        const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path) // getAllParentPath<AppRouteRecordRaw>(allRouters, v.path).join('/')

        const { renderMenuTitle } = useRenderMenuTitle()

        if (
          oneShowingChild &&
          (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
          !meta?.alwaysShow
        ) {
          return (
           <div class="flex flex-row items-center justify-center">
              <ElMenuItem class="flex flex-col items-center justify-center" index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}>
                {{
                  default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta, isShowBadge)
                }}
              </ElMenuItem>
           </div> 
            
          )
        } else {
          const { getPrefixCls } = useDesign()

          const preFixCls = getPrefixCls('menu-popper')
          return (
            <div class="flex flex-row items-center justify-center">
              <ElSubMenu
                index={fullPath}
                class="flex flex-col items-center justify-center"
                popperClass={
                  menuMode === 'vertical' ? `${preFixCls}--vertical` : `${preFixCls}--horizontal`
                }
              >
                {{
                  title: () => renderMenuTitle(meta, isShowBadge),
                  default: () => renderMenuItem(v.children!, fullPath, isShowBadge)
                }}
              </ElSubMenu>
            </div>
          )
        }
      }
    })
  }

  return {
    renderMenuItem
  }
}
