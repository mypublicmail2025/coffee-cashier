/**
 * @name: index.ts
 * @description: 首页相关接口
 */
import request from '@/config/axios'
import {
    DashboardStats,
    MonthDataItem,
    OrderAmountData,
    OrderAmountTrendData,
    OrderCountOverview,
    ShopOrderAnalysisData,
    TopProductItem,
    VisitTrendItem
} from './index.model'

/**
 * 获取访问趋势数据
 * @param params 查询参数
 * @returns 访问趋势数据
 */
export const getVisitTrend = (params?: any) =>
    request.get<VisitTrendItem[]>({
        url: '/order/store-order/visit/trend',
        params
    })

/**
 * 获取首页统计数据
 * @returns 首页统计数据
 */
export const getDashboardStats = () =>
    request.get<DashboardStats>({
        url: '/order/store-order/dashboard/stats'
    })

/**
 * 获取订单金额趋势
 * @param params 查询参数
 * @returns 订单金额趋势数据
 */
export const getOrderAmountTrend = (params?: {
    timeRange: 'day' | 'week' | 'month' | 'year'
}) =>
    request.get<OrderAmountTrendData>({
        url: '/order/store-order/amount/trend',
        params
    })

/**
 * 获取销量最高的商品TOP5
 * @param params 查询参数，选择单个日期
 * @returns 商品销量TOP5数据
 */
export const getTopProducts = (params?: {
    dateTime?: string
    shopId: number
}) =>
    request.get<TopProductItem[]>({
        url: '/order/store-order/top-products',
        params
    })

/**
 * 获取门店订单分析数据
 * @param params 查询参数，可包含日期范围
 * @returns 门店订单分析数据
 */
export const getShopOrderAnalysis = (params?: {
    startDate?: string
    endDate?: string
    limit?: number // 限制返回的门店数量
}) =>
    request.get<ShopOrderAnalysisData[]>({
        url: '/order/store-order/shop-order-analysis',
        params
    })

/**
 * 获取近七日订单金额
 * @param params 查询参数
 * @returns 近七日订单金额数据
 */
export const getRecentOrderAmount = (params?: {
    days?: number        // 天数，默认7天
    comparison?: 'yoy' | 'mom' | 'wow' | 'none' // 同比/环比类型：yoy-同比，mom-环比，wow-周环比，none-不需要对比
    shopId?: number     // 门店ID，可选
}) =>
    request.get<OrderAmountData>({
        url: '/order/store-order/order-amount',
        params
    })

/**
 * 获取月度数据统计
 * @param params 查询参数
 * @returns 月度数据统计
 */
export const getMonthData = (params?: {
    months?: number              // 获取最近几个月的数据，默认为12个月
    shopId: number             // 门店ID，可选
}) =>
    request.get<MonthDataItem[]>({
        url: '/order/store-order/get-month-data',
        params
    })

/**
 * 获取订单统计概览
 * @param params 查询参数
 * @returns 订单统计概览数据
 */
export const getOrderCountOverview = (params?: {
    shopId: number        // 门店ID，可选
}) =>
    request.get<OrderCountOverview>({
        url: '/order/store-order/count',
        params
    }) 