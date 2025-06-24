export const componentMap = new Map([
  ['header', () => import('./BasicsComp/headerTool.vue')], // 头部
  ['banner', () => import('./BasicsComp/bannerTool.vue')], // 轮播图
  ['text', () => import('./BasicsComp/textTool.vue')], // 文本
  ['videoBox', () => import('./BasicsComp/videoTool.vue')], // 视频控件
  ['imageText', () => import('./BasicsComp/imageText.vue')], // 图文控件
  ['imageTextNav', () => import('./BasicsComp/imageTextNav.vue')], // 图文导航
  ['assistDiv', () => import('./BasicsComp/assistDiv.vue')], // 铺助分割
  ['custom', () => import('./BasicsComp/customTool.vue')], // 自定义控件
  ['brandList', () => import('./BasicsComp/brandList.vue')], // 品牌列表
  ['imageTextList', () => import('./BasicsComp/imageTextList.vue')], // 图文列表
  ['notice', () => import('./BasicsComp/noticeTool.vue')], // 公告
  ['coupon', () => import('./MarketingComp/couponTool.vue')], // 优惠券
  ['categoryList', () => import('./goodsComp/categoryTool.vue')], // 类别列表
  ['productList', () => import('./goodsComp/productList.vue')], // 商品列表
  ['groupList', () => import('./shopComp/groupTool.vue')], // 拼团专区
  ['spikeList', () => import('./shopComp/spikeTool.vue')], // 秒杀专区
  ['priceList', () => import('./shopComp/priceTool.vue')], // 定价捆绑
  ['discountList', () => import('./shopComp/discountTool.vue')], // 折扣列表
  ['vip', () => import('./shopComp/vipTool.vue')], // 会员专区
  ['newProduct', () => import('./shopComp/newProductTool.vue')], // 会员专区
  ['live', () => import('./shopComp/liveTool.vue')], // 直播
  ['shop', () => import('./shopComp/shopTool.vue')], // 每日好店
])
export default componentMap
