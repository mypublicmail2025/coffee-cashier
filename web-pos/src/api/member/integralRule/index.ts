import request from '@/config/axios'

export interface IntegralRuleVO {
  id: number
  type: string
  typeName: string
  integral: number
  attribute1: string
}

// 查询会员积分规则列表
export const getIntegralRulePage = async (params: PageParam) => {
  return await request.get({ url: `/member/integral-rule/page`, params })
}

// 查询会员积分规则详情
export const getIntegralRule = async (id: number) => {
  return await request.get({ url: `/member/integral-rule/get?id=` + id })
}

// 新增会员积分规则
export const createIntegralRule = async (data: IntegralRuleVO) => {
  return await request.post({ url: `/member/integral-rule/create`, data })
}

// 修改会员积分规则
export const updateIntegralRule = async (data: IntegralRuleVO) => {
  return await request.put({ url: `/member/integral-rule/update`, data })
}

// 删除会员积分规则
export const deleteIntegralRule = async (id: number) => {
  return await request.delete({ url: `/member/integral-rule/delete?id=` + id })
}

// 导出会员积分规则 Excel
export const exportIntegralRule = async (params) => {
  return await request.download({ url: `/member/integral-rule/export-excel`, params })
}

// 保存会员积分规则
export const saveIntegralRule = async (data) => {
  return await request.post({ url: `/member/integral-rule/saveRule`, data })
}
export const getIntegrationRule = async () => {
  return await request.get({ url: `/member/integral-rule/getRule` })
}
