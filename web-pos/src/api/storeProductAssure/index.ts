import request from '@/config/axios'

export interface StoreProductAssureVO {
    id: number
    name: string
    content: string
    sorted: number
    status: number
}

// 查询商品保障服务列表
export const getStoreProductAssurePage = async (params) => {
    return await request.get({url: `/yshop/store-product-assure/page`, params})
}

// 查询商品保障服务详情
export const getStoreProductAssure = async (id: number) => {
    return await request.get({url: `/yshop/store-product-assure/get?id=` + id})
}

// 新增商品保障服务
export const createStoreProductAssure = async (data: StoreProductAssureVO) => {
    return await request.post({url: `/yshop/store-product-assure/create`, data})
}

// 修改商品保障服务
export const updateStoreProductAssure = async (data: StoreProductAssureVO) => {
    return await request.put({url: `/yshop/store-product-assure/update`, data})
}

// 删除商品保障服务
export const deleteStoreProductAssure = async (id: number) => {
    return await request.delete({url: `/yshop/store-product-assure/delete?id=` + id})
}

// 导出商品保障服务 Excel
export const exportStoreProductAssure = async (params) => {
    return await request.download({url: `/yshop/store-product-assure/export-excel`, params})
}
