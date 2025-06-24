import request from '@/config/axios'

export interface ElectronicsOrderVO {
  id: number
  shipperId: number
  paytype: boolean
  customerName: string
  customerPwd: string
  sendSite: string
  sendStaff: string
  monthCode: string
  isNotice: boolean
  isReturnTemp: boolean
  isSendMessage: boolean
  templateSize: string
  operateRequire: string
  logisticCode: string
  startDate: number
  endDate: number
  remark: string
  expType: boolean
  isReturnSignBill: boolean
  company: string
  provinceName: string
  cityName: string
  expAreaName: string
  address: string
  name: string
  tel: string
  mobile: string
  postCode: string
  title: string
}


// 查询列表
export const getElectronicsOrderList = async () => {
  return await request.get({ url: `/express/electronics-order/list` })
}


// 查询电子面单列表
export const getElectronicsOrderPage = async (params: PageParam) => {
  return await request.get({ url: `/express/electronics-order/page`, params })
}

// 查询电子面单详情
export const getElectronicsOrder = async (id: number) => {
  return await request.get({ url: `/express/electronics-order/get?id=` + id })
}

// 新增电子面单
export const createElectronicsOrder = async (data: ElectronicsOrderVO) => {
  return await request.post({ url: `/express/electronics-order/create`, data })
}

// 修改电子面单
export const updateElectronicsOrder = async (data: ElectronicsOrderVO) => {
  return await request.put({ url: `/express/electronics-order/update`, data })
}

// 删除电子面单
export const deleteElectronicsOrder = async (id: number) => {
  return await request.delete({ url: `/express/electronics-order/delete?id=` + id })
}

// 导出电子面单 Excel
export const exportElectronicsOrder = async (params) => {
  return await request.download({ url: `/express/electronics-order/export-excel`, params })
}
