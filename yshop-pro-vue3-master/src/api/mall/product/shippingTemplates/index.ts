import request from '@/config/axios'

export interface ShippingTemplatesVO {
  id: number
  name: string
  type: boolean
  regionInfo: string
  appoint: boolean
  appointInfo: string
  sort: number
}

// 查询运费模板列表
export const getShippingTemplatesPage = async (params: PageParam) => {
  return await request.get({ url: `/product/shipping-templates/page`, params })
}

// 查询运费模板详情
export const getShippingTemplates = async (id: number) => {
  return await request.get({ url: `/product/shipping-templates/get?id=` + id })
}

// 新增运费模板
export const createShippingTemplates = async (data,id) => {
  return await request.post({ url: `/product/shipping-templates/create/`+ id, data })
}

// 修改运费模板
export const updateShippingTemplates = async (data: ShippingTemplatesVO) => {
  return await request.put({ url: `/product/shipping-templates/update`, data })
}

// 删除运费模板
export const deleteShippingTemplates = async (id: number) => {
  return await request.delete({ url: `/product/shipping-templates/delete?id=` + id })
}

// 导出运费模板 Excel
export const exportShippingTemplates = async (params) => {
  return await request.download({ url: `/product/shipping-templates/export-excel`, params })
}
