import request from '@/config/axios'

export interface TagGroupVO {
  id: number
  groupName: string
  sorted: number
}

// 查询所有标签分组列表
export const getTagGroupList = async () => {
  return await request.get({ url: `/product/tag/group/list` })
}

// 新增标签分组
export const createTagGroup = async (data: TagGroupVO) => {
  return await request.post({ url: `/product/tag/group/create`, data })
}

// 修改标签分组
export const updateTagGroup = async (data: TagGroupVO) => {
  return await request.put({ url: `/product/tag/group/update`, data })
}

// 删除标签
export const deleteTagGroup = async (id: number) => {
  return await request.delete({ url: `/product/tag/group/delete/` + id })
}

