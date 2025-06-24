import request from '@/config/axios'
// 查询分销订单列表
export const getDistributorOrderPage = async (params)=> {
  return await request.get({ url: `/distributor/order/page`, params })
}
// 获取订单详情
export const getDistributorOrderDetail = async (id: number)=> {
  return await request.get({ url: `/distributor/order/get?id=${id}`, })
}
