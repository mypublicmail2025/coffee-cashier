/**
 * @name: index.ts
 * @author: kahu4
 * @date: 2024-01-29 12:18
 * @description：index.ts
 * @update: 2024-01-29 12:18
 * */
import request from '@/config/axios'
import {
  RechargeConfigModel,
  RechargeQuery,
  RechargeVO
} from "@/api/finance/recharge/index.model";

export const getList = (params:RechargeQuery)=>request.get<PageVO<RechargeVO>>({
  url:'/order/recharge-order/page',
  params
})

/**
 * 获取配置
 */
export const getRechargeRule = ()=>request.get<RechargeConfigModel>({
  url:'/order/recharge-config/get-all-config',
})


/**
 * 设置配置
 * @param data
 */
export const setRechargeRule = (data:RechargeConfigModel)=>request.post({
  url:'/order/recharge-config/update-all-config',
  data
})
