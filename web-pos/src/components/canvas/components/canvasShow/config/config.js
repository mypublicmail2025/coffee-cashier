// 画布配置
import Cookies from 'js-cookie'

const config = {
  terminal: 2, // 画布设备 1 小程序，2 H5，3 App 4 电脑
  typeId: 3, // 页面类型 0 PC端 1 平台画布，2 自定义页面，3 商家店铺装修
  getToken: function () {
    // 平台端
    // return Cookies.get('cereShopAdminToken')
    // 商家端
    return Cookies.get('cereShopBussesToken')
    // PC端
    // return Cookies.get(‘token’)
    // 移动端
    // return uni.getStorageSync('storage_key').token;
  },
}

export default config
