import request from '@/config/axios'
import { OfflineOrderParams } from './types'

/**
 * 创建线下订单
 * @param params - 线下订单参数
 * @returns Promise
 */
export const createOfflineOrder = (params: OfflineOrderParams) => {
  return request.post({ url: '/order/offline/create', data: params })
} 