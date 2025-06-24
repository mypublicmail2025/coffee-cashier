import api from '../../config/api'
import { funMixin } from '../../config/mixin'
import { ref, onMounted, watch } from 'vue';
import { canvasStore } from '@/components/canvas/store/canvas'
import { storeToRefs } from 'pinia';
import canvasConfig from '../../config/config'
const canvasStoreObj = canvasStore();

export default function (componentContent, typeId, shopId) {
  const { sendReq, beforeGetData, afterGetData, jumpStore } = funMixin()
  const couponsData = ref([])
  const { couponNum } = storeToRefs(canvasStoreObj);
  const isEdit = localStorage.getItem('isEdit')

  onMounted(() => {
    getData()
  })

  // 获取优惠券列表
  function getData () {
    if (
      componentContent.value.selectedCoupon &&
      componentContent.value.selectedCoupon.length > 0
    ) {
      beforeGetData()
      let _url = `${api.getCoupons}?isPage=2&ids=${componentContent.value.selectedCoupon}`
      const params = {
        method: 'GET',
        url: _url,
      }
      sendReq(
        params,
        (res) => {
          afterGetData()
          couponsData.value = res.data.list
        },
        () => {
          afterGetData()
        }
      )
    } else {
      couponsData.value = []
    }
  }

  // 领取优惠券
  async function receiveCoupon (item) {
    if (isEdit !== 'true') {
      var paramsData = {}
      var token = canvasConfig.getToken()
      if (typeof uni !== 'undefined') {
        if (token) {
          if (typeId.value === 1) {
            paramsData.couponId = item.couponId
          } else if (typeId.value === 3) {
            paramsData.shopCouponId = item.shopCouponId
            paramsData.shopId = shopId.value
          }
          const params = {
            url: api.takeCoupon,
            method: 'POST',
            data: paramsData,
          }
          sendReq(params).then(res => {
            getData()
            uni.showToast({
              title: '领取成功',
              icon: 'success'
            })
          }).catch(res => {
            if (res.data.code !== '200') {
              uni.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          })
        } else {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages_category_page2/userModule/login'
          })
        }
      } else {
        if (token) {
          if (typeId.value === 1) {
            paramsData.couponId = item.couponId
          } else if (typeId.value === 3) {
            paramsData.shopCouponId = item.shopCouponId
            paramsData.shopId = shopId.value
          }
          const params = {
            url: api.takeCoupon,
            method: 'POST',
            data: paramsData,
          }
          sendReq(params).then(res => {
            ElMessage({
              message: '领取成功！',
              type: 'success'
            })
            getData()
          }).catch(res => {
            if (res.data.code !== '200') {
              ElMessage({
                message: res.data.message,
                type: 'success'
              })
            }
          })
        } else {
          ElMessage({
            message: '请先登录'
          })
          // 登录弹框
          // store.commit('IS_LOGIN', false) // 清除顶部个人中心数据
          // store.commit('SHOW_LOGIN') // 调用登录弹框
        }
      }
    }
  }

  watch(() =>
    couponNum,
  (newVal) => {
    getData()
  }, { immediate: false, deep: true })

  return {
    componentContent,
    couponsData,
    receiveCoupon,
    jumpStore
  }
}
