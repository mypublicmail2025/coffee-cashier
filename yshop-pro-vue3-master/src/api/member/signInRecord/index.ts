import request from '@/config/axios'

export interface SignInRecordVO {
  id: number
  userId: number
  integral: number
}

// 查询签到记录列表
export const getSignInRecordPage = async (params: PageParam) => {
  return await request.get({ url: `/member/sign-in-record/page`, params })
}

// 查询签到记录详情
export const getSignInRecord = async (id: number) => {
  return await request.get({ url: `/member/sign-in-record/get?id=` + id })
}

// 新增签到记录
export const createSignInRecord = async (data: SignInRecordVO) => {
  return await request.post({ url: `/member/sign-in-record/create`, data })
}

// 修改签到记录
export const updateSignInRecord = async (data: SignInRecordVO) => {
  return await request.put({ url: `/member/sign-in-record/update`, data })
}

// 删除签到记录
export const deleteSignInRecord = async (id: number) => {
  return await request.delete({ url: `/member/sign-in-record/delete?id=` + id })
}

// 导出签到记录 Excel
export const exportSignInRecord = async (params) => {
  return await request.download({ url: `/member/sign-in-record/export-excel`, params })
}
