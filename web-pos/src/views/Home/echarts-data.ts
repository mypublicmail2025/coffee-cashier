import { EChartsOption } from 'echarts'

const { t } = useI18n()

export const buryPointOptions: EChartsOption = {
  title: {
    text: t('analysis.monthlySales'),
    left: 'center'
  },
  xAxis: {
    data: [],
    boundaryGap: false,
    axisTick: {
      show: false
    }
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 20,
    top: 80,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    padding: [5, 10]
  },
  yAxis: {
    axisTick: {
      show: false
    }
  },
  series: [
    {
      name: t('workplace.userSessions'),
      smooth: true,
      type: 'line',
      itemStyle: {},
      data: [],
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }
  ]
}

export const storeOrderOptions: EChartsOption = {
  title: {
    text: t('analysis.monthlySales'),
    left: 'center'
  },
  xAxis: {
    data: [],
    boundaryGap: false,
    axisTick: {
      show: false
    }
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 20,
    top: 80,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    padding: [5, 10]
  },
  yAxis: {
    axisTick: {
      show: false
    }
  },
  series: [
    {
      name: t('workplace.userSessions'),
      smooth: true,
      type: 'line',
      itemStyle: {},
      data: [],
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }
  ]
}


