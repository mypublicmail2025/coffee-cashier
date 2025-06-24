import request from '@/config/axios'

export interface AdvertsVO {
  id: number
  name: string
}

// 查询广告列表
export const getAdvertsPage = async (params: PageParam) => {
  return await request.get({ url: `/shop/popup/page`, params })
}

// 新增广告信息
export const createAdverts = async (data: AdvertsVO) => {
  return await request.post({ url: `/shop/popup/create`, data })
}

// 修改广告信息
export const updateAdverts = async (data: AdvertsVO) => {
  return await request.put({ url: `/shop/popup/update`, data })
}

// 删除广告信息
export const deleteAdverts = async (id: number) => {
  return await request.delete({ url: '/shop/popup/delete?id=' + id })
}

// 获取广告信息
export const getAdverts = async (id: number) => {
  return await request.get({ url: '/shop/popup/get?id=' + id })
}
