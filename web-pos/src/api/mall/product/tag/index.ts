import request from '@/config/axios'

interface tagParam {
  isPage?: number
}

export interface TagVO {
  id: number
  tagName: string
  groupId: number
}

// 查询会员标签列表
export const getTagPage = async (params: tagParam) => {
  return await request.get({ url: `/product/tag/page`, params })
}

// 查询会员标签详情
// export const getUserTag = async (id: number) => {
//   return await request.get({ url: `/member/user-tag/get?id=` + id })
// }

// 新增会员标签
export const createTag = async (data: TagVO) => {
  return await request.post({ url: `/product/tag/create`, data })
}

// 修改会员标签
export const updateTag = async (data: TagVO) => {
  return await request.put({ url: `/product/tag/update`, data })
}

// 删除会员标签
export const deleteTag = async (id: number) => {
  return await request.delete({ url: `/product/tag/delete/` + id })
}
