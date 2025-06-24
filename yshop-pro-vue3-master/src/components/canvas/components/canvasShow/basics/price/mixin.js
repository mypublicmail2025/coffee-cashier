import api from '../../config/api'
import {
  funMixin
} from '../../config/mixin'
import {
  ref,
  onMounted,
  watch
} from 'vue';
import {
  canvasStore
} from '@/components/canvas/store/canvas'
import {
  storeToRefs
} from 'pinia';
const canvasStoreObj = canvasStore();

export default function (componentContent, shopId) {
  const {
    sendReq,
    beforeGetData,
    afterGetData,
    jumpProductDetail,
    jumpPrice
  } = funMixin()
  const {
    priceNum
  } = storeToRefs(canvasStoreObj);
  const productData = ref({
    composeProducts: [],
    rules: [{
      price: null,
      number: null,
    }],
  })

  onMounted(() => {
    getData(true)
  })

  function getData () {
    if (componentContent.value.priceId) {
      beforeGetData()
      const params = {
        method: 'GET',
        url: `${api.getPrices}?shopId=${shopId.value}&ids=${componentContent.value.priceId}`,
      }
      sendReq(
        params,
        (res) => {
          afterGetData()
          if (res.data.length > 0) {
            productData.value = res.data[0]
          }
        },
        () => {
          afterGetData()
        }
      )
    } else {
      productData.value = {
        products: [],
      }
    }
  }

  watch(() =>
    priceNum,
  (newVal) => {
    getData()
  }, {
    immediate: false,
    deep: true
  })

  return {
    productData,
    jumpProductDetail,
    jumpPrice
  }
}
