import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  acceptOrder, 
  rejectOrder, 
  completeOrder, 
  getOrderDetail,
  getOrderList,
  makeFinishOrder,
  batchAcceptOrder,
  batchRejectOrder,
  updateOrderRemark,
  printReceipt,
  verifyOrder,
} from '@/api/mall/order/onlineOrder'
import type { Order } from '../types/order'
import type { OrderSearchParams } from '@/api/mall/order/types'
import {useAppStore} from '@/store/modules/app'
// Use the hook 
const appStore = useAppStore()


const orderTypeTabs=[
  {
    name: 'pending-order',
    label: '待接单',
    type: 'pending-order',
    count: appStore.eachStatusOrderCount?.pendingOrders || 0
  },
  {
    name: 'make-finish-order',
    label: '制作中',
    type: 'make-finish-order',
    count: appStore.eachStatusOrderCount?.inProduction || 0
  },
  {
    name: 'verify-order',
    label: '待核销',
    type: 'verify-order',
    count: appStore.eachStatusOrderCount?.pendingCancellation || 0
  },
  {
    name: 'delivery-order',
    label: '配送中',
    type: 'delivery-order',
    count: appStore.eachStatusOrderCount?.inDelivery || 0
  },

]

export function useOnlineOrder() {
  // Main tab state
  const activeMainTab = ref('pending-order')

  // State variables
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(12)
  const orders = ref<Order[]>([])
  const totalCount = ref(0)
  
  // 搜索条件
  const searchParams = ref<OrderSearchParams>({
    pageNo: 1,
    pageSize: 12,
    orderStatusSet: [0],
  })

  // 日期范围
  const dateRange = ref<string[]>([])

  // Detail dialog state
  const detailDialogVisible = ref(false)
  const scannerVisible = ref(false)
  const verifyOrderId = ref<number>(0)
  const shansongLocationVisible = ref(false)
  const shansongLocationOrderId = ref<string>('')
  const selectedOrder = ref<Order | null>(null)


  // 构建查询参数
  const buildSearchParams = () => {
    const params: OrderSearchParams = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      orderStatusSet: getStatusByMainTab(),
      shippingTypeSet: getShippingTypeByMainTab(),
    }
    
    // 如果有日期范围，添加到查询参数
    if (dateRange.value && dateRange.value.length === 2) {
      params.createTime = dateRange.value
    }
    
    // 合并其他搜索条件
    if (searchParams.value.orderId) {
      params.orderId = searchParams.value.orderId
    }
    
    if (searchParams.value.realName) {
      params.realName = searchParams.value.realName
    }
    
    if (searchParams.value.userPhone) {
      params.userPhone = searchParams.value.userPhone
    }
    
    if (searchParams.value.search) {
      params.search = searchParams.value.search
    }
    
    return params
  }

  // Fetch orders from API
  const fetchOrders = async (isMore = false) => {
    // Don't fetch if not in order center tab

    if (loading.value) {
      return
    }
    if (!isMore){
      loading.value = true
    }else{
      currentPage.value = currentPage.value + 1
    }
    searchParams.value.pageNo = currentPage.value
    
    try {
      // 取消下面这行的注释可以强制使用模拟数据，便于开发测试
      // throw new Error('使用模拟数据进行测试')
      
      const params = buildSearchParams()
      const response = await getOrderList(params)
      if (response && response.list ) {
        if(isMore){
          orders.value = [...orders.value, ...response.list]
        }else{
          orders.value = response.list || []
        }
        totalCount.value = response.total || 0
       
      } else {
        ElMessage.error(response?.msg || '获取订单列表失败')
        console.info('API返回错误，使用模拟数据')
      }
      loading.value = false
    } catch (error) {
      console.error('获取订单列表失败:', error)
      ElMessage.warning('使用模拟数据进行展示')
      loading.value = false
    } finally {
      loading.value = false
    }
  }


  // Helper functions
  const getOrderStatusSetByTab = () => {
    switch (activeMainTab.value) {
      case 'pending-order': return [9]
      case 'make-finish-order': return [10]
      case 'verify-order': return [11]
      case 'delivery-order': return [12,20,30]
      default: return [9]
    }
  }

  const getStatusByMainTab = () => {
    switch (activeMainTab.value) {
      case 'pending-order': return [9]
      case 'make-finish-order': return [10]
      case 'verify-order': return [11]
      case 'delivery-order': return [12, 20, 30]
      default: return [9]
    }
  }

  const getShippingTypeByMainTab = () => {
    switch (activeMainTab.value) {
      case 'pending-order': return []
      case 'make-finish-order': return []
      case 'verify-order': return [2,3]
      case 'delivery-order': return [1]
      default: return []
    }
  }

  // Event handlers
  const handleOrderTypeTabClick = (tab: string) => {
    activeMainTab.value = tab
    currentPage.value = 1
    searchParams.value.orderStatusSet = getOrderStatusSetByTab()
    fetchOrders()
  }

  const handlePageChange = (page: number) => {
   
    if (page === 1){
      fetchOrders()
    }else{
      fetchOrders(true)
    }
  }

  // 搜索订单
  const handleSearch = () => {
    currentPage.value = 1
    searchParams.value.pageNo = 1
    if (dateRange.value && dateRange.value.length === 2) {
      searchParams.value.createTime = dateRange.value
    }
    fetchOrders()
  }

  // 重置搜索条件
  const resetSearch = () => {
    searchParams.value = {
      pageNo: 1,
      pageSize: 10,
      orderStatusSet: getStatusByMainTab(),
    }
    dateRange.value = []
    currentPage.value = 1
    fetchOrders()
  }

  const handleAcceptOrder = async (orderId: number) => {
    return new Promise<void>((resolve, reject) => {
      ElMessageBox.confirm('是否确认接单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // 模拟数据处理
          
          
          const response = await acceptOrder([orderId])
          
          if (response && response.code === 0) {
            ElMessage.success('接单成功')
            await fetchOrders()
            resolve()
          } else {
            ElMessage.error(response?.msg || '接单失败')
            reject(new Error(response?.msg || '接单失败'))
          }
        } catch (error) {
          console.error('接单失败:', error)
          ElMessage.error('接单失败')
          reject(error)
        }
      }).catch(() => {
        // User canceled
        reject(new Error('用户取消操作'))
      })
    })
  }

  const handleScanSuccess = async (writeOffCode:string) => {
    const writeOffInfo = typeof writeOffCode === 'string' ? JSON.parse(writeOffCode) : writeOffCode;
    if (verifyOrderId?.value!==-1&&writeOffInfo.orderId !== verifyOrderId?.value){
      ElMessage.error('订单不匹配')
      return
    }
    const response = await verifyOrder(writeOffInfo.orderId, writeOffInfo.writeOffCode)
    if (response ) {
      ElMessage.success('核销成功')
      await fetchOrders()
      scannerVisible.value = false
    } else {
      ElMessage.error(response?.msg || '核销失败')
    }
  }

  const handleVerify = (orderId:number) => {
    scannerVisible.value = true
    verifyOrderId.value = orderId

  }

  // 批量接单
  const handleBatchAccept = async (orderIds: number[]) => {
    return new Promise<void>((resolve, reject) => {
      if (!orderIds || orderIds.length === 0) {
        ElMessage.warning('请选择要接单的订单')
        reject(new Error('未选择订单'))
        return
      }
      
      ElMessageBox.confirm(`是否确认接受选中的 ${orderIds.length} 个订单？`, '批量接单', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await batchAcceptOrder(orderIds)
          
          if (response && response.code === 0) {
            ElMessage.success('批量接单成功')
            await fetchOrders()
            resolve()
          } else {
            ElMessage.error(response?.msg || '批量接单失败')
            reject(new Error(response?.msg || '批量接单失败'))
          }
        } catch (error) {
          console.error('批量接单失败:', error)
          ElMessage.error('批量接单失败')
          reject(error)
        }
      }).catch(() => {
        reject(new Error('用户取消操作'))
      })
    })
  }


  const handleRejectOrder = async (orderId: number) => {

    return new Promise<void>((resolve, reject) => {
     
      ElMessageBox.confirm(`确认拒绝选中的1个订单？`, '拒单', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ({}) => {
        try {
          const response = await rejectOrder(orderId)
          if (response) {
            ElMessage.success('已拒绝订单')
            await fetchOrders()
          } else {
            reject(new Error(response?.msg || '拒绝订单失败'))
          }
        } catch (error) {
          reject(error)
        }
      }).catch((e) => {
        console.log(e)
        reject(new Error('用户取消操作'))
      })
    })
    
  }

  // 批量拒单
  const handleBatchReject = async (orderIds: number[]) => {
    return new Promise<void>((resolve, reject) => {
      if (!orderIds || orderIds.length === 0) {
        ElMessage.warning('请选择要拒绝的订单')
        reject(new Error('未选择订单'))
        return
      }
      
      ElMessageBox.confirm(`确认拒绝选中的 ${orderIds.length} 个订单？`, '批量拒单', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ({ value }) => {
        console.log(value)
        try {
          // 这里假设 batchRejectOrder API 接受多个订单ID和一个原因
          const response = await batchRejectOrder(orderIds)
          
          if (response && response.code === 0) {
            ElMessage.success('批量拒单成功')
            await fetchOrders()
            resolve()
          } else {
            ElMessage.error(response?.msg || '批量拒单失败')
            reject(new Error(response?.msg || '批量拒单失败'))
          }
        } catch (error) {
          console.error('批量拒单失败:', error)
          ElMessage.error('批量拒单失败')
          reject(error)
        }
      }).catch(() => {
        reject(new Error('用户取消操作'))
      })
    })
  }

  // 订单制作完成
  const handleMakeFinish = async (orderIds: number[]) => {

    return new Promise<void>((resolve, reject) => {
      if (!orderIds || orderIds.length === 0) {
        ElMessage.warning('请选择已制作完成的订单')
        reject(new Error('未选择订单'))
        return
      }
      
      ElMessageBox.confirm(`确认 ${orderIds.length} 个订单已制作完成？`, '订单制作完成', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await makeFinishOrder(orderIds)
          
          if (response ) {
            ElMessage.success('操作成功')
            await fetchOrders()
            resolve()
          } else {
            ElMessage.error(response?.msg || '操作失败')
            reject(new Error(response?.msg || '操作失败'))
          }
        } catch (error) {
          console.error('操作失败:', error)
          ElMessage.error('操作失败')
          reject(error)
        }
      }).catch(() => {
        reject(new Error('用户取消操作'))
      })
    })
  }

  const handlePrintReceipt = async (orderId: number) => {
    console.log('打印小票', orderId)
    const response = await printReceipt(orderId)
    if (response) {
      ElMessage.success('打印小票成功')
    } else {
      ElMessage.error(response?.msg || '打印小票失败')
    }
  }

  const handleViewOrderDetail = async (orderId: number) => {
    try {
    
      const response = await getOrderDetail(orderId)
      
      if (response ) {
        selectedOrder.value = response
        detailDialogVisible.value = true
        return response
      } else {
        ElMessage.error(response?.msg || '获取订单详情失败')
        return null
      }
    } catch (error) {
      console.error('获取订单详情失败:', error)
      ElMessage.error('获取订单详情失败')
      return null
    }
  }

  const closeOrderDetail = () => {
    detailDialogVisible.value = false
  }

  const closeScanner = () => {
    scannerVisible.value = false
  }

  const closeShansongLocation = () => {
    shansongLocationVisible.value = false
  }

  const handleViewShansongLocation = async (orderId: string) => {
    shansongLocationOrderId.value = orderId
    shansongLocationVisible.value = true
  }

  const handleAcceptOrderInDialog = async (orderId: number) => {
    try {
      await handleAcceptOrder(orderId || (selectedOrder.value ? selectedOrder.value.id : 0))
      closeOrderDetail()
    } catch (error) {
      // Error is already handled in handleAcceptOrder
    }
  }

  const handleCompleteOrder = async (orderId: number[]) => {
    return new Promise<void>((resolve, reject) => {
      ElMessageBox.confirm('是否确认完成该订单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
         
          const response = await completeOrder(orderId)
          
          if (response ) {
            ElMessage.success('订单已完成')
            await fetchOrders()
            detailDialogVisible.value = false
            resolve()
          } else {
            ElMessage.error(response?.msg || '完成订单失败')
            reject(new Error(response?.msg || '完成订单失败'))
          }
        } catch (error) {
          console.error('完成订单失败:', error)
          ElMessage.error('完成订单失败')
          reject(error)
        }
      }).catch(() => {
        // User canceled
        reject(new Error('用户取消操作'))
      })
    })
  }

  // 更新订单备注
  const handleUpdateRemark = async (orderId: number, remark: string) => {
    try {
      const response = await updateOrderRemark(orderId, remark)
      
      if (response ) {
        ElMessage.success('备注更新成功')
        return true
      } else {
        ElMessage.error(response?.msg || '更新备注失败')
        return false
      }
    } catch (error) {
      console.error('更新备注失败:', error)
      ElMessage.error('更新备注失败')
      return false
    }
  }

  // Switch main tab handler
  const switchMainTab = (tab: string) => {
    activeMainTab.value = tab
    currentPage.value = 1
    searchParams.value.orderStatusSet = getStatusByMainTab()
    fetchOrders()
  }

  // Watch for main tab changes
  watch(activeMainTab, () => {
    currentPage.value = 1
    searchParams.value.orderStatusSet = getStatusByMainTab()
    fetchOrders()
  })

  // Initialize
  onMounted(() => {
    fetchOrders()
  })

  return {
    // State
    orderTypeTabs,
    activeMainTab,
    loading,
    orders,
    totalCount,
    detailDialogVisible,
    selectedOrder,
    currentPage,
    pageSize,
    searchParams,
    dateRange,
    shansongLocationVisible,
    scannerVisible,
    shansongLocationOrderId,
    
    // Methods
    fetchOrders,
    handleOrderTypeTabClick,
    handlePageChange,
    handleAcceptOrder,
    handleBatchAccept,
    handleRejectOrder,
    handleBatchReject,
    handleMakeFinish,
    handleViewOrderDetail,
    handleAcceptOrderInDialog,
    handleCompleteOrder,
    handleUpdateRemark,
    closeOrderDetail,
    switchMainTab,
    handleSearch,
    resetSearch,
    handleScanSuccess,
    handleVerify,
    closeScanner,
    handlePrintReceipt,
    closeShansongLocation,
    handleViewShansongLocation,
    
  }
} 