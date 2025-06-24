import api from '../../config/api'
import {
  funMixin
} from '../../config/mixin'
import {
  ref,
  watch,
  onMounted
} from 'vue';
import {
  canvasStore
} from '@/components/canvas/store/canvas'
import {
  storeToRefs
} from 'pinia';
const canvasStoreObj = canvasStore();

export default function (componentContent, typeId, shopId) {
  const {
    sendReq,
    beforeGetData,
    afterGetData,
    jumpProductDetail,
    jumpGroupWorks
  } = funMixin()
  const productData = ref([])
  const {
    groupNum
  } = storeToRefs(canvasStoreObj);

  onMounted(() => {
    getData()
  })

  function getData () {
        beforeGetData()
        const params = {
          method: 'POST',
          url: api.getActivityProduct,
          data: {
            isPage: 2,
            type: 1
          }
        }
        sendReq(
          params,
          (res) => {
            afterGetData()
            productData.value = res.data.list
          },
          () => {
            afterGetData()
          }
        )
  }

  watch(() =>
    groupNum,
  (newVal) => {
    getData()
  }, {
    immediate: false,
    deep: true
  })

  return {
    productData,
    jumpProductDetail,
    jumpGroupWorks
  }
}
