import request from '@/config/axios'

export interface DiscountCouponVO {
    couponName: string
    couponScope: number
    couponType: number
    couponValue: string | null
    createTime: number
    creator: string
    deleted: false
    discount: number
    expirationDay: number
    expirationTime: number | null
    expirationType: number
    id?: number
    limitNumber: number
    number: number
    receiveType: number
    remark:string
    scopeValues: string | null
    status: number | null
    takingEffectTime: number | null
    threshold: number
    updateTime: number
    updater: string
}

// 查询优惠券列表
export const getDiscountCouponPage = async (params: PageParam) => {
    return await request.get({ url: `/product/coupon/page`, params })
}

// 查询优惠券详情
export const getDiscountCoupon = async (id) => {
    return await request.get({ url: `/product/coupon/detail/` + id })
}

// 新增优惠券
export const createDiscountCoupon = async (data) => {
    return await request.post({ url: `/product/coupon/create`, data })
}

// 修改优惠券
export const updateDiscountCoupon = async (data) => {
    return await request.post({ url: `/product/coupon/update`, data })
}

// 删除优惠券
export const deleteDiscountCoupon = async (id: number) => {
    return await request.delete({ url: `/product/coupon/delete/` + id })
}

// 查询可用画布优惠券列表
export const getCanvasCouponPage = async (params: PageParam) => {
  return await request.get({ url: `/product/coupon/canvas/page`, params })
}

// 查询发放记录列表
export const getCouponRecordPage = async (params: PageParam) => {
  return await request.get({ url: `/product/coupon/record`, params })
}

// 删除优惠券兑换码
export const delCouponCdkey = async (ids) => {
  return await request.delete({
    url: '/product/coupon/delete/cdkey/' + ids
  })
}

// 导出发放记录
export const exportCdkeyExcel = (params) => {
  return request.download({ url: '/product/coupon/cdkey/export-excel', params })
}

// 发送优惠券
export const sendCoupon = async (data) => {
  return await request.post({ url: `/product/coupon/send-coupon`, data })
}
