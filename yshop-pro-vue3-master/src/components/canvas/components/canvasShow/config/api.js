// 导入api接口模块

// 获取当前环境变量 true => 生产环境 false => 开发环境
const BASEURL = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL
console.log(BASEURL,'BASEURL')
// const BASEURL = 'https://ceres.zkthink.com/api' // 移动端

export const api = {
  // 画布模块
  fileUpload: import.meta.env.VITE_UPLOAD_URL, // 文件上传
  getClassify: BASEURL + '/product/category/tree', // 查询分类层级
  getProducts: BASEURL + '/product/store-product/canvas/page', // 选择商品查询
  saveCanvas: BASEURL + '/shop/canvas/update-json', // 保存画布
  getCanvas: BASEURL + '/shop/canvas/getDetail', // 读取画布
  getShops: BASEURL + '/canvas/getShops', // 选择店铺查询
  getCoupons: BASEURL + '/product/coupon/canvas/page', // 优惠券查询
  takeCoupon: BASEURL + '/product/coupon/relation/receive/', // 领取优惠券
  selectCanvasCustomList: BASEURL + '/canvas/selectCanvasCustomList', // 自定义页面查询
  getActivities: `${BASEURL}/product/campaign-info/canvas/page`, // 获取活动
  getActivityProduct: `${BASEURL}/product/campaign-info/canvas/product-page`, // 获取活动商品
  getActivity: `${BASEURL}/product/campaign-info/get`, // 获取单个活动
  getActivityByType: `${BASEURL}/product/campaign-info/getByType`, // 根据类型获取单个活动
  getCanvasPage: `${BASEURL}/shop/canvas/page`, // 获取单个活动
}
export default api
