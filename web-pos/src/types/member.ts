// 会员积分规则
interface RuleListItem {
  attribute1: string,
  enable: boolean,
  integral: number,
  type: string,
  typeName: string
}

export interface FormData {
  integralName: string,
  integralEnable: string,
  integralDeductionRule: number,
  ruleList: RuleListItem[],
  integral: number,
  attribute1: string | undefined,
  checkInScore: number
}

// 会员标签

export interface GroupItem {
  groupName: string; // 分组名称
  id: number;        // 用户id
  createTime: string; // 添加时间
}
