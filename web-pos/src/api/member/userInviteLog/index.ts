import request from '@/config/axios'

export interface UserInviteLogVO {
  id: number
  userId: number
  beInviteUserId: number
}

// 查询邀请日志列表
export const getUserInviteLogPage = async (params: PageParam) => {
  return await request.get({ url: `/member/user-invite-log/page`, params })
}

// 查询邀请日志详情
export const getUserInviteLog = async (id: number) => {
  return await request.get({ url: `/member/user-invite-log/get?id=` + id })
}

// 新增邀请日志
export const createUserInviteLog = async (data: UserInviteLogVO) => {
  return await request.post({ url: `/member/user-invite-log/create`, data })
}

// 修改邀请日志
export const updateUserInviteLog = async (data: UserInviteLogVO) => {
  return await request.put({ url: `/member/user-invite-log/update`, data })
}

// 删除邀请日志
export const deleteUserInviteLog = async (id: number) => {
  return await request.delete({ url: `/member/user-invite-log/delete?id=` + id })
}

// 导出邀请日志 Excel
export const exportUserInviteLog = async (params) => {
  return await request.download({ url: `/member/user-invite-log/export-excel`, params })
}
