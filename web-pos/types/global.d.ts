export {}
declare global {
  interface Window {
    _AMapSecurityConfig: any
  }

  interface Fn<T = any> {
    (...arg: T[]): T
  }

  type Nullable<T> = T | null

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  type ComponentRef<T> = InstanceType<T>

  type LocaleType = 'zh-CN' | 'en'

  type AxiosHeaders =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'

  type AxiosMethod = 'get' | 'post' | 'delete' | 'put' | 'GET' | 'POST' | 'DELETE' | 'PUT'

  type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headersType?: string
    responseType?: AxiosResponseType
  }

  interface IResponse<T = any> {
    code: string
    data: T extends any ? T : T & any
  }

  interface PageVO<T=any>{
    list: T[]
    total: number
  }

  interface PageParam {
    pageSize?: number
    pageNo?: number
    realName?: string
    userPhone?: string
    orderId?: string
  }

  interface Tree {
    id: number
    name: string
    children?: Tree[] | any[]
  }
}
