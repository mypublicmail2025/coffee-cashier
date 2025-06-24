import request from '@/config/axios'
import {CreateLevel, LevelData, LevelListItem, ResponList} from "@/types/distributor";
// 查询分销商等级列表
export const getLevelPage = async (params):Promise<ResponList<LevelListItem>> => {
  return await request.get({ url: `/distributor/level/page`, params })
}

// 创建分销等级
export const createLevelApi = async (data: CreateLevel)=> {
  return await request.post({ url: `/distributor/level/create`, data })
}

// 修改分销等级
export const updateLevelApi = async (data: CreateLevel)=> {
  return await request.put({ url: `/distributor/level/update`, data })
}
// 删除等级
// export const deleteLevel = async (id: number) => {
//   return await request.delete({ url: `/distributor/level/delete?id=` + id })
// }

// 获取已有分销商等级
export const getHaveLevelApi = async ()=> {
  return await request.get({ url: `/distributor/level/get-all` })
}
// 获取分销商等级
export const getLevelDetail = async (id: number):Promise<LevelData> => {
  return await request.get({ url: '/distributor/level/get?id=' + id })
}

// 获取全部分销商等级
export const getLevelListAll = async ()=> {
  return await request.get({ url: `/distributor/level/listAll` })
}
