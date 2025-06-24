import request from '@/config/axios'
import {
  CreateActivity,
  ActivityList,
  ActivityDataList,
  ResponList,
  ActivityProduct
} from '@/types/activity'
// 新增活动
export const createActivityApi = async (data: CreateActivity) => {
  return await request.post({ url: `/product/campaign-info/create`, data })
}

// 查询活动列表
export const getActivityPage = async (params): Promise<ResponList<ActivityList>> => {
  return await request.get({ url: `/product/campaign-info/page`, params })
}

// 查询活动商品列表
export const getActivityProductList = async (params): Promise<ResponList<ActivityProduct>> => {
  return await request.get({ url: `/product/store-product/campaign-product/page`, params })
}
// 查询活动详情
export const getStoreActivityInfo = async (id: number) => {
  return await request.get({ url: `/product/campaign-info/get?id=` + id })
}

// 结束活动
export const endingActivity = async (id: number) => {
  return await request.get({ url: `/product/campaign-info/close?id=` + id })
}

// 确认活动
export const confirmationActivity = async (id: number) => {
  return await request.get({ url: `/product/campaign-info/start?id=` + id })
}

// 修改活动
export const updateActivityApi = async (data) => {
  return await request.put({ url: `/product/campaign-info/update`, data })
}

// 删除活动
export const deleteStoreActivity = async (id: number) => {
  return await request.delete({ url: `/product/campaign-info/delete?id=` + id })
}

// 获取活动数据
export const getActivityData = async (id: number) => {
  return await request.get({ url: `/product/campaign-info/data?id=` + id })
}
// 查询活动商品数据列表
export const getActivityListData = async (params):Promise<ActivityDataList> => {
  return await request.get({ url: `/product/campaign-info/data-detail`, params })
}

// 查询拼团列表
export const getGroupPage = async (params) => {
  return await request.get({ url: `/product/teamwork-info/page`, params })
}
// 查询拼团详情
export const getGroupInfoList = async (params) => {
  return await request.get({ url: `/product/teamwork-info/order-page`, params })
}
