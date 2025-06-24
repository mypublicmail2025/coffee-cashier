export interface ResponList<T> {
  list: T[]
  total: number
}
// 分销商列表
export interface DistributorData {
  userId: number; // 用户ID
  realName: string; // 真实姓名
  levelId: number; // 等级ID
  superiorId: number; // 上级ID
  superiorName: string; // 上级名称
  address: string; // 地址
  reason: string; // 申请原因
  refuse: string; // 拒绝原因
  status: number; // 状态 -1-清退 0-待审核 1-已通过 2-已拒绝
  addUpAmount: number; // 累计金额
  addUpWages: number; // 累计佣金
  addUpUser: number; // 累计用户
  addUpDistributor: number; // 累计下级经销商
  id: number; // 主键
  createTime: string; // 创建时间
  firstWages: number; // 一级佣金比例
  secondWages: number; // 二级佣金比例
  userCount: number; // 团队人数
  p1UserCount: number; // 一级团队人数
  p2UserCount: number; // 二级团队人数
  firstDistributorCount: number; // 一级分销商数
  secondDistributorCount: number; // 二级佣金比例
  amountCount: number; // 团队分销金额
  orderCount: number; // 团队分销订单数
  firstAmountCount: number; // 一级分销商分销金额
  firstOrderCount: number; // 一级分销商订单数
  secondAmountCount: number; // 二级分销商分销金额
  secondOrderCount: number; // 二级分销商分销金额
}

// 分销商等级列表
export interface LevelListItem {
  level: number; // 等级，取值为 1-10
  name: string; // 等级名称
  firstWages: number; // 一级佣金比例
  secondWages: number; // 二级佣金比例
  thirdWages: number; // 三级佣金比例
  upType: number; // 升级类型，0-满足任意，1-满足全部
  userCount: number; // 人数，值为-1是未选中
  amount: number; // 金额，值为-1是未选中
  wages: number; // 佣金，值为-1是未选中
  id: number; // 主键
  createTime: string; // 创建时间
  count: number; // 分销商数量
}

// 创建分销商等级
export interface CreateLevel {
  id?: number;
  level: number | null; // 等级，范围为 1-10
  name: string; // 等级名称
  firstWages: number; // 一级佣金比例
  secondWages: number; // 二级佣金比例
  thirdWages?: number | null; // 三级佣金比例
  upType: number; // 升级类型，0表示满足任意条件，1表示满足全部条件
  userCount: number; // 人数，-1表示未选中
  amount: number; // 金额，-1表示未选中
  wages: number; // 佣金，-1表示未选中
}

// 返回等级详情
export interface LevelData {
  level: number; // 等级 1-10
  name: string; // 等级名称
  firstWages: number; // 一级佣金比例
  secondWages: number; // 二级佣金比例
  thirdWages: number | null; // 三级佣金比例
  upType: number; // 升级类型 0-满足任意 1-满足全部
  userCount: number; // 人数 值为-1是未选中
  amount: number; // 金额 值为-1是未选中
  wages: number; // 佣金 值为-1是未选中
  id: number; // 主键
  createTime: string; // 创建时间
  count: number | null; // 分销商数量
}

// 分销商详情
export interface DistributorDetail {
  userId: number; // 用户ID
  realName: string; // 真实姓名
  levelId: number; // 等级ID
  superiorId?: number; // 上级ID
  mobile?: number; // 手机号
  superiorName?: string; // 上级名称
  address: string; // 地址
  reason: string; // 申请原因
  refuse?: string; // 拒绝原因
  status: -1 | 0 | 1 | 2; // 状态 -1-清退 0-待审核 1-已通过 2-已拒绝
  addUpAmount: number; // 累计金额
  addUpWages: number; // 累计佣金
  addUpUser?: number; // 累计用户
  addUpDistributor?: number; // 累计下级经销商
  id: number; // 主键
  levelName?: string; // 分销商等级名称
  createTime: string; // 创建时间
  firstWages: number; // 一级佣金比例
  secondWages: number; // 二级佣金比例
  userCount: number; // 团队人数
  p1UserCount?: number; // 一级团队人数
  p2UserCount?: number; // 二级团队人数
  firstDistributorCount: number; // 一级分销商数
  secondDistributorCount?: number; // 二级分销商数
  amountCount?: number; // 团队分销金额
  orderCount?: number; // 团队分销订单数
  firstAmountCount?: number; // 一级分销商分销金额
  firstOrderCount?: number; // 一级分销商订单数
  secondAmountCount?: number; // 二级分销商分销金额
  secondOrderCount?: number; // 二级分销商分销金额
  superiorNameP1? :string; // 上级分销商名称
}

// 分销订单列表
 export interface DistributorList {
  id: number; // 主键ID
  orderId: string; // 订单ID
  settlementTime: string; // 结算时间
  userName: string; // 用户名
  productPrice: number; // 产品价格
  distributorName: string; // 分销商名字
  amount: number; // 金额
  status: number; // 状态
  payTime: number | string; // 支付时间
}

// 分销商订单详情
export interface DistributorOrderDetail {
  settlementTime: string;                 // 结算时间
  oid: number;                           // 订单ID
  orderId: string;                       // 订单号
  status: number;                        // 佣金状态
  distributionRule: number;              // 分销规则 0-默认 1-自定义
  distributionPurchase: number;          // 分销自购 0-关闭 1-开启
  distributionProductSettlement: number; // 商品结算方式 0-实际支付价格 1-商品价格
  distributionWagesSettlement: number;   // 佣金结算方式 0-支付后结算 1-确认收获后结算 2-订单完成结算
  userId: number;                        // 下单用户
  userName: string;                      // 用户昵称
  productId: number;                     // 商品ID
  productAttrValueId: number;            // 商品规格ID
  productName: string;                   // 商品名称
  productPrice: number;                  // 商品金额
  detailId: number;                      // 订单详情id
  superiorIdP1: number;                  // 所属一级ID
  superiorNameP1: string;                // 所属一级名称
  superiorIdP2: number;                  // 所属二级ID
  superiorNameP2: string;                // 所属二级名称
  firstWages: number;                    // 一级佣金比例
  secondWages: number;                   // 二级佣金比例
  firstAmount: number;                   // 一级佣金
  secondAmount: number;                  // 二级佣金
  id: number;                            // 主键
  createTime: string;                    // 创建时间
}
