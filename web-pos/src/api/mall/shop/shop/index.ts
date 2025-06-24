import request from '@/config/axios'

export interface ShopVO {
  id: number
  storeName: string
  storeIntro: string
  storePhone: string
  iconUrl: string
  address: string
  lon: object
  lat: object
  writeOffStartTime: Date
  writeOffEndTime: Date
  businessStartTime: Date
  businessEndTime: Date
  status: boolean
}

// 查询门店列表
export const getShopPage = async (params: PageParam) => {
  return await request.get({url: `/mall/shop/cashier/page`, params })
}

// 查询门店详情
export const getShop = async (id: number) => {
  return await request.get({ url: `/mall/shop/get?id=` + id })
}

// 新增门店
export const createShop = async (data: ShopVO) => {
  return await request.post({ url: `/mall/shop/create`, data })
}

// 修改门店
export const updateShop = async (data: ShopVO) => {
  return await request.put({ url: `/mall/shop/update`, data })
}

// 删除门店
export const deleteShop = async (id: number) => {
  return await request.delete({ url: `/mall/shop/delete?id=` + id })
}

// 导出门店 Excel
export const exportShop = async (params) => {
  return await request.download({ url: `/mall/shop/export-excel`, params })
}
