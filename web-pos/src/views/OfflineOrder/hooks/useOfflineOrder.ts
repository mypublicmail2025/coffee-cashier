import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryList } from '@/api/mall/product/category'
import { getStoreProductPage } from '@/api/mall/product/product'
import { useUserStore } from '@/store/modules/user'
import { 
  createOfflineOrder, 
  createStoreCart, 
  updateProductQuantity, 
  changeSku, 
  getStoreCartList, 
  delStoreCart, 
  getStoreCartNum,
  OfflineOrderParams,
  CreateStoreCartParams,
  UpdateProductQuantityParams,
  ChangeSkuParams,
  OfflineOrderPayParams,
  cashierPay
} from '@/api/mall/order/offlineOrder'
import wechat from '@/assets/imgs/order/wx.png'
import alipay from '@/assets/imgs/order/zfb.png'
import yue from '@/assets/imgs/order/yue.png'
import moneyCircle from '@/assets/svgs/money_circle.svg'
import {printReceipt} from '@/api/mall/order/onlineOrder'
import {getUser} from '@/api/member/user'
export function useOfflineOrder() {
  // 用户信息
  const userStore = useUserStore()
  const nickName = userStore.getUser.nickname ? userStore.getUser.nickname : '-'
  const shopId = userStore.shopId ? userStore.shopId : 11
  // 关联会员相关
  const userSelectDialogVisible = ref(false)
  const currentCustomUser = ref<any>(null)

  // 搜索和分类相关
  const searchKeyword = ref('')
  const activeTabIndex = ref(0)
  const activeCategoryIndex = ref(0)
  const productTabs = ref<any[]>([])
  const categories = ref<any[]>([])
  const products = ref<any[]>([])
  const allProducts = ref<any[]>([])
  const productResponse = ref<any>({})
  const paymentSuccessDialogVisible = ref(false)
  const paymentFailedDialogVisible = ref(false)

  // 购物车相关
  const shopCartItems = ref<any[]>([])
  const currentCart = ref<any>({})

  const activePaymentMethod = ref(0)
  const discountAmount = ref(0) // 修改默认值为0
  const pendingOrders = ref<any[]>([])
  const pendingOrdersVisible = ref(false)
  const cartLoading = ref(false)
  const cartCount = ref(0)
  
  // 优惠券相关
  const couponDialogVisible = ref(false)
  const selectedCoupon = ref<any>(null)
  const manualDiscount = ref<any>(null)

  // 商品详情弹窗
  const specDialogVisible = ref(false)
  const selectedProduct = ref<any>({})
  const payOrderResponse = ref<any>({})

  // 订单备注
  const orderRemark = ref('')

  // 支付方式
  const paymentMethods = [
    {payType:'weixin_micropay', name: '微信', img: wechat },
    {payType:'ali_micropay', name: '支付宝', img: alipay },
    {payType:'yue', name: '余额', img: yue },
    {payType: 'now_money', name: '现金', img: moneyCircle }
  ]

  // 添加扫码相关状态
  const scannerVisible = ref(false)
  // 扫码类型 user:会员码 pay:支付码
  const scannerType = ref('user')

  // 添加现金结算弹框状态
  const cashPaymentVisible = ref(false)

  // 计算属性
  const totalAmount = computed(() => {
    return parseFloat(shopCartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2))
  })

  // 订单优惠后的金额
  const totalOrderAmount = computed(() => {
    const result = Math.max(0, parseFloat((totalAmount.value*100 - discountAmount.value*100).toFixed(2))/100)
    if(manualDiscount.value > 0){
      return result - manualDiscount.value
    }
    return result
  })

  const totalItems = computed(() => {
    return shopCartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // 通过当前选中的商品分类获取子集分类
  const fetchProductTabList = async () => {
    try {
      const response = await getCategoryList({
        sid: 0
      })

      if (response) {
        // 初始化显示第一个标签对应的分类
        productTabs.value = [ ...response]
        fetchChildrenCategoryList(productTabs.value[0].id)
        // 获取商品列表
        fetchProductList(productTabs.value[0]?.id)
      } else {
        console.warn('分类树数据为空或格式不正确:', response)
      }
    } catch (error) {
      console.error('获取分类树数据失败:', error)
      ElMessage.error('获取分类树数据失败')
    }
  }

  // 通过当前选中的商品分类获取子集分类
  const fetchChildrenCategoryList = async (productId) => {
    try {
      const response = await getCategoryList({
        sid: productId
      })
      
      if (response) {
        // 初始化显示第一个标签对应的分类
        updateCategoriesByTab(response)
        fetchProductList(productTabs.value[0]?.id)
      } else {
        console.warn('分类树数据为空或格式不正确:', response)
      }
    } catch (error) {
      console.error('获取分类树数据失败:', error)
      ElMessage.error('获取分类树数据失败')
    }
  }

  // 获取商品列表 - 更新以适应新的API返回格式
  const fetchProductList = async (categoryId) => {
    try {
      const params: any = {
        pageNo: 1,
        pageSize: 100,
        isShow: 1,
        stock: 1
      }
      
      if (categoryId) {
        params.sid = categoryId
      }

      const response = await getStoreProductPage(params)
      
      const activeCategory = categories.value[activeCategoryIndex.value]

      if (response && response) {
        // 新的API返回格式是按分类ID分组的商品列表
        // 如果指定了分类ID，优先获取该分类的商品
        productResponse.value = response||{}
        if (activeCategory && productResponse.value[activeCategory.id]) {
          products.value = productResponse.value[activeCategory.id]
          allProducts.value = products.value
        }else{
          products.value = []
          allProducts.value = []
        } 
      } else {
        console.warn('获取商品列表数据为空或格式不正确:', response)
        products.value = []
        allProducts.value = []
      }
    } catch (error) {
      console.error('获取商品列表失败:', error)
      ElMessage.error('获取商品列表失败')
      products.value = []
      allProducts.value = []
    }
  }

  // 修改 updateCategoriesByTab 函数
  const updateCategoriesByTab = (response) => {
    categories.value = response
    // 重置分类选择为"全部"
    activeCategoryIndex.value = 0
  }

  // 切换标签
  const switchTab = (index) => {
    activeTabIndex.value = index
    fetchChildrenCategoryList(productTabs.value[index].id)
  }

  // 切换分类
  const switchCategory = (index) => {
    activeCategoryIndex.value = index
    const activeCategory = categories.value[activeCategoryIndex.value]
    products.value = productResponse.value[activeCategory.id]||[]
  }

  // 处理搜索
  const handleSearch = (searchKeyword) => {

    // 根据搜索关键词过滤产品
    if (searchKeyword) {
      const filteredProducts = allProducts.value.filter(product => 
        product.storeName?.toLowerCase().includes(searchKeyword.toLowerCase())
      )
      
      if (filteredProducts.length > 0) {
        products.value = filteredProducts
      } else {
        ElMessage.info('没有找到匹配的商品')
      }
    } else {
      products.value = allProducts.value
    }
  }

  // 清除搜索
  const handleClear = () => {
    // 重新加载当前分类的所有商品
    fetchProductList(categories.value[activeCategoryIndex.value]?.id)
  }

  // 打开产品规格选择弹框
  const openProductSpecDialog = (product) => {
    if(!currentCustomUser.value){
      ElMessage.warning('请先关联会员')
      return
    }
    selectedProduct.value = product
    specDialogVisible.value = true
  }

  // 关闭产品规格选择弹框
  const closeProductSpecDialog = () => {
    specDialogVisible.value = false
  }

  // 购物车相关方法

  // 获取购物车列表
  const fetchCartList = async () => {
    if(!currentCustomUser.value){
      return
    }
    
    if (shopCartItems.value.length === 0) {
      cartLoading.value = true
    }
    try {
      // Pass 0 as default parameter to get all cart items
      const response = await getStoreCartList(currentCustomUser.value.id)
      if (response ) {
        // Handle new response structure with valid and invalid arrays
        const validItems = response.valid || []
        
        shopCartItems.value = validItems.map(item => ({
          id: item.id,
          productId: item.productId,
          image: item.productInfo.image,
          storeName: item.productInfo.storeName,
          price: item.truePrice,
          quantity: item.cartNum,
          spec: item.productInfo.attrInfo ? item.productInfo.attrInfo.sku : '默认规格',
          uniqueId: item.productAttrUnique,
          stock: item.trueStock || item.productInfo.stock,
          // Additional fields from new data structure
          attrInfo: item.productInfo.attrInfo
        }))
        
      } else {
        shopCartItems.value = []
      }
    } catch (error) {
      console.error('获取购物车列表失败:', error)
      ElMessage.error('获取购物车列表失败')
    } finally {
      cartLoading.value = false
    }
  }

  // 获取购物车数量
  const fetchCartCount = async () => {
    if(!currentCustomUser.value){
      return
    }
    try {
      // Pass 0 as default parameter
      const response = await getStoreCartNum(currentCustomUser.value.id)
      if (response && response.code === 0) {
        cartCount.value = response.data || 0
      }
    } catch (error) {
      console.error('获取购物车数量失败:', error)
    }
  }

  // 添加商品到购物车
  const addToCart = async (product, quantity = 1, uniqueId = '') => {
    try {
      const params: CreateStoreCartParams = {
        cartNum: quantity,
        productId: product.id,
        uniqueId: uniqueId || '',
        combinationId: 0,
        secKillId: 0,
        bargainId: 0,
        integralShopId: 0,
        orderType: 1,
        campaignId: 0,
        teamworkId: 0,
        userId: currentCustomUser.value.id,
        new: 0 // 0表示加入购物车，1表示立即购买
      }

      const response = await createStoreCart(params)
      
      if (response ) {
        currentCart.value = response
      }

      await fetchCartList() // 刷新购物车
      await fetchCartCount() // 更新购物车数量
    } catch (error) {
      console.error('添加商品到购物车失败:', error)
      ElMessage.error('添加商品到购物车失败')
    }
  }

  // 从购物车移除商品
  const removeFromCart = async (index) => {
    try {
      const product = shopCartItems.value[index]
      if (!product || !product.id) {
        shopCartItems.value.splice(index, 1)
        return
      }

      const response = await delStoreCart(product.id)
      
      if (response ) {
        shopCartItems.value.splice(index, 1)
        await fetchCartCount() // 更新购物车数量
      } else {
        ElMessage.error(response?.msg || '移除商品失败')
      }
    } catch (error) {
      console.error('从购物车移除商品失败:', error)
      ElMessage.error('从购物车移除商品失败')
    }
  }

  // 修改购物车商品数量
  const updateCartItemQuantity = async (index, newQuantity) => {
    try {
      const cartItem = shopCartItems.value[index]
      if (!cartItem || !cartItem.id) {
        cartItem.quantity = newQuantity
        return
      }

      const params: UpdateProductQuantityParams = {
        id: cartItem.id.toString(),
        number: newQuantity,
        userId: currentCustomUser.value.id
      }

      const response = await updateProductQuantity(params)
      
      if (response ) {
        cartItem.quantity = newQuantity
        await fetchCartList() // 刷新购物车
      } else {
        // 恢复原来的数量
        ElMessage.error(response?.msg || '修改商品数量失败')
      }
    } catch (error) {
      console.error('修改购物车商品数量失败:', error)
      ElMessage.error('修改购物车商品数量失败')
    }
  }

  // 增加商品数量
  const increaseQuantity = async (index) => {
    const item = shopCartItems.value[index]
    const newQuantity = item.quantity + 1
    
    if (item.stock && newQuantity > item.stock) {
      ElMessage.warning('商品库存不足')
      return
    }
    
    await updateCartItemQuantity(index, newQuantity)
  }

  // 减少商品数量
  const decreaseQuantity = async (index) => {
    const item = shopCartItems.value[index]
    
    if (item.quantity <= 1) {
      ElMessageBox.confirm('是否要从购物车中移除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeFromCart(index)
      }).catch(() => {
        // 取消操作
      })
      return
    }
    
    await updateCartItemQuantity(index, item.quantity - 1)
  }

  // 修改购物车商品规格
  const updateCartItemSku = async (cartId, productId, uniqueId) => {
    try {
      const params: ChangeSkuParams = {
        id: cartId.toString(),
        productId: productId,
        productAttrUnique: uniqueId
      }

      const response = await changeSku(params)
      
      if (response ) {
        await fetchCartList() // 刷新购物车
        ElMessage.success('商品规格已更新')
      } else {
        ElMessage.error(response?.msg || '修改商品规格失败')
      }
    } catch (error) {
      console.error('修改购物车商品规格失败:', error)
      ElMessage.error('修改购物车商品规格失败')
    }
  }

  // 处理添加到购物车
  const handleAddToCart = (data) => {
    // 添加主商品到购物车
    const mainProduct = data.mainProduct
    
    addToCart(
      { 
        id: mainProduct.id,
        storeName: mainProduct.storeName,
        image: mainProduct.image,
        price: mainProduct.price,
        stock: mainProduct.stock || 99999
      },
      mainProduct.quantity,
      mainProduct.skuUnique || ''
    )
    
    // 添加推荐商品到购物车
    if (data.recommendedProducts && data.recommendedProducts.length > 0) {
      data.recommendedProducts.forEach(recProduct => {
        addToCart(
          { 
            id: recProduct.id,
            storeName: recProduct.storeName,
            image: recProduct.image,
            price: recProduct.price,
            stock: recProduct.stock || 99999
          },
          recProduct.quantity,
          recProduct.skuUnique || ''
        )
      })
    }
    
    // 关闭规格选择弹窗
    specDialogVisible.value = false
  }

  // 选择支付方式
  const selectPaymentMethod = (index) => {
    activePaymentMethod.value = index
  }

  // 显示挂单列表
  const showPendingOrders = () => {
    pendingOrdersVisible.value = true
  }

  // 关闭挂单列表
  const closePendingOrdersDialog = () => {
    pendingOrdersVisible.value = false
  }

  // 保存为挂单
  const saveAsPendingOrder = () => {
    if (shopCartItems.value.length === 0) {
      ElMessage.warning('购物车为空，无法挂单')
      return
    }
    const timestamp = new Date().getTime()
    const pendingOrder = {
      id: timestamp,
      customerUser: currentCustomUser.value,
      time: new Date().toLocaleString(),
      items: [...shopCartItems.value],
      totalAmount: totalAmount.value,
      totalItems: totalItems.value
    }
    currentCustomUser.value = null
    
    pendingOrders.value.push(pendingOrder)
    
    // 保存到本地存储
    savePendingOrdersToStorage()
    
    // 清空购物车
    shopCartItems.value = []
    
    ElMessage.success('挂单成功')
  }

  // 加载挂单
  const loadPendingOrder = (order) => {
    // 先检查当前购物车是否为空，如果不为空，提示用户
    if (shopCartItems.value.length > 0) {
      ElMessageBox.confirm('当前购物车不为空，加载挂单将清空当前购物车，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户确认后，执行加载操作
        executeLoadPendingOrder(order)
      }).catch(() => {
        // 用户取消，不执行任何操作
      })
    } else {
      // 购物车为空，直接加载
      executeLoadPendingOrder(order)
    }
  }

  // 执行加载挂单操作
  const executeLoadPendingOrder = (order) => {
    // 恢复购物车商品
    shopCartItems.value = [...order.items]

    // 恢复支付方式
    const paymentMethodIndex = paymentMethods.findIndex(method => method.payType === order.paymentMethod)
    if (paymentMethodIndex >= 0) {
      activePaymentMethod.value = paymentMethodIndex
    }

    currentCustomUser.value = order.customerUser

    // 从挂单列表中移除该订单
    const orderIndex = pendingOrders.value.findIndex(item => item.id === order.id)
    if (orderIndex >= 0) {
      pendingOrders.value.splice(orderIndex, 1)
    }

    // 更新本地存储
    savePendingOrdersToStorage()

    ElMessage.success('挂单已加载')
    
    // 关闭挂单列表弹窗
    pendingOrdersVisible.value = false
  }

  // 生成订单ID
  const generateOrderId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // 从本地存储加载挂单数据
  const loadPendingOrdersFromStorage = () => {
    try {
      const storedOrders = localStorage.getItem('pendingOrders')
      if (storedOrders) {
        pendingOrders.value = JSON.parse(storedOrders)
      }
    } catch (error) {
      console.error('加载挂单数据失败:', error)
    }
  }

  // 保存挂单数据到本地存储
  const savePendingOrdersToStorage = () => {
    try {
      localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders.value))
    } catch (error) {
      console.error('保存挂单数据失败:', error)
    }
  }

  // 删除挂单
  const deletePendingOrder = (order) => {
    const orderIndex = pendingOrders.value.findIndex(item => item.id === order.id)
    if (orderIndex >= 0) {
      pendingOrders.value.splice(orderIndex, 1)
    }
    savePendingOrdersToStorage()
    ElMessage.success('挂单已删除')
  }

  // 添加交换订单的方法
  const swapPendingOrder = (order) => {
    // 创建一个新的挂单对象，包含当前购物车内容
    const newPendingOrder = {
      id: generateOrderId(),
      timestamp: new Date().getTime(),
      items: [...shopCartItems.value],
      totalAmount: totalAmount.value,
      customer: {
        name: '我是会员名', // 这里可以替换为实际的会员信息
        balance: 999,
        points: 999
      },
      paymentMethod: paymentMethods[activePaymentMethod.value].payType
    }

    // 从挂单列表中找到并替换选中的订单
    const orderIndex = pendingOrders.value.findIndex(item => item.id === order.id)
    if (orderIndex >= 0) {
      pendingOrders.value.splice(orderIndex, 1, newPendingOrder)
    }

    // 将选中的挂单内容加载到购物车
    shopCartItems.value = [...order.items]

    // 恢复支付方式
    const paymentMethodIndex = paymentMethods.findIndex(method => method.payType === order.paymentMethod)
    if (paymentMethodIndex >= 0) {
      activePaymentMethod.value = paymentMethodIndex
    }

    // 更新本地存储
    savePendingOrdersToStorage()
    
    // 关闭挂单列表弹窗
    pendingOrdersVisible.value = false
    
    ElMessage.success('挂单已替换')
  }

  
  // 更新 confirmPayment 方法来使用 createOfflineOrder API
  const confirmPayment = async () => {
    if (shopCartItems.value.length === 0) {
      ElMessage.warning('购物车为空，无法完成支付')
      return
    }
    let response = null;
    if ( !payOrderResponse.value?.result?.orderId) {
      response = await createOrder();
      payOrderResponse.value = response;
    }
    switch (paymentMethods[activePaymentMethod.value].payType) {
      case 'now_money':
        payOrder({orderId: payOrderResponse.value.result?.orderId,authCode:''})
        break
      case 'weixin_micropay':
        openPayScanDialog('weixin_micropay')
        break
      case 'ali_micropay':
        openPayScanDialog('ali_micropay')
        break
      case 'yue':
        payOrder({orderId:payOrderResponse.value.result?.orderId,authCode:''})
        break
      default:
        ElMessage.error('支付方式不支持')
        break
        
        
    }
  }

  const openPayScanDialog = (payType) => {
    scannerType.value = payType
    if (payType === 'weixin_micropay'){
      scannerVisible.value = true
    }else if(payType === 'ali_micropay'){
      scannerVisible.value = true
    }
  }

  const createOrder = async (paymentData?:any) => {
   
    try {
      // 准备订单参数
      const orderParams: OfflineOrderParams = {
        cartId: shopCartItems.value.map(item => item.id).join(','),
        shippingType: 3, // 默认为自提/堂食
        storeId: shopId, // 默认店铺ID，可以根据实际情况修改
        userId: currentCustomUser.value ? currentCustomUser.value.id : 0, // 如果有关联会员，设置会员ID
        payType: paymentMethods[activePaymentMethod.value].payType, // 根据选择的支付方式设置
        useIntegral: false, // 默认不使用积分
        remark: orderRemark.value,// 订单备注
        from: 'offline',
        paidAmount: paymentData?.paidAmount,
        changeAmount: paymentData?.changeAmount
      }
    
      if (manualDiscount.value?.type === 'discount') {
        orderParams.discount = manualDiscount.value.value*0.1
        // orderParams.manualPrice = 0;
      } else if (manualDiscount.value?.type === 'fixed') {
        orderParams.manualPrice = manualDiscount.value.value
        // orderParams.discount = 0;
      }
      // 调用创建线下订单API
      const response = await createOfflineOrder(orderParams)
      payOrderResponse.value = response
      if (response) {
        // ElMessage.success(`已使用${paymentMethods[activePaymentMethod.value].name}支付${totalAmount.value}元`)
        return response
        // 可以在这里添加订单成功后的其他逻辑，如打印小票等
      } else {
        ElMessage.error(response?.msg || '下单失败')
      }
    } catch (error) {
      console.error('下单失败:', error)
      ElMessage.error('下单失败，请重试')
    }
  }

  

  // 支付订单
  const payOrder = async ({orderId,authCode}) => {
    const payParams: OfflineOrderPayParams = {
      from: 'offline',
      payType: paymentMethods[activePaymentMethod.value].payType,
      orderId: orderId,
      helpPay: false,    
      authCode: authCode
    }
    const payResponse = await cashierPay(payParams)
    if (payResponse) {
      // 清空购物车
      
      showPaymentSuccessDialog()
      // 关闭扫码器
      scannerVisible.value = false
      scannerType.value = ''
    }else{
      ElMessage.error(payResponse?.msg || '支付失败')
      showPaymentFailedDialog()
    }
  }
  

  // 打开扫码器
  const openScanner = () => {
    // 检查浏览器是否支持摄像头API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      ElMessage.error('您的浏览器不支持摄像头访问，请使用最新版本的Chrome、Firefox或Safari浏览器')
      return
    }
    
    scannerVisible.value = true
    paymentFailedDialogVisible.value = false
  }

  // 重新支付
  const retryPayment = () => {
   switch(paymentMethods[activePaymentMethod.value].payType){
    case 'now_money':
      payOrder({orderId:payOrderResponse.value?.result?.orderId,authCode:''})
      break
    case 'weixin_micropay':
      openPayScanDialog('weixin_micropay')
      break
    case 'ali_micropay':
      openPayScanDialog('ali_micropay')
      break
    case 'yue':
      payOrder({orderId:payOrderResponse.value?.result?.orderId,authCode:''})
      break
    default:
      ElMessage.error('支付方式不支持')
      break
   }
  }

  const closeScanner = () => {
    scannerVisible.value = false
    scannerType.value = ''
  }

  // 处理扫码成功
  const handleScanSuccess =async (result) => {
    if (scannerType.value === 'weixin_micropay'){
      payOrder({orderId:payOrderResponse.value?.result?.orderId,authCode:result})
    }else if(scannerType.value === 'ali_micropay'){
      payOrder({orderId:payOrderResponse.value?.result?.orderId,authCode:result})
    } else if (scannerType.value === 'user'){
      // 这里可以根据扫码结果进行不同的处理
      try {
        // 尝试解析为JSON
        const data = JSON.parse(result)
        const user = await getUser(data.userId)
        selectUser(user)
      
      } catch (error) {
        // 如果不是JSON格式，可能是普通URL或文本
        if (result.startsWith('http')) {
          // 如果是URL
          ElMessage.info(`扫描到URL: ${result}`)

          // 尝试从URL中提取商品ID
          const urlParams = new URL(result).searchParams
          const productId = urlParams.get('id') || urlParams.get('productId')

          if (productId) {
            fetchProductById(productId)
          }
        } else if (/^\d+$/.test(result)) {
          // 如果是纯数字，可能是商品ID或条形码
          ElMessage.info(`扫描到编码: ${result}`)
          searchByCode(result)
        } else {
          // 其他文本内容
          ElMessage.info(`扫描到文本: ${result}`)
          // 尝试作为关键词搜索
          searchKeyword.value = result
          handleSearch(result)
        }
      }
    }
    
  }

  // 根据商品ID查询商品
  const fetchProductById = async (productId) => {
    try {
      const params: any = {
        pageNo: 1,
        pageSize: 10,
        isShow: 1,
        stock: 1,
        id: productId
      }
      
      const response = await getStoreProductPage(params)
      
      if (response && response.data) {
        // 由于返回格式变化，需要遍历所有分类查找商品
        let foundProduct = null
        
        for (const categoryProducts of Object.values(response.data)) {
          if (Array.isArray(categoryProducts)) {
            foundProduct = categoryProducts.find(product => product.id === Number(productId))
            if (foundProduct) break
          }
        }
        
        if (foundProduct) {
          // 找到商品，打开规格选择弹窗
          openProductSpecDialog(foundProduct)
        } else {
          ElMessage.warning('未找到对应商品')
        }
      } else {
        ElMessage.warning('未找到对应商品')
      }
    } catch (error) {
      console.error('查询商品失败:', error)
      ElMessage.error('查询商品失败')
    }
  }

  // 根据编码查询商品
  const searchByCode = async (code) => {
    try {
      const params: any = {
        pageNo: 1,
        pageSize: 10,
        isShow: 1,
        stock: 1,
        code: code
      }
      
      const response = await getStoreProductPage(params)
      
      if (response && response.data) {
        // 由于返回格式变化，需要遍历所有分类查找商品
        let foundProduct = null
        
        for (const categoryProducts of Object.values(response.data)) {
          if (Array.isArray(categoryProducts)) {
            foundProduct = categoryProducts.find(product => 
              product.keyword === code || product.storeName.includes(code)
            )
            if (foundProduct) break
          }
        }
        
        if (foundProduct) {
          // 找到商品，打开规格选择弹窗
          openProductSpecDialog(foundProduct)
        } else {
          ElMessage.warning('未找到对应商品')
        }
      } else {
        ElMessage.warning('未找到对应商品')
      }
    } catch (error) {
      console.error('查询商品失败:', error)
      ElMessage.error('查询商品失败')
    }
  }


  // 初始化
  onMounted(() => {
    // 加载挂单数据
    loadPendingOrdersFromStorage()
    fetchProductTabList()
    // 加载购物车数据
    fetchCartList()
    fetchCartCount()
  })

  // Watch for changes in shopCartItems to update cart count
  watch(shopCartItems, () => {
    cartCount.value = shopCartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  }, { deep: true })

  // 打开会员选择对话框
  const openUserSelectDialog = () => {
    userSelectDialogVisible.value = true
  }

  // 打开会员选择对话框
  const openUserScanDialog = (type) => {
    scannerType.value = type
    scannerVisible.value = true
  }

  // 关闭会员选择对话框
  const closeUserSelectDialog = () => {
    userSelectDialogVisible.value = false
  }

  // 选择会员
  const selectUser = (user) => {
    currentCustomUser.value = user
    ElMessage.success(`已关联会员: ${user.nickname}`)
    payOrderResponse.value = null
    manualDiscount.value = null
    selectedCoupon.value = null
    discountAmount.value = 0
    activePaymentMethod.value = 0
    fetchCartList()
  }

  // 解除会员关联
  const clearUserAssociation = () => {
    currentCustomUser.value = null
  }

  // 优惠券相关方法
  const openCouponDialog = () => {
    couponDialogVisible.value = true
  }

  const closeCouponDialog = () => {
    couponDialogVisible.value = false
  }

  const applyDiscount = (discountInfo) => {
    if (discountInfo.type === 'discount') {
      // 折扣优惠
      const discountValue = discountInfo.value
      if (discountValue > 0 && discountValue <= 10) {
        // 计算折扣金额 (如9折 = 原价 * 0.1)
        const discount = totalAmount.value * (10 - discountValue) / 10
        discountAmount.value = parseFloat(discount.toFixed(2))
        console.log('discountAmount.value===',discountAmount)
        selectedCoupon.value = null
        manualDiscount.value = {
          type: 'discount',
          value: discountValue,
          remark: discountInfo.remark || ''
        }
        ElMessage.success(`已应用${discountValue}折优惠`)
      }
    } else if (discountInfo.type === 'fixed') {
      // 立减优惠
      const amount = discountInfo.value
      if (amount > 0) {
        discountAmount.value = Math.min(amount, totalAmount.value)
        selectedCoupon.value = null
        manualDiscount.value = {
          type: 'fixed',
          value: amount,
          remark: discountInfo.remark || ''
        }
        ElMessage.success(`已应用${discountAmount.value}元立减优惠`)
      }
    }
    couponDialogVisible.value = false
  }

  const applyCoupon = (coupon) => {
    selectedCoupon.value = coupon
    manualDiscount.value = null
    
    if (coupon.type === 1) { // 满减券
      if (totalAmount.value >= coupon.minOrderAmount) {
        discountAmount.value = coupon.value
        ElMessage.success(`已应用优惠券: ${coupon.name}`)
      } else {
        ElMessage.warning(`订单金额不满足优惠券使用条件`)
        discountAmount.value = 0
      }
    } else if (coupon.type === 2) { // 折扣券
      if (totalAmount.value >= coupon.minOrderAmount) {
        // 计算折扣金额
        const discount = totalAmount.value * (10 - coupon.value) / 10
        discountAmount.value = parseFloat(discount.toFixed(2))
        ElMessage.success(`已应用优惠券: ${coupon.name}`)
      } else {
        ElMessage.warning(`订单金额不满足优惠券使用条件`)
        discountAmount.value = 0
      }
    }
    couponDialogVisible.value = false
  }

  // 显示现金结算弹框
  const showCashPayment = () => {
    cashPaymentVisible.value = true
  }

  // 显示现金结算弹框
  const showPaymentSuccessDialog = () => {
    paymentSuccessDialogVisible.value = true
  }

  // 显示现金结算弹框
  const showPaymentFailedDialog = () => {
    paymentFailedDialogVisible.value = true
    scannerType.value = paymentMethods[activePaymentMethod.value].payType
  }
  const closePaymentSuccessDialog = () => {
    paymentSuccessDialogVisible.value = false
    
  }
  const closePaymentFailedDialog = () => {
    paymentFailedDialogVisible.value = false
    scannerType.value = ''
  }

  const clearCart = () => {
    shopCartItems.value = []
    currentCustomUser.value = null
    manualDiscount.value = null
    selectedCoupon.value = null
    discountAmount.value = 0
    payOrderResponse.value = null
  }

  // 关闭现金结算弹框
  const closeCashPayment = () => {
    cashPaymentVisible.value = false
  }

  // 打印收据
  const handlePrintReceipt = async () => {
    if(!payOrderResponse.value?.result?.orderId){
      ElMessage.error('没有订单数据')
      return
    }
    const response = await printReceipt(payOrderResponse.value?.result?.orderId)
    if (response) {
      ElMessage.success('打印小票成功')
    } else {
      ElMessage.error(response?.msg || '打印小票失败')
    }
  }


  // 处理现金支付
  const handleCashPayment = async (paymentData) => {
    if(payOrderResponse.value?.result?.orderId){
      await payAction(payOrderResponse.value)
      return;
    }
    try {
      // 创建订单
      const orderResult = await createOrder(paymentData)
      if (!orderResult || !orderResult.result.orderId) {
        ElMessage.error('创建订单失败')
        return
      }
    
      await payAction(orderResult)
      
    } catch (error) {
      console.error('现金支付处理失败:', error)
      ElMessage.error('现金支付处理失败')
    }
  }

  const payAction = async (orderResult) => {
    const payParams: OfflineOrderPayParams = {
      orderId: orderResult.result.orderId,
      from: 'offline',
      payType: paymentMethods[activePaymentMethod.value].payType,
      helpPay: false,
      authCode: ''
    }

    // 调用现金支付接口
    const payResult = await cashierPay(payParams)
    if (payResult) {
      // 清空购物车
      shopCartItems.value = []
      // 清空订单备注
      orderRemark.value = ''
      // 重置折扣
      discountAmount.value = 0

      showPaymentSuccessDialog()
      // 清除会员关联
      clearUserAssociation()
      // 重新获取购物车数据
      fetchCartList()
      fetchCartCount()
    } else {
      ElMessage.error('支付失败')
      showPaymentFailedDialog()
    }
  }


  return {
    // 状态
    searchKeyword,
    activeTabIndex,
    activeCategoryIndex,
    productTabs,
    categories,
    products,
    shopCartItems,
    activePaymentMethod,
    discountAmount,
    pendingOrders,
    pendingOrdersVisible,
    specDialogVisible,
    selectedProduct,
    paymentMethods:paymentMethods,
    nickName,
    scannerVisible,
    cartLoading,
    
    orderRemark,
    
    // 计算属性
    totalAmount,
    totalOrderAmount,
    
    // 会员相关
    userSelectDialogVisible,
    currentCustomUser,
    openUserSelectDialog,
    closeUserSelectDialog,
    selectUser,
    clearUserAssociation,
    
    // 方法
    switchTab,
    switchCategory,
    handleSearch,
    handleClear,
    openProductSpecDialog,
    closeProductSpecDialog,
    handleAddToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    selectPaymentMethod,
    showPendingOrders,
    closePendingOrdersDialog,
    saveAsPendingOrder,
    loadPendingOrder,
    swapPendingOrder,
    confirmPayment,
    updateCartItemSku,
    openScanner,
    closeScanner,
    openUserScanDialog,
    handleScanSuccess,
    deletePendingOrder,
    retryPayment,
    // 优惠券相关
    couponDialogVisible,
    paymentSuccessDialogVisible,
    paymentFailedDialogVisible,
    selectedCoupon,
    manualDiscount,
    payOrderResponse,
    openCouponDialog,
    closeCouponDialog,
    showPaymentSuccessDialog,
    showPaymentFailedDialog,
    closePaymentSuccessDialog,
    closePaymentFailedDialog,
    applyDiscount,
    handlePrintReceipt,
    applyCoupon,
    // 现金支付相关
    cashPaymentVisible,
    showCashPayment,
    closeCashPayment,
    handleCashPayment,
    clearCart
  }
} 