import request from '@/config/axios'

export interface StoreCartVO {
  id: number
  uid: number
  type: string
  productId: number
  productAttrUnique: string
  cartNum: number
  isPay: boolean
  isNew: boolean
  combinationId: number
  seckillId: number
  bargainId: number
}

// 查询购物车列表
export const getStoreCartPage = async (params: PageParam) => {
  return await request.get({ url: `/cart/store-cart/page`, params })
}

// 查询购物车详情
export const getStoreCart = async (id: number) => {
  return await request.get({ url: `/cart/store-cart/get?id=` + id })
}

// 新增购物车
export const createStoreCart = async (data: StoreCartVO) => {
  return await request.post({ url: `/cart/store-cart/create`, data })
}

// 修改购物车
export const updateStoreCart = async (data: StoreCartVO) => {
  return await request.put({ url: `/cart/store-cart/update`, data })
}

// 删除购物车
export const deleteStoreCart = async (id: number) => {
  return await request.delete({ url: `/cart/store-cart/delete?id=` + id })
}

// 导出购物车 Excel
export const exportStoreCart = async (params) => {
  return await request.download({ url: `/cart/store-cart/export-excel`, params })
}
