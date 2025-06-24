import type { RouteMeta } from 'vue-router'
import { ElBadge } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useAppStore } from '@/store/modules/app'
export const useRenderMenuTitle = () => {
  const appStore = useAppStore()
  const {t} = useI18n()

  const renderBadge = (meta: RouteMeta,showBadge?:boolean) => {
    const {title = '-' } = meta
    const eachStatusOrderCount = appStore.eachStatusOrderCount?.pendingOrders || 0;
    const isShowBadge = showBadge && eachStatusOrderCount > 0 ;
    if (isShowBadge) {
      return <ElBadge value={eachStatusOrderCount} class="">
        <div class="flex flex-col items-center justify-center">
          <Icon icon={meta.icon} size={20}></Icon>
          <span class="v-menu__title ">{t(title as string)}</span>
        </div>
      </ElBadge>
    } else {
      return <>
        <Icon icon={meta.icon} size={20}></Icon>
        <span class="v-menu__title ">{t(title as string)}</span>
      </>
    }
  }
  const renderMenuTitle = (meta: RouteMeta,showBadge?:boolean) => {
    const {title, icon} = meta
    return icon ? (
      renderBadge(meta,showBadge)
    ) : (
      <span class="v-menu__title">{t(title as string)}</span>
    )
  }

  return {
    renderMenuTitle
  }
}
