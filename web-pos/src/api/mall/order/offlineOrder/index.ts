import request from '@/config/axios'

// 创建线下订单
export const createOfflineOrder = async (params: OfflineOrderParams) => {
    return await request.post({url: `/order/store-order/createCashierOrder`, data:params})
}


// 修改产品数量
export const updateProductQuantity = async (params: UpdateProductQuantityParams) => {
    return await request.post({url: `/cart/store-cart/num`, data: params})
}

// 修改产品规格
export const changeSku = async (params: ChangeSkuParams) => {
    return await request.post({url: `/cart/store-cart/cart/changeSku`, data: params})
}

// 添加购物车
export const createStoreCart = async (params: CreateStoreCartParams) => {
    return await request.post({url: `/cart/store-cart/add`, data: params})
}


// 获取购物车数量
export const getStoreCartNum = async (consumerId: number) => {
    return await request.get({url: `/cart/store-cart/count/${consumerId}`})
}


// 获取购物车列表
export const getStoreCartList= async (consumerId: number) => {
    return await request.get({url: `/cart/store-cart/cart/list/${consumerId}`})
}


// 删除购物车
export const delStoreCart = async (id: number) => {

    return await request.delete({url: `/cart/store-cart/cashier/delete`, headersType: 'application/x-www-form-urlencoded', data: {id: id}})
}


// 统一支付
export const cashierPay = async (data: OfflineOrderPayParams) => {
    return await request.post({url: `/cashier/pay/payment`, data: data})
}



export interface OfflineOrderParams {
  cartId: string;           // 购物车ID
  shippingType: number;     // 配送类型，0表示自提/堂食
  storeId: number;          // 门店ID
  userId: number;           // 用户ID
  payType: string;          // 支付类型（微信支付、支付宝、现金等）
  useIntegral: boolean;     // 是否使用积分
  manualPrice?: number;      // 手动调整价格
  discount?: number;         // 优惠金额
  paidAmount?: number;         // 优惠金额
  changeAmount?: number;         // 优惠金额
  remark: string;           // 订单备注
  from: string;           // 订单来源
}



export interface UpdateProductQuantityParams {
    id: string;           // 购物车ID
    number: number;   
    userId: number; // 用户ID
    
}
export interface ChangeSkuParams {
    id: string;           // 购物车ID
    productId: number;     // 商品ID
    productAttrUnique: string;     // 商品sku规格unique
    
}


export interface ChangeSkuParams {
    id: string;           // 购物车ID
    productId: number;     // 商品ID
    productAttrUnique: string;     // 商品sku规格unique

}


/**
 * 统一支付
 * 
*/
export interface OfflineOrderPayParams {

    from: string;
    payType: string;
    orderId: string;
    helpPay: boolean;
    authCode: string;
}

export interface CreateStoreCartParams {
    
    //购物车数量
    cartNum: number;
    //产品ID
    productId: number;
    //商品属性sku的unique值
    uniqueId: string;
    //产品拼团ID
    combinationId: number;
    //产品秒杀ID
    secKillId: number;
    //产品砍价ID
    bargainId: number;
    //积分商城活动ID
    integralShopId: number;
    //下单类型：1、普通下单，2、商品活动下单
    orderType: number;
    //活动id
    campaignId: number;
    //拼团id
    teamworkId: number;
    //是否立即购买1-是 0-否表示加入购物车列表
    new: number;
    //会员id
    userId: number;
}