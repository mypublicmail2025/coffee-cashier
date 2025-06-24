/**
 * 订单相关接口参数类型定义
 */

/**
 * 线下订单创建参数
 */
export interface OfflineOrderParams {
  /**
   * 购物车ID
   */
  cartId: string;
  
  /**
   * 配送类型
   * 0: 自提/堂食
   */
  shippingType: number;
  
  /**
   * 门店ID
   */
  storeId: number;
  
  /**
   * 用户ID
   */
  userId: number;
  
  /**
   * 支付类型
   * 微信支付，支付宝，现金等
   */
  payType: string;
  
  /**
   * 是否使用积分
   */
  useIntegral: boolean;
  
  /**
   * 手动调整价格
   */
  manualPrice: number;
  
  /**
   * 优惠金额
   */
  discount: number;
  
  /**
   * 订单备注
   */
  remark: string;
} 


/**
 * 订单搜索参数
 */
export interface OrderSearchParams {
  /**
   * 当前页码
   */
  pageNo: number;
  
  /**
   * 每页条数
   */
  pageSize: number;
  
  /**
   * 订单ID
   */
  orderId?: string;
  
  /**
   * 用户姓名
   */
  realName?: string;
  
  /**
   * 用户手机号
   */
  userPhone?: string;
  
  /**
   * 创建时间范围
   */
  createTime?: string[];
  
  /**
   * 订单状态
   * 0: 待付款
   * 1: 待发货
   * 2: 待收货
   * 3: 待评价
   * 4: 已完成
   * 5: 已取消
   */
  orderStatus?: number;
  
  /**
   * 订单状态集合（用于多选）
   */
  orderStatusSet?: number[];
  
  /**
   * 支付状态
   * 0: 未支付
   * 1: 已支付
   */
  payStatus?: string | number;
  
  /**
   * 配送类型
   * 0: 堂食
   * 1: 自提
   * 2: 外送
   */
  shippingType?: number;
  
  /**
   * 配送类型集合（用于多选）
   */
  shippingTypeSet?: number[];
  
  /**
   * 核销状态
   * 0: 未核销
   * 1: 已核销
   */
  writeOffStatus?: number;
  
  /**
   * 门店ID
   */
  storeId?: number;
  
  /**
   * 活动ID
   */
  campaignId?: number;
  
  /**
   * 活动类型
   * 0: 普通商品
   * 1: 秒杀
   * 2: 砍价
   * 3: 拼团
   * 4: 积分商城
   */
  campaignType?: number;
  
  /**
   * 搜索关键词（可用于搜索商品名称）
   */
  search?: string;
  
  /**
   * 活动详情ID数组
   */
  campaignDetailId?: number[];
} 

/**
 * 用户信息数据结构
 */
export interface UserRespVO {
  /**
   * 用户ID
   */
  id: number;
  
  /**
   * 用户名
   */
  username: string | null;
  
  /**
   * 真实姓名
   */
  realName: string;
  
  /**
   * 昵称
   */
  nickname: string;
  
  /**
   * 头像URL
   */
  avatar: string;
  
  /**
   * 手机号
   */
  mobile: string;
  
  /**
   * 注册IP
   */
  addIp: string;
  
  /**
   * 用户余额
   */
  nowMoney: number;
  
  /**
   * 佣金金额
   */
  brokeragePrice: number;
  
  /**
   * 积分
   */
  integral: number;
  
  /**
   * 用户状态 0正常 1禁止
   */
  status: number;
  
  /**
   * 是否为推广员
   */
  isPromoter: number;
  
  /**
   * 支付次数
   */
  payCount: number;
  
  /**
   * 推广人数
   */
  spreadCount: number;
  
  /**
   * 详细地址
   */
  addres: string;
  
  /**
   * 管理员ID
   */
  adminid: number;
  
  /**
   * 登录类型
   */
  loginType: string;
  
  /**
   * 微信信息
   */
  wxProfile: any | null;
  
  /**
   * 生日
   */
  birthday: string;
  
  /**
   * 登录IP
   */
  loginIp: string;
  
  /**
   * 最后登录IP
   */
  lastIp: string;
  
  /**
   * 用户等级
   */
  level: number;
  
  /**
   * 推广用户ID
   */
  spreadUid: number;
  
  /**
   * 卡ID
   */
  cardId: string;
  
  /**
   * 成长值
   */
  growthValue: number;
  
  /**
   * 是否有核销权限
   */
  writeOffAuthority: boolean;
  
  /**
   * 邀请码
   */
  invitationCode: string;
  
  /**
   * 登录时间
   */
  loginDate: number;
  
  /**
   * 签到次数
   */
  signNum: number;
  
  /**
   * 创建时间
   */
  createTime: number;
  
  /**
   * 标签列表
   */
  tagList: any[] | null;
  
  /**
   * 消费金额
   */
  consumeAmount: number;
  
  /**
   * 订单列表
   */
  orderList: any[] | null;
  
  /**
   * 积分账单列表
   */
  integralBillList: any[] | null;
  
  /**
   * 用户优惠券
   */
  userCouponDTOS: any[] | null;
  
  /**
   * 账单列表
   */
  billList: any[] | null;
  
  /**
   * 关系列表
   */
  relationList: any[] | null;
  
  /**
   * 用户类型
   */
  userType: string;
  
  /**
   * 备注
   */
  mark: string;
  
  /**
   * 性别 1男 2女
   */
  sex: number;
}

/**
 * 订单商品信息
 */
export interface StoreOrderCartInfoDO {
  /**
   * ID
   */
  id: number;
  
  /**
   * 订单ID
   */
  oid: number;
  
  /**
   * 订单号
   */
  orderId: string;
  
  /**
   * 购物车ID
   */
  cartId: number;
  
  /**
   * 商品ID
   */
  productId: number;
  
  /**
   * 购物车信息
   */
  cartInfo: string;
  
  /**
   * 唯一标识
   */
  unique: string;
  
  /**
   * 是否售后 1是 0否
   */
  isAfterSales: number;
  
  /**
   * 优惠券价格
   */
  couponPrice: number;
  
  /**
   * 邮费
   */
  postagePrice: number;
  
  /**
   * 积分抵扣金额
   */
  integralDeductionAmount: number;
  
  /**
   * 使用的积分
   */
  useIntegral: number;
  
  /**
   * 支付金额
   */
  payPrice: number;
}

/**
 * 在线订单详情
 */
export interface OnlineOrderDetail {
  /**
   * 自增ID
   */
  id: number;
  
  /**
   * 订单ID
   */
  orderId: string;
  
  /**
   * 扩展订单ID
   */
  extendOrderId: string | null;
  
  /**
   * 用户ID
   */
  uid: number;
  
  /**
   * 真实姓名
   */
  realName: string | null;
  
  /**
   * 用户电话
   */
  userPhone: string | null;
  
  /**
   * 用户地址
   */
  userAddress: string;
  
  /**
   * 购物车ID
   */
  cartId: string;
  
  /**
   * 运费金额
   */
  freightPrice: number;
  
  /**
   * 订单商品总数
   */
  totalNum: number;
  
  /**
   * 订单总价
   */
  totalPrice: number;
  
  /**
   * 邮费
   */
  totalPostage: number;
  
  /**
   * 实际支付金额
   */
  payPrice: number;
  
  /**
   * 支付邮费
   */
  payPostage: number;
  
  /**
   * 抵扣金额
   */
  deductionPrice: number;
  
  /**
   * 优惠券ID
   */
  couponId: number | null;
  
  /**
   * 优惠券金额
   */
  couponPrice: number;
  
  /**
   * 支付状态 0未支付 1已支付
   */
  paid: number;
  
  /**
   * 支付时间
   */
  payTime: number | null;
  
  /**
   * 支付类型
   */
  payType: string;
  
  /**
   * 订单状态(-1:已退款,0:待付款,1:待发货,2:待收货,3:待评价,4:已完成)
   */
  status: number;
  
  /**
   * 退款状态
   */
  refundStatus: number;
  
  /**
   * 退款图片
   */
  refundReasonWapImg: string | null;
  
  /**
   * 退款用户说明
   */
  refundReasonWapExplain: string | null;
  
  /**
   * 退款时间
   */
  refundReasonTime: number | null;
  
  /**
   * 退款原因
   */
  refundReasonWap: string | null;
  
  /**
   * 退款理由
   */
  refundReason: string | null;
  
  /**
   * 退款金额
   */
  refundPrice: number;
  
  /**
   * 快递单号
   */
  deliverySn: string;
  
  /**
   * 快递名称
   */
  deliveryName: string | null;
  
  /**
   * 发货类型
   */
  deliveryType: string;
  
  /**
   * 快递公司编码
   */
  deliveryId: string | null;
  
  /**
   * 发货时间
   */
  deliveryDate: number | null;
  
  /**
   * 获得积分
   */
  gainIntegral: number;
  
  /**
   * 使用积分
   */
  useIntegral: number;
  
  /**
   * 支付积分
   */
  payIntegral: number;
  
  /**
   * 给用户退回积分
   */
  backIntegral: number;
  
  /**
   * 订单备注
   */
  mark: string;
  
  /**
   * 唯一标识
   */
  unique: string;
  
  /**
   * 管理员备注
   */
  remark: string | null;
  
  /**
   * 商户ID
   */
  merId: number;
  
  /**
   * 拼团ID
   */
  combinationId: number;
  
  /**
   * 拼团ID
   */
  pinkId: number;
  
  /**
   * 成本价
   */
  cost: number;
  
  /**
   * 秒杀ID
   */
  seckillId: number;
  
  /**
   * 砍价ID
   */
  bargainId: number;
  
  /**
   * 核销码
   */
  verifyCode: string;
  
  /**
   * 门店ID
   */
  storeId: number;
  
  /**
   * 配送方式 0-门店自提 1-送货上门 2-物流配送 3-外卖配送
   */
  shippingType: number;
  
  /**
   * 支付渠道(0微信公众号1微信小程序2微信AppH5)
   */
  isChannel: number;
  
  /**
   * 是否系统删除
   */
  isSystemDel: number;
  
  /**
   * 订单类型
   */
  orderType: string;
  
  /**
   * 核销状态
   */
  writeOffStatus: number;
  
  /**
   * 核销时间
   */
  writeOffDate: number | null;
  
  /**
   * 核销码
   */
  writeOffCode: string | null;
  
  /**
   * 分销员ID
   */
  distributorId: number | null;
  
  /**
   * 会员抵扣金额
   */
  vipDeductionAmount: number;
  
  /**
   * 创建时间
   */
  createTime: number;
  
  /**
   * 用户信息
   */
  userRespVO: UserRespVO;
  
  /**
   * 订单商品列表
   */
  storeOrderCartInfoDOList: StoreOrderCartInfoDO[];
  
  /**
   * 活动详情ID
   */
  campaignDetailId: number | null;
  
  /**
   * 活动类型
   */
  campaignType: string | null;
  
  /**
   * 购物车信息
   */
  cartInfo: any | null;
  
  /**
   * 用户昵称
   */
  nickname: string | null;
  
  /**
   * 状态列表
   */
  statusList: any[] | null;
  
  /**
   * 店铺信息
   */
  shopDO: any | null;
  
  /**
   * 状态描述
   */
  statusStr: string;
}

