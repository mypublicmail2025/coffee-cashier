/**
 * @name: index.model.ts
 * @description: 首页相关接口数据模型
 */

/**
 * 访问趋势数据接口
 */
export interface VisitTrendItem {
    date: string
    visits: number
    registrations: number
}

/**
 * 首页统计数据
 */
export interface DashboardStats {
    memberCount: number
    orderCount: number
    totalAmount: number
    productCount: number
    todayOrders: number
    yesterdayOrders: number
    weekAmount: number
    monthNewProducts: number
}

/**
 * 订单金额趋势数据
 */
export interface OrderAmountTrendData {
    dates: string[]
    currentData: number[]
    previousData: number[]
}

/**
 * 商品销量TOP5数据项
 */
export interface TopProductItem {
    name: string
    value: number
    percentage?: number
}

/**
 * 门店订单分析数据
 */
export interface ShopOrderAnalysisData {
    shopName: string  // 门店名称
    totalAmount: number // 订单金额
    orderCount: number // 订单数量
}

/**
 * 订单金额数据
 */
export interface OrderAmountData {
    dates: string[]      // 日期列表
    amounts: number[]    // 金额列表
    comparisonAmounts?: number[] // 对比期金额列表（可选，用于同比/环比）
}

/**
 * 月度数据统计项
 */
export interface MonthDataItem {
    month: string                // 月份，格式如 "2023-01"
    orderCount: number
    visitCount: number
    newUserCount: number
    salesAmount: number
}

/**
 * 订单统计概览数据
 */
export interface OrderCountOverview {
    todayPrice: number      // 今日订单金额
    todayCount: number      // 今日订单数量
    proPrice: number        // 昨日订单金额
    proCount: number        // 昨日订单数量
    monthPrice: number      // 本月订单金额
    monthCount: number      // 本月订单数量
    lastWeekCount: number   // 上周订单数量
    lastWeekPrice: number   // 上周订单金额
    userCount: number       // 用户总数
    orderCount: number      // 订单总数
    priceCount: number      // 总金额
    goodsCount: number      // 商品总数
    goodsMonthCount: number // 本月新增商品数
} 