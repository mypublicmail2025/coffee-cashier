import request from '@/config/axios'

export interface UserLevelGrowthValueConfigVO {
  id: number
  type: string
  typeName: string
  growthValue: number
}

// 查询会员成长任务配置列表
export const getUserLevelGrowthValueConfigPage = async (params: PageParam) => {
  return await request.get({ url: `/member/user-level-growth-value-config/page`, params })
}

// 查询会员成长任务配置详情
export const getUserLevelGrowthValueConfig = async (id: number) => {
  return await request.get({ url: `/member/user-level-growth-value-config/get?id=` + id })
}

// 新增会员成长任务配置
export const createUserLevelGrowthValueConfig = async (data: UserLevelGrowthValueConfigVO) => {
  return await request.post({ url: `/member/user-level-growth-value-config/create`, data })
}

// 修改会员成长任务配置
export const updateUserLevelGrowthValueConfig = async (data: UserLevelGrowthValueConfigVO) => {
  return await request.put({ url: `/member/user-level-growth-value-config/update`, data })
}

// 删除会员成长任务配置
export const deleteUserLevelGrowthValueConfig = async (id: number) => {
  return await request.delete({ url: `/member/user-level-growth-value-config/delete?id=` + id })
}

// 导出会员成长任务配置 Excel
export const exportUserLevelGrowthValueConfig = async (params) => {
  return await request.download({ url: `/member/user-level-growth-value-config/export-excel`, params })
}

// 查询会员成长配置
export const getGrowthValueConfig = async () => {
  return await request.get({ url: `/member/user-level-growth-value-config/getGrowthValueConfig` })
}

// 保存会员成长配置
export const saveGrowthValueConfig = async (data) => {
  return await request.post({ url: `/member/user-level-growth-value-config/updateGrowthValueConfig`, data })
}
