<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="user-info">
        <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div class="user-greeting">
          <div class="greeting-text">{{ greeting }}，{{ userName }}，今天是充满活力的一天！</div>
          <div class="weather-info">今天多云转晴朗， 20°C ~ 25°C</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="store-selector">
          <el-select v-model="currentStore" @change="handleStoreChange" placeholder="请选择门店">
            <el-option v-for="item in shopList" :key="item.id" :label="item.storeName" :value="item.id" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 数据卡片 -->
    <el-row :gutter="20" class="data-cards">
      <el-col :xs="24" :sm="12" :md="6" v-for="(card, index) in dataCards" :key="index">
        <el-card class="data-card" :class="card.class">
          <div class="card-content">
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>

              <div class="flex flex-row items-center justify-between">
                <Icon size="24" :icon="card.icon||'ep:suitcase-1'" class="card-icon" />
                <div class="card-value">{{ card.value }}</div>
              </div>
              <div class="flex justify-between">
                <div class="sub-title">{{ card.subTitle }}</div>
                <div class="sub-value">{{ card.subValue }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第一行图表区域：应用卡片、访客量图表和销售趋势 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="chart-card" style="height: 350px">
          <div class="section-container " :style="{height: 'calc(100% )'}">
            <div class="section-header ">
              <h3 class="section-title">应用</h3>
            </div>
            <div class="app-grid " :style="gridStyle">
              <div class="app-item " v-for="(item, index) in items" :key="index" @click="handleItemClick(item)">
                <div class="icon" :style="{ backgroundColor: getIconColor(index) }" >
                  <el-icon>
                    <component :is="item.icon" />
                  </el-icon>
                </div>
                <div class="text">
                  <div class="title">{{ item.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <el-card class="chart-card" style="height: 350px">
          <div >
            <div class="chart-title">访客与注册趋势</div>
          </div>
          <div class="chart-container" ref="visitorChartRef"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="chart-card" style="height: 350px">
          <template #header>
            <div class="chart-header">
              <span>销售趋势</span>
            </div>
          </template>
          <div class="chart-container" ref="trendChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行图表区域：门店订单柱状图、月度数据表格和商品TOP5饼图 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="12" :lg="6">
        <el-card class="chart-card" style="height: 450px">
          <template #header>
            <div class="chart-header">
              <span>门店订单分析</span>
            </div>
          </template>
          <div class="chart-container" ref="shopOrderChartRef"></div>
        </el-card>
      </el-col>
      <el-col :xs="12" :lg="12">
        <el-card class="table-card" style="height: 450px">
          <template #header>
            <div class="table-header">
              <span>月度数据统计</span>
            </div>
          </template>
          <div class="table-container">
            <el-table
:data="monthlyData" style="width: 100%" border stripe v-loading="tableLoading" height="370"
              :header-cell-style="{
                background: '#f5f7fa',
                color: '#606266',
                fontWeight: 'bold',
                textAlign: 'center'
              }" :cell-style="{ textAlign: 'center' }">
              <el-table-column prop="month" label="月份" min-width="80" />
              <el-table-column prop="orderCount" label="订单数" min-width="80">
                <template #default="scope">
                  {{ formatNumber(scope.row.orderCount) }}
                </template>
              </el-table-column>
              <el-table-column prop="visitCount" label="访客量" min-width="80">
                <template #default="scope">
                  {{ formatNumber(scope.row.visitCount) }}
                </template>
              </el-table-column>
              <el-table-column prop="newUserCount" label="新增用户" min-width="80">
                <template #default="scope">
                  {{ formatNumber(scope.row.newUserCount) }}
                </template>
              </el-table-column>
              <el-table-column prop="salesAmount" label="销售额" min-width="100">
                <template #default="scope">
                  {{ formatCurrency(scope.row.salesAmount) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :lg="6">
        <el-card class="chart-card" style="height: 450px">
          <template #header>
            <div class="flex chart-header">
              <span>商品销量Top5</span>
              <div class="dashboard-filters">
                <el-date-picker
v-model="selectedDate" type="date" placeholder="选择日期" :shortcuts="dateShortcuts"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleDateChange" />
              </div>
            </div>
          </template>
          <div class="chart-container" ref="pieChartRef"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import * as ShopApi from '@/api/mall/shop/shop'
import { ElMessage } from 'element-plus'
import {
  // getVisitTrend,
  getTopProducts,
  getRecentOrderAmount,
  getOrderCountOverview,
  getShopOrderAnalysis,
  getMonthData
} from '@/api/home'
import type {
  TopProductItem,
  OrderAmountData,
  OrderCountOverview,
  ShopOrderAnalysisData
} from '@/api/home/index.model'
import { useUserStore } from '@/store/modules/user'
import router from '@/router'

const userStore = useUserStore()
const userName = computed(() => userStore.getUser?.nickname || '用户')

// 根据时间生成问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

// 当前选中的门店
const currentStore = ref('')
const shopList = ref<ShopApi.ShopVO[]>([]) // 店铺列表
const loading = ref(false)
const tableLoading = ref(false)

// 数据状态
const overviewData = ref<OrderCountOverview | null>(null)
const topProductsData = ref<TopProductItem[]>([])
const orderAmountData = ref<OrderAmountData | null>(null)
const visitTrendData = ref<any[]>([])
const shopOrderData = ref<ShopOrderAnalysisData[]>([])
const monthlyData = ref<any[]>([{
  month: '2024-01',
  orderCount: 20,
  visitCount: 33,
  newUserCount: 44,
  salesAmount: 55
},
{
  month: '2024-02',
  orderCount: 10,
  visitCount: 10,
  newUserCount: 10,
  salesAmount: 10
},
{
  month: '2024-03',
  orderCount: 90,
  visitCount: 88,
  newUserCount: 77,
  salesAmount: 66
},
{
  month: '2024-04',
  orderCount: 1000,
  visitCount: 1111,
  newUserCount: 411,
  salesAmount: 211
},
{
  month: '2024-05',
  orderCount: 110,
  visitCount: 140,
  newUserCount: 110,
  salesAmount: 103
}])

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  PieChart,
  BarChart,
  CanvasRenderer,
  UniversalTransition
])

// 图表引用
const visitorChartRef = ref(null)
const trendChartRef = ref(null)
const pieChartRef = ref(null)
const shopOrderChartRef = ref(null) // 新增门店订单图表引用
let trendChart = null
let pieChart = null
let visitorChart = null
let shopOrderChart = null // 新增门店订单图表实例

// 日期选择相关
const selectedDate = ref(new Date().toISOString().split('T')[0]) // 默认为今天

// 日期快捷选项
const dateShortcuts = [
  {
    text: '今天',
    value: new Date()
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date
    }
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date
    }
  },
  {
    text: '一个月前',
    value: () => {
      const date = new Date()
      date.setMonth(date.getMonth() - 1)
      return date
    }
  }
]

// 应用项目数据
const items = [
  {
    title: '商品',
    count: 254,
    icon: 'ShoppingBag',
    url: '/mall/product/store-product'

  },
  {
    title: '订单',
    count: 1254,
    icon: 'List',
    url: '/mall/order/store-order'
  },
  {
    title: '会员',
    count: 3254,
    icon: 'User',
    url: '/userCenter/member/user'
  },
  {
    title: '活动',
    count: 15,
    icon: 'Present',
    url: '/marketing/discount'  
  }
]

// 数据卡片
const dataCards = ref([
  {
    title: '今日订单',
    value: '0',
    subTitle: '昨日订单',
    subValue: '0',
    class: 'card-purple'
  },
  {
    title: '今日销售额',
    value: '¥0',
    subTitle: '昨日销售额',
    subValue: '¥0',
    class: 'card-blue'
  },
  {
    title: '用户总数',
    value: '0',
    subTitle: '本月新增',
    subValue: '0',
    class: 'card-cyan'
  },
  {
    title: '商品总数',
    value: '0',
    subTitle: '本月新增',
    subValue: '0',
    class: 'card-orange'
  }
])

// 处理门店变化
const handleStoreChange = () => {
  fetchDashboardData(selectedDate.value)
}

const handleItemClick = (item) => {
  router.push(item.url)
}

// 处理日期变化
const handleDateChange = (date) => {
  if (!date) return

  // 使用选择的日期更新数据
  fetchDashboardData(date)
}

// 获取仪表盘数据
const fetchDashboardData = async (date) => {
  try {
    loading.value = true

    // 使用选择的日期和店铺ID作为参数调用API
    const params = {
      dateTime: date,
      shopId: currentStore.value ? Number(currentStore.value) : undefined
    }

    // 并行请求多个API以提高加载速度
   
    const overview = await getOrderCountOverview({
      shopId: params.shopId
    })
    const topProducts = await getTopProducts({
      dateTime: params.dateTime,
      shopId: params.shopId // 修改为shopId，与API定义保持一致
    })
    const orderAmount = await getRecentOrderAmount({
      days: 7,
      shopId: params.shopId
    })
    // const visitTrend = await getVisitTrend({
    //   date: params.dateTime,
    // })
    const shopOrder = await getShopOrderAnalysis({
      startDate: params.dateTime,
      endDate: params.dateTime,
      limit: 5
    })

    // 更新状态
    overviewData.value = overview
    topProductsData.value = topProducts
    orderAmountData.value = orderAmount
    visitTrendData.value = []
    shopOrderData.value = shopOrder // 现在是数组类型

    // 更新数据卡片
    updateDataCards()

    // 更新图表
    updateCharts()
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 加载门店列表
const loadShopList = async () => {
  try {
    const result = await ShopApi.getShopPage({
      pageNo: 1,
      pageSize: 100
    })

    shopList.value = result.list

    // 如果有店铺数据，默认选择第一家店铺
    if (shopList.value && shopList.value.length > 0) {
      currentStore.value = shopList.value[0].id
    }

    // 加载初始数据，使用当前选中的店铺ID
    fetchDashboardData(selectedDate.value)
  } catch (error) {
    console.error('获取门店列表失败:', error)
    ElMessage.error('获取门店列表失败，请稍后重试')

    // 即使获取店铺失败，也尝试加载数据
    fetchDashboardData(selectedDate.value)
  }
}

// 更新数据卡片
const updateDataCards = () => {
  if (!overviewData.value) return

  dataCards.value = [
    {
      title: '今日订单',
      value: overviewData.value.todayCount,
      subTitle: '昨日订单',
      subValue: overviewData.value.proCount,
      icon: 'ep:suitcase',
      class: 'card-purple'
    },
    {
      title: '今日销售额',
      value: `¥${overviewData.value.todayPrice}`,
      subTitle: '昨日销售额',
      subValue: `¥${overviewData.value.proPrice}`,
      icon: 'ep:coin',
      class: 'card-blue'
    },
    {
      title: '用户总数',
      value: overviewData.value.userCount,
      subTitle: '本月新增',
      subValue: overviewData.value.monthCount,
      icon: 'ep:avatar',
      class: 'card-cyan'
    },
    {
      title: '商品总数',
      value: overviewData.value.goodsCount,
      subTitle: '本月新增',
      subValue: overviewData.value.goodsMonthCount,
      icon: 'ep:tickets',
      class: 'card-orange'
    }
  ]
}

// 更新所有图表
const updateCharts = () => {
  updatePieChart()
  updateTrendChart()
  updateVisitorChart()
  updateShopOrderChart() // 添加门店订单图表更新
  fetchMonthlyData()
}

// 更新饼图
const updatePieChart = () => {
  if (!pieChartRef.value || !pieChart) return

  // if (!topProductsData.value || topProductsData.value.length === 0) {
  //   pieChart.setOption({
  //     title: {
  //       text: '暂无数据',
  //       left: 'center',
  //       top: 'center',
  //       textStyle: {
  //         color: '#909399',
  //         fontSize: 14,
  //         fontWeight: 'normal'
  //       }
  //     },
  //     series: [
  //       {
  //         type: 'pie',
  //         radius: ['40%', '70%'],
  //         data: []
  //       }
  //     ]
  //   })
  //   return
  // }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      right: 10,
      top: 'top',
      type: 'scroll',
      // formatter: (name) => {
      //   if (name.length > 10) {
      //     return name.substring(0, 10) + '...'
      //   }
      //   return name
      // }
    },
    series: [
      {
        name: '商品销量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 1,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '咖啡' },
          { value: 735, name: '奶茶' },
          { value: 580, name: '果茶' },
          { value: 484, name: '小吃' },
          { value: 300, name: '其他' }
        ]
      }
    ]
  }

  pieChart.setOption(option)
}

// 更新趋势图
const updateTrendChart = () => {
  if (!trendChartRef.value || !trendChart) return

  // if (
  //   !orderAmountData.value ||
  //   !orderAmountData.value.dates ||
  //   orderAmountData.value.dates.length === 0
  // ) {
  //   trendChart.setOption({
  //     title: {
  //       text: '暂无销售趋势数据',
  //       left: 'center',
  //       top: 'center',
  //       textStyle: {
  //         color: '#909399',
  //         fontSize: 14,
  //         fontWeight: 'normal'
  //       }
  //     },
  //     xAxis: { show: false },
  //     yAxis: { show: false },
  //     series: []
  //   })
  //   return
  // }

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const date = params[0].name
        const amount = params[0].value
        return `${date}<br/>${params[0].seriesName}: ${formatCurrency(amount)}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['03-20', '03-21', '03-22', '03-23', '03-24'],
      axisLabel: {
        rotate: 30,
        interval: 0,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => {
          if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'k'
          }
          return value
        }
      }
    },
    series: [
      {
        name: '订单金额',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(58, 71, 212, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(58, 71, 212, 0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#3a47d4'
        },
        
      }
    ]
  }

  trendChart.setOption(option)
}

// 更新访客图表
const updateVisitorChart = () => {
  if (!visitorChartRef.value || !visitorChart) return

  // if (!visitTrendData.value || visitTrendData.value.length === 0) {
  //   visitorChart.setOption({
  //     title: {
  //       text: '暂无访客数据',
  //       left: 'center',
  //       top: 'center',
  //       textStyle: {
  //         color: '#909399',
  //         fontSize: 14,
  //         fontWeight: 'normal'
  //       }
  //     },
  //     xAxis: { show: false },
  //     yAxis: { show: false },
  //     series: []
  //   })
  //   return
  // }

  const dates = visitTrendData.value.map((item) => item.date)
  const visits = visitTrendData.value.map((item) => item.visits)
  const registrations = visitTrendData.value.map((item) => item.registrations)

  console.log(dates, visits, registrations)
  // const option = {
  //   tooltip: {
  //     trigger: 'axis',
  //     axisPointer: {
  //       type: 'shadow'
  //     }
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03'],
  //     axisLabel: {
  //       rotate: 30,
  //       interval: 0,
  //       fontSize: 10
  //     }
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       name: '访客量',
  //       type: 'line',
  //       data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  //       smooth: true,
  //       lineStyle: {
  //         width: 3,
  //         color: '#409eff'
  //       },
  //       itemStyle: {
  //         color: '#409eff'
  //       }
  //     },
  //     {
  //       name: '新增用户',
  //       type: 'line',
  //       data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  //       smooth: true,
  //       lineStyle: {
  //         width: 3,
  //         color: '#67c23a'
  //       },
  //       itemStyle: {
  //         color: '#67c23a'
  //       }
  //     }
  //   ]
  // }

  const option = {
    
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['访客量', '新增用户']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%', 
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['03-20', '03-21', '03-22', '03-23', '03-24']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访客量',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '新增用户',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  };
  visitorChart.setOption(option)
}

// 更新门店订单图表
const updateShopOrderChart = () => {
  if (!shopOrderChartRef.value || !shopOrderChart) return

  if (!shopOrderData.value || shopOrderData.value.length === 0) {
    shopOrderChart.setOption({
      title: {
        text: '暂无门店订单数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#909399',
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      xAxis: { show: false },
      yAxis: { show: false },
      series: []
    })
    return
  }

  // 从数组中提取数据
  const shopNames = shopOrderData.value.map((item) => item.shopName)
  const orderCounts = shopOrderData.value.map((item) => item.orderCount)
  const orderAmounts = shopOrderData.value.map((item) => item.totalAmount)

  console.log(shopNames, orderCounts, orderAmounts)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        const shopName = params[0].name
        const orderCount = params[0].value
        const orderAmount = params[1].value

        return `
          <div style="font-weight:bold;margin-bottom:5px">${shopName}</div>
          <div style="display:flex;justify-content:space-between">
            <span>${params[0].seriesName}:</span>
            <span style="font-weight:bold">${orderCount}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>${params[1].seriesName}:</span>
            <span style="font-weight:bold">¥${orderAmount.toFixed(2)}</span>
          </div>
        `
      }
    },
    legend: {
      data: ['订单数量', '订单金额'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: shopNames,
      axisLabel: {
        rotate: 30,
        interval: 0,
        fontSize: 10,
        formatter: function (value) {
          // 如果店铺名称太长，截断并添加省略号
          if (value.length > 6) {
            return value.substring(0, 6) + '...'
          }
          return value
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数量',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#409eff'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '订单金额',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#67c23a'
          }
        },
        axisLabel: {
          formatter: '¥{value}'
        }
      }
    ],
    series: [
      {
        name: '订单数量',
        type: 'bar',
        data: orderCounts,
        itemStyle: {
          color: '#409eff'
        }
      },
      {
        name: '订单金额',
        type: 'bar',
        yAxisIndex: 1,
        data: orderAmounts,
        itemStyle: {
          color: '#67c23a'
        }
      }
    ]
  }
  shopOrderChart.setOption(option)
}

// 组件挂载后初始化图表和数据
onMounted(async () => {
  await nextTick()

  // 初始化图表实例
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
  }

  if (visitorChartRef.value) {
    visitorChart = echarts.init(visitorChartRef.value)
  }

  if (shopOrderChartRef.value) {
    shopOrderChart = echarts.init(shopOrderChartRef.value)
  }

  // 加载门店列表并默认选择第一家
  loadShopList()

  // 添加窗口大小变化监听，以便调整图表大小
  window.addEventListener('resize', () => {
    trendChart?.resize()
    pieChart?.resize()
    visitorChart?.resize()
    shopOrderChart?.resize()
  })
})

// 获取月度数据
const fetchMonthlyData = async () => {
  try {
    tableLoading.value = true
    const shopId = currentStore.value ? Number(currentStore.value) : undefined

    const data = await getMonthData({
      months: 12,
      shopId: shopId
    })
    console.log(data)

   
    return
    // if (!data || data.length === 0) {
    //   monthlyData.value = []
    //   return
    // }

    // // 使用新的数据结构，直接使用API返回的数据
    // monthlyData.value = data.map((item) => {
    //   // 计算环比变化百分比（模拟数据，实际应从API获取或计算）
    //   // 这里假设每个月相比上月的变化在-20%到+20%之间
    //   // const getRandomTrend = () => Math.floor(Math.random() * 40) - 20

    //   return {
    //     month: item.month,
    //     orderCount: item.orderCount,
    //     visitCount: item.visitCount,
    //     newUserCount: item.newUserCount,
    //     salesAmount: item.salesAmount,
    //     // // 添加环比变化数据（实际项目中应从API获取或基于历史数据计算）
    //     // orderTrend: getRandomTrend(),
    //     // visitTrend: getRandomTrend(),
    //     // userTrend: getRandomTrend(),
    //     // salesTrend: getRandomTrend()
    //   }
    // })
  } catch (error) {
    console.error('获取月度数据失败:', error)
    ElMessage.error('获取月度数据失败，请稍后重试')
    // monthlyData.value = []
  } finally {
    tableLoading.value = false
  }
}

// 格式化数字
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

// 格式化货币
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

// 根据应用数量计算网格布局样式
const gridStyle = computed(() => {
  const count = items.length

  // 根据应用数量决定列数和行数
  let columns, rows

  if (count <= 4) {
    columns = 2
    rows = Math.ceil(count / 2)
  } else if (count <= 6) {
    columns = 3
    rows = Math.ceil(count / 3)
  } else if (count <= 9) {
    columns = 3
    rows = Math.ceil(count / 3)
  } else {
    columns = 4
    rows = Math.ceil(count / 4)
  }

  return {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`
  }
})

// 为图标生成不同的颜色
const iconColors = [
  '#409eff', // 蓝色
  '#67c23a', // 绿色
  '#e6a23c', // 橙色
  '#f56c6c', // 红色
  '#909399', // 灰色
  '#9c27b0', // 紫色
  '#3f51b5', // 靛蓝色
  '#00bcd4', // 青色
  '#ff9800' // 橙色
]

const getIconColor = (index) => {
  return iconColors[index % iconColors.length]
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-greeting {
  display: flex;
  flex-direction: column;
}

.greeting-text {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.weather-info {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.dashboard-filters {
  display: flex;
  gap: 10px;
  width: 150px;
  align-items: center;
}

.data-cards {
  margin-bottom: 20px;
}

.data-card {
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;

  

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .card-content {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }

  .card-info {
    flex: 1;
    color: #fff;
  }

  .card-title {
    font-size: 14px;
    color: white;
    margin-bottom: 5px;
  }

  .card-value {
    font-size: 24px;
    font-weight: bold;
    color: white;
  }

  .sub-title,
  .sub-value {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }

  &.card-purple {
    background-color: #8e44ad;
  }

  &.card-blue {
    background-color: #3498db;
  }

  &.card-cyan {
    background-color: #00bcd4;
  }

  &.card-orange {
    background-color: #ff9800;
  }
}
:deep(.el-card__body) {
  height: 100%;
}

.chart-section {
  margin-bottom: 10px;
}

.chart-card,
.table-card {
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.chart-container {
  height: 280px;
  width: 100%;
}

.table-header {
  font-size: 16px;
  font-weight: 500;
}

// 图例样式
.chart-legend {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 2px;

  &.blue {
    background-color: #409eff;
  }

  &.green {
    background-color: #67c23a;
  }
}

// 图表标题
.section-title,
.chart-title {
  font-size: 16px;
  font-weight: 500;
}

// 应用卡片网格布局
.app-grid {
  display: grid;
  gap: 12px;
  height: calc(100% - 40px);
  padding: 5px;
}

// 应用项目卡片调整
.app-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f7fa;
  transition: all 0.3s;
  height: 100%;

  cursor: pointer;
  &:hover {
    background-color: #ecf5ff;
    transform: translateY(-2px);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 8px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }

  .text {
    flex: 1;
    overflow: hidden;
  }

  .title {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .count {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-top: 5px;
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .chart-section {
    .el-col {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-filters {
    width: 100%;
    margin-top: 10px;
  }

  .data-card {
    margin-bottom: 10px;
  }

  .chart-card,
  .table-card {
    height: auto !important;
    margin-bottom: 15px;
  }

  .chart-container {
    height: 250px;
  }

  .el-date-picker {
    width: 100%;
  }

  .app-grid {
    gap: 8px;
  }

  .app-item {
    padding: 8px;

    .icon {
      width: 32px;
      height: 32px;
      min-width: 32px;
      font-size: 16px;
    }

    .title {
      font-size: 12px;
    }

    .count {
      font-size: 16px;
    }
  }
}

@media (max-width: 576px) {
  .dashboard-container {
    padding: 10px;
  }

  .greeting-text {
    font-size: 14px;
  }

  .weather-info {
    font-size: 12px;
  }

  .chart-container {
    height: 200px;
  }

  .app-grid {
    &.grid-six {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(3, 1fr);
    }
  }
}
</style>
