import request from '@/config/axios'


// 查询埋点统计
export const getBuryPointChart = () => {
  return request.get({ url: '/member/bury-point/get-trend-chart' })
}
// 查询订单统计
export const getStoreOrderChart = () => {
  return request.get({ url: '/order/store-order/get-trend-chart ' })
}
