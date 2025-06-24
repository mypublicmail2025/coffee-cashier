import request from '@/config/axios'

export interface UserTagGroupVO {
  id: number
  groupName: string
  sorted: number
}

// 查询会员标签分组列表
export const getUserTagGroupPage = async (params: PageParam) => {
  return await request.get({ url: `/member/user-tag-group/page`, params })
}

// 查询所有会员标签分组列表
export const getAllGroupPage = async () => {
  return await request.get({ url: `/member/user-tag-group/list` })
}

// 查询会员标签分组详情
export const getUserTagGroup = async (id: number) => {
  return await request.get({ url: `/member/user-tag-group/get?id=` + id })
}

// 新增会员标签分组
export const createUserTagGroup = async (data: UserTagGroupVO) => {
  return await request.post({ url: `/member/user-tag-group/create`, data })
}

// 修改会员标签分组
export const updateUserTagGroup = async (data: UserTagGroupVO) => {
  return await request.put({ url: `/member/user-tag-group/update`, data })
}

// 删除会员标签分组
export const deleteUserTagGroup = async (id: number) => {
  return await request.delete({ url: `/member/user-tag-group/delete?id=` + id })
}

// 导出会员标签分组 Excel
export const exportUserTagGroup = async (params) => {
  return await request.download({ url: `/member/user-tag-group/export-excel`, params })
}
