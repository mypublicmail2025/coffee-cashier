import request from '@/config/axios'
import {DistributorDetail} from "@/types/distributor";
// 查询分销商列表
export const getDistributorPage = async (params)=> {
  return await request.get({ url: `/distributor/distributor/page`, params })
}
// 审核分销商
export const auditDistributorApi = async (data)=> {
  return await request.post({ url: `/distributor/distributor/verify`, data })
}

// 获取分销商详情
export const getDistributorDetail = async (id: number):Promise<DistributorDetail> => {
  return await request.get({ url: '/distributor/distributor/get?id=' + id })
}
// 清退分销商
export const checkDistributorApi = async (data)=> {
  return await request.post({ url: `/distributor/distributor/clearance`, data })
}
// 删除分销商
export const removalOfDistributorApi = async (id: number)=> {
  return await request.delete({ url: `/distributor/distributor/delete?id=${id}` })
}
// 佣金列表
export const getWagesLogPage = async (params)=> {
  return await request.get({ url: `/distributor/wages-log/page`, params })
}

// 更新分销商
export const updateDistributor = async (data)=> {
  return await request.put({ url: `/distributor/distributor/update`, data })
}
