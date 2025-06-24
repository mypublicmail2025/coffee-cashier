import request from '@/config/axios'

// 查询订单规则设置
export const getOrderRule = async () => {
  return await request.get({ url: `/order/rule/get` })
}

// 更新订单规则设置
export const updateOrderRule = async (data) => {
  return await request.put({ url: `/order/rule/update`,data })
}


// 查询商场设置
export const getMallConfig = async () => {
  return await request.get({ url: `/system/dict-data/get-mall-config` })
}

// 更新商场设置
export const updateMallConfig = async (data) => {
  return await request.post({ url: `/system/dict-data/update-mall-config`,data })
}
