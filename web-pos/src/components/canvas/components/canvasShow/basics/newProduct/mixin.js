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

export default function (componentContent) {
  const {
    sendReq,
    beforeGetData,
    afterGetData,
    jumpProductDetail,
    jumpLink
  } = funMixin()
  const {
    newProductNum
  } = storeToRefs(canvasStoreObj);
  const productData = ref([])

  onMounted(() => {
    getData(true)
  })

  function getData (isFirst) {
    if (componentContent.value.productData.sourceType === '1') {
      if (
        componentContent.value.productData.productIdList &&
        componentContent.value.productData.productIdList.length > 0
      ) {
        beforeGetData()
        sendReq({
          url: `${api.getProducts}?page=1&pageSize=99&ids=${componentContent.value.productData.productIdList}`,
          method: 'GET',
        },
        (proRes) => {
          afterGetData()
          productData.value = proRes.data.list
          if (isFirst) {
            componentContent.value.productData.imgTextData = productData.value
          }
          // $forceUpdate() // 刷新轮播图
        },
        () => {
          afterGetData()
        }
        )
      } else {
        productData.value = []
      }
    } else if (componentContent.value.productData.sourceType === '2') {
      if (componentContent.value.productData.categoryId) {
        beforeGetData()
        sendReq({
          url: `${api.getProducts}?page=1&pageSize=99&classifyId=${componentContent.value.productData.categoryId}`,
          method: 'GET',
        },
        (proRes) => {
          afterGetData()
          productData.value = proRes.data.list
          if (isFirst) {
            componentContent.value.productData.imgTextData = productData.value
          }
          // _.$forceUpdate() // 刷新轮播图
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
  }

  watch(() =>
    newProductNum,
  (newVal) => {
    getData()
  }, {
    immediate: false,
    deep: true
  })

  // const swiper = computed(()=>{
  //   if (this.$refs.mySwiper) {
  //     return this.$refs.mySwiper.$swiper
  //   }
  // })
  return {
    productData,
    jumpProductDetail,
    jumpLink
  }
}
