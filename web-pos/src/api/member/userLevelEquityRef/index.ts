import request from '@/config/axios'

export interface UserLevelEquityRefVO {
  id: number
  levelId: number
  equityId: number
}

// 查询会员等级权益中间列表
export const getUserLevelEquityRefPage = async (params: PageParam) => {
  return await request.get({ url: `/member/user-level-equity-ref/page`, params })
}

// 查询会员等级权益中间详情
export const getUserLevelEquityRef = async (id: number) => {
  return await request.get({ url: `/member/user-level-equity-ref/get?id=` + id })
}

// 新增会员等级权益中间
export const createUserLevelEquityRef = async (data: UserLevelEquityRefVO) => {
  return await request.post({ url: `/member/user-level-equity-ref/create`, data })
}

// 修改会员等级权益中间
export const updateUserLevelEquityRef = async (data: UserLevelEquityRefVO) => {
  return await request.put({ url: `/member/user-level-equity-ref/update`, data })
}

// 删除会员等级权益中间
export const deleteUserLevelEquityRef = async (id: number) => {
  return await request.delete({ url: `/member/user-level-equity-ref/delete?id=` + id })
}

// 导出会员等级权益中间 Excel
export const exportUserLevelEquityRef = async (params) => {
  return await request.download({ url: `/member/user-level-equity-ref/export-excel`, params })
}
