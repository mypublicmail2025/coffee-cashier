import yHeader from './basics/header/app/index.vue'
import banner from './basics/banner.vue'
import text from './basics/text.vue'
import imageText from './basics/imageText.vue'
import brandList from './basics/brandList.vue'
import categoryList from './basics/categoryList.vue'
import imageTextList from './basics/imageTextList.vue'
import assistDiv from './basics/assistDiv.vue'
import imageTextNav from './basics/imageTextNav.vue'
import productList from './basics/product/app/index.vue'
import videoBox from './basics/video.vue'
import coupon from './basics/coupon/index.vue'
import custom from './basics/custom.vue'
import notice from './basics/notice.vue'
import vip from './basics/vip/app/index.vue'
import groupList from './basics/group/app/index.vue'
import spikeList from './basics/spike/app/index.vue'
import priceList from './basics/price/app/index.vue'
import discountList from './basics/discount/app/index.vue'
import newProduct from './basics/newProduct/app/index.vue'
import live from './basics/live/app/index.vue'
import shop from './basics/shop.vue'

export const componentMap = {
  'header': yHeader, // 首页头部
  'banner': banner, // 轮播图
  'text': text, // 文本
  'imageText': imageText, // 图文
  'brandList': brandList, // 品牌列表
  'categoryList': categoryList, // 类别列表
  'imageTextList': imageTextList, // 图文列表
  'assistDiv': assistDiv, // 铺助分割
  'imageTextNav': imageTextNav, // 图文导航
  'productList': productList, // 商品列表
  'videoBox': videoBox, // 视频
  'coupon': coupon, // 优惠券
  'custom': custom, // 自定义
  'notice': notice, // 公告
  'vip': vip, // 会员专区
  'groupList': groupList, // 拼团专区
  'spikeList': spikeList, // 秒杀专区
  'priceList': priceList, // 定价捆绑
  'discountList': discountList, // 限时折扣
  'newProduct': newProduct, // 每日上新
  'live': live, // 直播
  'shop': shop, // 每日好店
}
export default componentMap
