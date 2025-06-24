import request from '@/config/axios'
import { OrderSearchParams } from '../types'


export interface OnlineOrderQueryParams {
  page: number
  limit: number
  shippingType?: number // 0堂食 1自提 2外送
  status?: number // 0待接单 1已接单 2已完成 3已取消 4已拒绝
  keyword?: string
  dateRange?: string[]
}

//轮询获取待接单订单
export const getOnlineOrderPending = async (data:any) => {
  // const formData = new FormData();
  // formData.append('shopId', data.shopId);
  return await request.post({
    url: `/order/store-order/cashier/waitOrderList`, 
    data:data,
    headersType: 'application/x-www-form-urlencoded'
   
})
}

// 接受订单
export const acceptOrder = async (ids: number[]) => {
  return await request.post({url: `/order/store-order/cashier/batchAccept`, data: {ids: ids } })
}

// 拒绝订单
export const rejectOrder = async (id: number) => {
  return await request.post({ 
    url: `/order/store-order/cashier/batchReject`, 
    data: {ids: id } 
  })
}

// 订单制作完成
export const makeFinishOrder = async (ids: number[]) => {
  return await request.post({url: `/order/store-order/cashier/makeFinish`, data: {ids} })
}

// 完成订单
export const completeOrder = async (ids: number[]) => {
  return await request.post({url: `/order/store-order/cashier/close`, data: {ids} })
}

// 订单批量拒单
export const batchRejectOrder = async (ids: number[]) => {
  return await request.post({url: `/order/store-order/cashier/batchReject`, data: {ids} })
}

// 订单批量接单
export const batchAcceptOrder = async (ids: number[]) => {
  return await request.post({url: `/order/store-order/cashier/batchAccept`, data: {ids} })
}

// 订单批量接单
export const printReceipt = async (id: number) => {
  return await request.post({url: `/order/store-order/cashier/print/${id}` })
}

// 订单列表
export const getOrderList = async (params: OrderSearchParams) => {
  return await request.post({url: '/order/store-order/cashier/page', data:params })
}

// 获取订单详情
export const getOrderDetail = async (id: number) => {
  return await request.get({url: `/order/store-order/cashier/detail`, params: {id} })
}

// 修改订单备注
export const updateOrderRemark = async (id: number, remark: string) => {
  return await request.post({ 
    url: `/order/online-order/remark/${id}`, 
    data: { remark } 
  })
} 

// 核销订单
export const verifyOrder = async (orderId: number, writeOffCode: string) => {
  return await request.post({ 
    url: `/order/store-order/cashier/writeOff`, 
    data: {orderId, writeOffCode } 
  })
} 

// 获取每个状态的订单数量
export const getEachStatusOrderCount = async (shopId: number) => {
  return await request.get({ 
    url: `/order/store-order/order/status/count?shopId=${shopId}`, 
  })
} 


// 获取闪送位置
export const getShansongLocation = async (id: number) => {
  return await request.get({ 
    url: `/order/store-order/cashier/shansong/location?orderId=${id}`, 
  })
} 


export interface OrderListParams {
  page: number
  limit: number
  status: number
  keyword: string
}

export interface ShansongLocationParams {
  longitude: string
  latitude: string
  name: string
  mobile: string
  time: string
  headIcon: string
  id: string
  estimateDeliveryTimeTip: string
}