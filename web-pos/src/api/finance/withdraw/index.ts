/**
 * @name: index.ts
 * @author: kahu4
 * @date: 2024-01-29 12:18
 * @description：index.ts
 * @update: 2024-01-29 12:18
 * */
import request from '@/config/axios'
import { WithdrawAuditModel, WithdrawQuery, WithdrawVO } from "@/api/finance/withdraw/index.model";

export const getList = (params:WithdrawQuery) => request.get<PageVO<WithdrawVO>>({
  url:'/distributor/wages-log/verify-page',
  params
})


export const audit = (data:WithdrawAuditModel)=>request.post({
  url:'/distributor/wages-log/verify',
  data
})

export const exportExcel = () => request.download({
  url: '/distributor/wages-log/export-excel'
})

export const getById = (params:{id:any}) => request.get<any>({
  url:'/distributor/wages-log/get-verify',
  params
})
