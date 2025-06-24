<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="user-info">
        <el-avatar
          :size="40"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <div class="user-greeting">
          <div class="greeting-text">早安，管理员，今天有事充满活力的一天！</div>
          <div class="weather-info">今天多云转晴朗， 20°C ~ 25°C</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="store-selector">
          <el-select v-model="currentStore" clearable placeholder="请选择门店">
            <el-option
              v-for="item in shopList"
              :key="item.id"
              :label="item.storeName"
              :value="item.id"
            />
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
              <!-- <div class="card-icon">
                <el-icon><component :is="card.icon" /></el-icon>
              </div> -->
              <div class="card-value">{{ card.value }}</div>

              <div class="flex justify-between">
                <div class="sub-title">{{ card.subTitle }}</div>
                <div class="sub-value">{{ card.subValue }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="chart-card">
          <div class="section-container">
            <div class="section-header">
              <h3 class="section-title">应用</h3>
            </div>
            <el-row :gutter="20">
              <el-col :span="12" v-for="(item, index) in items" :key="index">
                <div class="app-item">
                  <div class="icon">
                    <el-icon><component :is="item.icon" /></el-icon>
                  </div>
                  <div class="text">
                    <div class="title">{{ item.title }}</div>
                    <div class="count">{{ item.count }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <el-card class="chart-card">
          <div class="chart-header">
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-color blue"></span>访客量</span>
              <span class="legend-item"><span class="legend-color green"></span>新增用户</span>
            </div>
          </div>
          <div class="chart-container" ref="visitorChartRef"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>销售趋势</span>
              <!-- <el-radio-group
                v-model="trendTimeRange"
                size="small"
                @change="handleTrendRangeChange"
              >
                <el-radio-button label="day">今日</el-radio-button>
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group> -->
            </div>
          </template>
          <div class="chart-container" ref="trendChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="24" :lg="8">
        <el-card class="chart-card">
          <template #header>
            <div class="flex chart-header">
              <span>Top5</span>
              <div class="dashboard-filters">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="dateShortcuts"
                  @change="handleDateChange"
                />
              </div>
            </div>
          </template>
          <div class="chart-container" ref="pieChartRef"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="16">
        <el-card class="table-card">
          <template #header>
            <div class="table-header">
              <span>数据表格</span>
            </div>
          </template>
          <el-table :data="tableData" style="width: 100%" border stripe>
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="age" label="年龄" width="80" />
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="tags" label="标签">
              <template #default="scope">
                <el-tag
                  v-for="tag in scope.row.tags"
                  :key="tag"
                  :type="getTagType(tag)"
                  class="table-tag"
                >
                  {{ tag }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import * as ShopApi from '@/api/mall/shop/shop'

// 当前选中的门店
const currentStore = ref('store1')
const shopList = ref<ShopApi.ShopVO[]>([]) // 店铺列表

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition
])
const visitorChartRef = ref(null)

// 日期范围选择
const dateRange = ref([])
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 初始化访客图表
function initVisitorChart() {
  if (!visitorChartRef.value) return

  const chart = echarts.init(visitorChartRef.value)

  const option = {
    legend: {
      data: ['访客量', '新增用户']
    },
    tooltip: {
      trigger: 'axis'
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
      data: ['text', 'text', 'text', 'text', 'text', 'text']
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '访客量',
        type: 'line',
        smooth: true,
        data: [30, 32, 40, 50, 35, 35],
        itemStyle: {
          color: '#4e73df'
        },
        lineStyle: {
          width: 3
        }
      },
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: [15, 15, 20, 45, 30, 15],
        itemStyle: {
          color: '#36b9cc'
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  }

  chart.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}
const items = [
  { title: '商品管理', count: 234 },
  { title: '会员管理', count: 234 },
  { title: '订单管理', count: 234 },
  { title: '优惠券管理', count: 234 },
  { title: '商品管理', count: 234 },
  { title: '商品管理', count: 234 }
]

// 数据卡片
const dataCards = reactive([
  {
    title: '会员总数(全平台)',
    value: '1,000,000',
    subTitle: '今日订单',
    subValue: '39',
    icon: 'user-solid',
    class: 'card-purple'
  },
  {
    title: '成交额',
    value: '$234,568',
    icon: 's-order',
    subTitle: '昨日订单数',
    subValue: '112',
    class: 'card-blue'
  },
  {
    title: '下载量',
    value: '666,666',
    icon: 'TrendCharts',
    subTitle: '近七日金额',
    subValue: '39',
    class: 'card-cyan'
  },
  {
    title: '转化率',
    value: '999,999',
    icon: 'PieChartIcon',
    subTitle: '本月新增',
    subValue: '39',
    class: 'card-orange'
  }
])

// 趋势图时间范围
// const trendTimeRange = ref('month')
const trendChartRef = ref(null)
const pieChartRef = ref(null)
let trendChart = null
let pieChart = null

// 表格数据
const tableData = reactive([
  {
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['wow']
  },
  {
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  },
  {
    name: 'Soybean',
    age: 25,
    address: 'China Shenzhen',
    tags: ['handsome', 'programmer']
  }
])

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  // 销售趋势数据
  const hours = [
    '00:00',
    '02:00',
    '04:00',
    '06:00',
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '22:00'
  ]

  // 生成随机数据
  const generateData = (baseValue, rangeValue) => {
    const data: number[] = []
    for (let i = 0; i < 24; i++) {
      data.push(Math.round(Math.random() * rangeValue) + baseValue)
    }
    return data
  }

  const option = {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['销售额', '访问量', '下载量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: hours
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,

        emphasis: {
          focus: 'series'
        },
        data: generateData(5000, 2000)
      },
      {
        name: '访问量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,

        emphasis: {
          focus: 'series'
        },
        data: generateData(3000, 1000)
      },
      {
        name: '下载量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,

        emphasis: {
          focus: 'series'
        },
        data: generateData(2000, 800)
      }
    ]
  }
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption(option)

    // 响应式调整
    window.addEventListener('resize', () => {
      trendChart?.resize()
    })
  }
}

// 初始化饼图
function initPieChart() {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['50%', '70%'], // 修改为环形图：内半径和外半径
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' }
        ]
      }
    ]
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption(option)

    // 响应式调整
    window.addEventListener('resize', () => {
      pieChart?.resize()
    })
  }
}

// 处理日期变化
const handleDateChange = (val) => {
  console.log('日期范围变化:', val)
  // 这里可以根据日期范围重新加载数据
}

// // 处理趋势图时间范围变化
// const handleTrendRangeChange = (val) => {
//   console.log('趋势图时间范围变化:', val)
//   // 这里可以根据时间范围重新加载趋势图数据
// }

// 获取标签类型
const getTagType = (tag) => {
  const types = {
    nice: '',
    developer: 'success',
    wow: 'warning',
    cool: 'info',
    teacher: 'danger',
    handsome: 'success',
    programmer: 'primary'
  }
  return types[tag] || ''
}

// 组件挂载后初始化图表
onMounted(async () => {
  await nextTick()
  initTrendChart()
  initPieChart()
  initVisitorChart()
  shopList.value = (
    await ShopApi.getShopPage({
      pageNo: 1,
      pageSize: 100
    })
  ).list
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-greeting {
  margin-left: 15px;
}

.greeting-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.weather-info {
  font-size: 13px;
  color: #666;
}

.store-selector {
  width: 200px;
}

.dashboard-filters {
  display: flex;
  align-items: center;
  width: 280px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.data-cards {
  margin-bottom: 20px;
}

.app-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 0.3s;
  background-color: #f5f7fa;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
}

.app-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  color: white;
  font-size: 20px;
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

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    font-size: 24px;
    color: white;
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

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
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
  height: 300px;
  width: 100%;
}

.timeline-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.timeline-header {
  font-size: 16px;
  font-weight: 500;
}

.table-card {
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  font-size: 16px;
  font-weight: 500;
}

.table-tag {
  margin-right: 5px;
}

// 响应式调整
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .dashboard-filters {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .chart-container {
    height: 250px;
  }
}
</style>
