export interface OrderItem {
  id: number
  productId: number
  storeName: string
  image: string
  price: number
  cartNum: number
  spec: string
  skuUnique?: string
  stock?: number
  attrInfo?: any
}

export interface UserInfo {
  nickname: string
  phone: string
  avatar?: string
  uid: number
}

export interface Order {
  id: number
  orderNo: string
  orderId: number
  status: number // 0待接单 1已接单 2已完成 3已取消 4已拒绝
  createTime: string
  payTime: string
  payType: string
  totalPrice: number
  payPrice: number
  discountAmount: number
  deliveryFee?: number
  shippingType: number // 0堂食 1自提 2外送
  remark?: string
  userInfo?: UserInfo
  userAddress?: string
  items: OrderItem[]
}

export interface OrderListResponse {
  list: Order[]
  total: number
}

export interface OrderStatistics {
  pendingCount: number
  acceptedCount: number
  completedCount: number
  totalToday: number
  totalAmount: number
} 