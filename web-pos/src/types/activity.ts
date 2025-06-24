export interface ResponList<T> {
  list: T[]
  total: number
}
export interface Detail {
  productId: number;
  skuId: number;
  price: number;
  discount: number;
  stock: number;
}

// 活动商品规格
export interface SkuResp {
  skuId: number
  productId: number
  sku?: string
  image?: string
  price: number
  discount: number
  stock: number
}
// 新增活动
export interface CreateActivity {
  id: number | null
  name: string;
  type: number;
  remark: string;
  startTime: number | null;
  endTime: number | null;
  ifLimit: number;
  limitNumber?: number;
  ifEnable: number;
  ifAdd?: number;
  person?: number
  shopId?: number
  effectiveTime?: number
  enableTime?: number,
  isVirtually?: number;
  details: SkuResp[];
}

// 活动列表
export interface ActivityList {
  createTime: number;
  endTime: number;
  id: number;
  name: string;
  orderQuantity: number;
  salesAmount: number;
  salesQuantity: number;
  startTime: number;
  state: number;
}


// 活动列表参数
export interface QueryParams {
  pageNo: number
  pageSize: number
  name: string
  createTime: any
  type: number
  state?: number
}
// 活动商品
export interface ActivityProduct {
  id: number | null
  image: string
  storeName: string
  price: number
  stock: number
  specType: number
  originalStock?: number
  skus: SkuResp[]
}
// 活动商品数据列表
export interface ActivityDataList {
  skuId: number;
  unique: string;
  productName: string;
  sku: string;
  image: string;
  dealAmount: number;
  dealQuantity: number;
  peopleNumber: number;
  productQuantity: number;
  averagePrice: number;
}

// 拼团活动列表
export interface GroupData {
  id: number;
  campaignId: number;
  campaignDetailId: number;
  joinNumber: number;
  person: number;
  state: number;
  regimentalCommander: string;
  createTime: string;
}
export interface GroupUserData {
  nickname: string;
  avatar: string;
  orderId: string;
  price: number;
}
