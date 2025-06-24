import request from '@/config/axios'

export interface StoreOrderElectronicsVO {
  id: number
  orderSn: string
  printTemplate: string
  kdnOrderCode: string
  logisticCode: string
  shipperCode: string
  order: string
  customerName: string
  customerPwd: string
  status: boolean
}

// 查询订单电子面单记录列表
export const getStoreOrderElectronicsPage = async (params: PageParam) => {
  return await request.get({ url: `/order/store-order-electronics/page`, params })
}

// 查询订单电子面单记录详情
export const getStoreOrderElectronics = async (id: number) => {
  return await request.get({ url: `/order/store-order-electronics/get?id=` + id })
}

// 新增订单电子面单记录
export const createStoreOrderElectronics = async (data: StoreOrderElectronicsVO) => {
  return await request.post({ url: `/order/store-order-electronics/create`, data })
}

// 修改订单电子面单记录
export const updateStoreOrderElectronics = async (data: StoreOrderElectronicsVO) => {
  return await request.put({ url: `/order/store-order-electronics/update`, data })
}

// 删除订单电子面单记录
export const deleteStoreOrderElectronics = async (id: number) => {
  return await request.delete({ url: `/order/store-order-electronics/delete?id=` + id })
}

// 导出订单电子面单记录 Excel
export const exportStoreOrderElectronics = async (params) => {
  return await request.download({ url: `/order/store-order-electronics/export-excel`, params })
}
