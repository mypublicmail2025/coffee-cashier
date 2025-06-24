/**
 * @name: index.model
 * @author: kahu4
 * @date: 2024-01-29 12:18
 * @description：充值type
 * @update: 2024-01-29 12:18
 * */
export interface RechargeQuery extends PageParam {
  status?:RechargeStatusEnum
  createTime?:any,
  id?:any,
  nickname?:string
}

export interface RechargeVO {
  id:string
  userId:string
  status:number
  rechargeAmount:RechargeStatusEnum
  giftAmount:number
  packageId:any
  userName:string
  createTime:any
}

export enum RechargeStatusEnum {
  PENDING = 0, // 未支付
  SUCCESS = 1, // 已支付
}

/** 充值设置 */
export interface RechargeConfigModel{
  customSwitch:0|1 //自定义金额开关 0-关闭 1-开启
  customMin:number //自定义金额最小值
  content:string //自定义金额内容
  rechargePackageBaseVOS:RechargePackageBaseVO[]
}
export interface RechargePackageBaseVO{
  rechargeAmount:number
  giftAmount:number
  status:0|1 // 状态 0-关闭 1-开启
  id:any
  createTime:any
}
