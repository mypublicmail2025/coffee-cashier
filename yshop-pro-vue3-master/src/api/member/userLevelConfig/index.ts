import request from '@/config/axios'

export interface UserLevelConfigVO {
  id: number
  levelName: string
  level: number
  growthValue: number
  iconUrl: string
  backgroundUrl: string
  status: boolean
  remarks: string
}

// 查询会员等级配置分页
export const getUserLevelConfigPage = async (params: PageParam) => {
  return await request.get({ url: `/member/user-level-config/page`, params })
}

// 查询会员等级配置详情
export const getUserLevelConfig = async (id: number) => {
  return await request.get({ url: `/member/user-level-config/get?id=` + id })
}

// 新增会员等级配置
export const createUserLevelConfig = async (data: UserLevelConfigVO) => {
  return await request.post({ url: `/member/user-level-config/create`, data })
}

// 修改会员等级配置
export const updateUserLevelConfig = async (data: UserLevelConfigVO) => {
  return await request.put({ url: `/member/user-level-config/update`, data })
}

// 删除会员等级配置
export const deleteUserLevelConfig = async (id: number) => {
  return await request.delete({ url: `/member/user-level-config/delete?id=` + id })
}

// 导出会员等级配置 Excel
export const exportUserLevelConfig = async (params) => {
  return await request.download({ url: `/member/user-level-config/export-excel`, params })
}


// 查询会员等级配置列表
export const getUserLevelConfigList = async () => {
  return await request.get({ url: `/member/user-level-config/listAll` })
}
