import request from '@/config/axios'

export interface UserTagVO {
  id: number
  tagName: string
  groupId: number
}

// 查询会员标签分页
export const getUserTagPage = async (params: PageParam) => {
  return await request.get({ url: `/member/user-tag/page`, params })
}

// 查询会员标签详情
export const getUserTag = async (id: number) => {
  return await request.get({ url: `/member/user-tag/get?id=` + id })
}

// 新增会员标签
export const createUserTag = async (data: UserTagVO) => {
  return await request.post({ url: `/member/user-tag/create`, data })
}

// 修改会员标签
export const updateUserTag = async (data: UserTagVO) => {
  return await request.put({ url: `/member/user-tag/update`, data })
}

// 删除会员标签
export const deleteUserTag = async (id: number) => {
  return await request.delete({ url: `/member/user-tag/delete?id=` + id })
}

// 导出会员标签 Excel
export const exportUserTag = async (params) => {
  return await request.download({ url: `/member/user-tag/export-excel`, params })
}

// 更新用户标签
export const updateMemberTags = async (data) => {
  return await request.post({ url: `/member/user/updateTag`, data })
}


// 查询会员标签列表
export const getUserTagList = async () => {
  return await request.get({ url: `/member/user-tag/list` })
}
