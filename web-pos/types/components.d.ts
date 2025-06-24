declare module '*.vue' {
  import {defineComponent} from 'vue'
  export interface GlobalComponents {
    Icon: typeof import('@/components/Icon')['Icon']
    DictTag: typeof import('@/components/DictTag')['DictTag']
  }
  export default defineComponent
}

export {}
