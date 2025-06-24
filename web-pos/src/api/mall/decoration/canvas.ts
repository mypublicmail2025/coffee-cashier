import request from '@/config/axios'

export interface CanvasVO {
  id: number
  name: string
}

// 查询画布信息列表
export const getCanvasPage = async (params: PageParam) => {
  return await request.get({ url: `/shop/canvas/page`, params })
}

// 新增画布信息
export const createCanvas = async (data: CanvasVO) => {
  return await request.post({ url: `/shop/canvas/create`, data })
}

// 修改画布信息
export const updateCanvas = async (data: CanvasVO) => {
  return await request.put({ url: `/shop/canvas/update`, data })
}

// 删除画布信息
export const deleteCanvas = async (id: number) => {
  return await request.delete({ url: '/shop/canvas/delete?id=' + id })
}

// 获取画布信息
export const getCanvas = async (id: number) => {
  return await request.get({ url: '/shop/canvas/get?id=' + id })
}

// 导出画布信息 Excel
export const exportCanvasExcel = async (params) => {
  return await request.download({ url: `/shop/canvas/export-excel`, params })
}

// 设为首页
export const setCanvasIndex = async (id) => {
  return await request.put({ url: '/shop/canvas/set-index?id=' + id })
}

// 修改状态
export const setCanvasState = async (id) => {
  return await request.post({ url: '/shop/canvas/update-status?id=' + id })
}
