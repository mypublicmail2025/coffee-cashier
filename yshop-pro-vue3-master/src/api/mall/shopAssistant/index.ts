import request from '@/config/axios'

export interface ShopAssistantVO {
  id: number
  storeId: number
  userId: number
  name: string
  phoneNo: string
  status: boolean
}

// 查询门店店员列表
export const getShopAssistantPage = async (params: PageParam) => {
  return await request.get({ url: `/mall/shop-assistant/page`, params })
}

// 查询门店店员详情
export const getShopAssistant = async (id: number) => {
  return await request.get({ url: `/mall/shop-assistant/get?id=` + id })
}

// 新增门店店员
export const createShopAssistant = async (data: ShopAssistantVO) => {
  return await request.post({ url: `/mall/shop-assistant/create`, data })
}

// 修改门店店员
export const updateShopAssistant = async (data: ShopAssistantVO) => {
  return await request.put({ url: `/mall/shop-assistant/update`, data })
}

// 删除门店店员
export const deleteShopAssistant = async (id: number) => {
  return await request.delete({ url: `/mall/shop-assistant/delete?id=` + id })
}

// 导出门店店员 Excel
export const exportShopAssistant = async (params) => {
  return await request.download({ url: `/mall/shop-assistant/export-excel`, params })
}
// 查询门店店员列表
export const getShopUserList = async (params) => {
  return await request.get({ url: `/member/user/userList`, params })
}

// 查询门店店员列表
export const getShopList = async (params?) => {
  return await request.get({ url: `/mall/shop/shopList`, params })
}
