/**
 * @name: index.model
 * @author: kahu4
 * @date: 2024-01-29 12:18
 * @description：index.model
 * @update: 2024-01-29 12:18
 * */

export interface WithdrawQuery extends PageParam{
  userName?:string
  type?:WidthType
  createTime?:any,
  distributorName?: string
}

export interface WithdrawVO{
  wagesId:string
  userId:string
  type:WidthType
  amount:number
  distributorId:number
  userName:string
  distributorName:string
  methodType:MethodType
  id:number
  createTime:string
  accountNum: number
  content: string
}

export enum MethodType{
  BALANCE,
  ALI_PAY
}

export enum WidthType{
  WAIT, // 待入账
  COMPLETE, // 已入账
  CANCEL, // 已取消
  WITHDRAW_WAIT, // 提现中
  WITHDRAW_COMPLETE, // 提现成功
  WITHDRAW_FAIL // 提现失败
}

export interface WithdrawAuditModel{
  id:any,
  content:string,
  type:4|5 // 4通过 5拒绝
}
