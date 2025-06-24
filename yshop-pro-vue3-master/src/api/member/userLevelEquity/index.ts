import request from '@/config/axios'

export interface UserLevelEquityVO {
  id: number
  type: string
  typeName: string
  equityValue: number
  iconUrl: string
}

// 查询会员等级权益配置列表
export const getUserLevelEquityPage = async (params: PageParam) => {
  return await request.get({ url: `/member/user-level-equity/page`, params })
}

// 查询会员等级所有权益
export const getAllLevelEquityPage = async () => {
  return await request.get({ url: `/member/user-level-equity/list` })
}

// 查询会员等级权益配置详情
export const getUserLevelEquity = async (id: number) => {
  return await request.get({ url: `/member/user-level-equity/get?id=` + id })
}

// 新增会员等级权益配置
export const createUserLevelEquity = async (data: UserLevelEquityVO) => {
  return await request.post({ url: `/member/user-level-equity/create`, data })
}

// 修改会员等级权益配置
export const updateUserLevelEquity = async (data: UserLevelEquityVO) => {
  return await request.put({ url: `/member/user-level-equity/update`, data })
}

// 删除会员等级权益配置
export const deleteUserLevelEquity = async (id: number) => {
  return await request.delete({ url: `/member/user-level-equity/delete?id=` + id })
}

// 导出会员等级权益配置 Excel
export const exportUserLevelEquity = async (params) => {
  return await request.download({ url: `/member/user-level-equity/export-excel`, params })
}
