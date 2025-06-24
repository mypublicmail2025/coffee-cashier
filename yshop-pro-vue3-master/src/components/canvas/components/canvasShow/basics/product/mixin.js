import api from '../../config/api'
import { funMixin } from '../../config/mixin'
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { canvasStore } from '@/components/canvas/store/canvas'
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();

export default function (componentContent) {
  const { sendReq, beforeGetData, afterGetData, jumpProductDetail, jumpProList } = funMixin()
  const { productNum } = storeToRefs(canvasStoreObj);
  const productData = ref([])
  onMounted(() => {
    getData(true)
  })

  function getData (isFirst) {
    if (componentContent.value.productData.sourceType === '1') {
      if (
        componentContent.value.productData.productIdList?.length > 0
      ) {
        beforeGetData()
        sendReq(
          {
            url: `${api.getProducts}?page=1&isPage=2&ids=${componentContent.value.productData.productIdList}`,
            method: 'GET',
          },
          (proRes) => {
            afterGetData()
            productData.value = proRes.data.list
            if (isFirst) {
              componentContent.value.productData.imgTextData = productData.value
            }
          },
          () => {
            afterGetData()
          }
        )
      } else {
        productData.value = []
      }
    } else if (componentContent.value.productData.sourceType === '2') {
      if (componentContent.value.productData?.categoryId) {
        beforeGetData()
        sendReq(
          {
            url: `${api.getProducts}?page=1&isPage=2&cateId=${componentContent.value.productData.categoryId}`,
            method: 'GET',
          },
          (proRes) => {
            afterGetData()
            productData.value = proRes.data.list
            if (isFirst) {
              componentContent.value.productData.imgTextData = productData.value
            }
            // _.swiper.update()
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

  // 获取进度条数字
  function getPercentageNum(item){
    const total = item.campaignTotal || item.total
    const stock = item.campaignStock || item.stock
    return (total-stock)/total * 100
  }

  watch(() =>
    productNum,
  (newVal) => {
    getData()
  }, { immediate: false, deep: true })
  // const swiper = computed(()=>{
  //   if (this.$refs.mySwiper) {
  //     return this.$refs.mySwiper.$swiper
  //   }
  // })
  return {
    productData,
    jumpProductDetail,
    jumpProList,
    getPercentageNum
  }
}
