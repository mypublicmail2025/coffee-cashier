import { defineStore } from 'pinia'
import config from '@/components/canvas/components/canvasShow/config/config'

export const canvasStore = defineStore({
  id: 'canvas',
  state: () => ({
    terminal: config.terminal, // 画布设备 1 小程序，2 H5，3 App 4 电脑
    activeComponent: {}, // 选中模板数据
    componentsData: [], // 模板组件数据
    typeId: config.typeId, // 页面类型 1 平台画布，2 自定义页面，3 商家店铺装修
    couponNum: 0,
    discountNum: 0,
    groupNum: 0,
    newProductNum: 0,
    priceNum: 0,
    productNum: 0,
    spikeNum: 0,
  }),
  actions: {
    setTerminal (data) {
      this.terminal = data
    },
    setActiveComponent (data) {
      this.activeComponent = data
    },
    setComponentsData (data) {
      this.componentsData = data
    },
    setTypeId (data) {
      this.typeId = data
    },
    setCouponNum () {
      this.couponNum += 1
    },
    setDiscountNum () {
      this.discountNum += 1
    },
    setGroupNum () {
      this.groupNum += 1
    },
    setNewProductNum () {
      this.newProductNum += 1
    },
    setPriceNum () {
      this.priceNum += 1
    },
    setProductNum () {
      this.productNum += 1
    },
    setSpikeNum () {
      this.spikeNum += 1
    },
  },
  getters: {
    getTerminal: (state) => state.terminal,
    getActiveComponent: (state) => state.activeComponent,
    getComponentsData: (state) => state.componentsData,
    getTypeId: (state) => state.typeId,
    getCouponNum: (state) => state.couponNum,
    getDiscountNum: (state) => state.discountNum,
    getGroupNum: (state) => state.groupNum,
    getNewProductNum: (state) => state.newProductNum,
    getPriceNum: (state) => state.priceNum,
    getProductNum: (state) => state.productNum,
    getSpikeNum: (state) => state.spikeNum
  }
})
