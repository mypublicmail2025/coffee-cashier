import request from '@/config/axios'

export interface StoreAfterSalesVO {
  id: number
  orderCode: string
  refundAmount: number
  serviceType: boolean
  reasons: string
  explains: string
  explainImg: string
  shipperCode: string
  deliverySn: string
  deliveryName: string
  state: boolean
  salesState: boolean
  userId: number
  consignee: string
  phoneNumber: string
  address: string
}

// 查询售后记录列表
export const getStoreAfterSalesPage = async (params: PageParam) => {
  return await request.get({ url: `/order/store-after-sales/page`, params })
}

// 查询售后记录详情
export const getStoreAfterSales = async (id: number) => {
  return await request.get({ url: `/order/store-after-sales/get?id=` + id })
}

// 新增售后记录
export const createStoreAfterSales = async (data: StoreAfterSalesVO) => {
  return await request.post({ url: `/order/store-after-sales/create`, data })
}

// 修改售后记录
export const updateStoreAfterSales = async (data: StoreAfterSalesVO) => {
  return await request.put({ url: `/order/store-after-sales/update`, data })
}

// 删除售后记录
export const deleteStoreAfterSales = async (id: number) => {
  return await request.delete({ url: `/order/store-after-sales/delete?id=` + id })
}

export const payStoreAfterSales = async (id: number) => {
  return await request.get({ url: `/order/store-after-sales/pay?id=` + id })
}

// 导出售后记录 Excel
export const exportStoreAfterSales = async (params) => {
  return await request.download({ url: `/order/store-after-sales/export-excel`, params })
}
