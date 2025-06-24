import api from '../../config/api'
import { funMixin } from '../../config/mixin'
import { ref, onMounted } from 'vue';

const commonMixin = () => {
  const { sendReq, beforeGetData, afterGetData, jumpVip, jumpProductDetail } = funMixin()
  const productData = ref([])
  onMounted(() => {
    getData()
  })

  function getData () {
    beforeGetData()
    sendReq(
      {
        url: `${api.getMemberProducts}?page=1&pageSize=20`,
        method: 'GET',
      },
      (proRes) => {
        afterGetData()
        productData.value = proRes.data.list
      },
      () => {
        afterGetData()
      }
    )
  }

  return {
    productData,
    jumpVip,
    jumpProductDetail
  }
}

export default commonMixin
