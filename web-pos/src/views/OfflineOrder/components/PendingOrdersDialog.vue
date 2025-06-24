<template>
    <el-dialog
v-model="dialogVisible" show-close="false" width="400px" 
        custom-class="pending-orders-dialog">
        <!-- Tab navigation -->
        <div class="tabs-container">
            <div
v-for="(tab, index) in pendingOrders" :key="index"
                :class="['tab-item', { active: activeTabIndex === index }]" @click="activeTabIndex = index">
                {{ tab.customerUser.nickname }}
            </div>
        </div>

        <div v-if="filteredOrderProducts.length === 0" class="empty-state">
            <el-empty description="暂无挂单信息" />
        </div>

        <div v-else class="pending-orders-list">
            <div class="product-section">
                <div v-for="(item, itemIndex) in filteredOrderProducts" :key="itemIndex" class="order-product">
                    <div class="product-image-container">
                        <img :src="item.image || defaultProductImage" class="product-image" alt="商品图片" />
                    </div>
                    <div class="product-info">
                        <div class="product-name">{{ item.name }}</div>
                        <div class="product-specs">{{ item.specs || getSpecsString(item) }}</div>
                        <div class="product-price">¥{{ item.price }}</div>
                    </div>
                    <div class="product-quantity">x{{ item.quantity }}</div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex order-summary flex-col items-center justify-between">

                <div class="flex flex-row w-full items-center justify-between">
                    <div class="flex flex-1 flex-col items-start justify-end">
                        <div class="text-sm font-bold">支付结算</div>
                        <div class="summary-text">共计 {{ getTotalItems() }}件商品</div>
                    </div>
                    <div class="flex flex-1 flex-col items-end justify-end">
                        <div class="text-sm font-bold">应付金额 </div>
                        <div class="total-amount">¥{{ getOrderTotal() }}</div>
                    </div>

                </div>
                <!-- Action buttons -->
                <div class="order-actions w-full flex mt-4 flex-row items-center justify-between">
                    <el-button  size="medium" @click.stop="deleteOrder" class="delete-btn w-50">删除该挂单</el-button>
                    <el-button size="medium" type="primary" @click.stop="loadOrder" class="use-btn w-50">使用该挂单</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    pendingOrders: {
        type: Array,
        default: () => []
    },
    currentCart: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close','delete-pending-order', 'load-order', 'swap-order', 'delete-order'])

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => {
        if (!val) {
            emit('close')
        }
    }
})

// 添加选中订单ID状态
const selectedOrderId = ref(null)

// 默认产品图片
const defaultProductImage = 'https://files.minio.fonva.cn/yshop/78fae50582d9d8d7d37166b2075314921ccadf50fd496ed3d011b0f709349fe6.png'



// 当前活动标签页
const activeTabIndex = ref(0)

// 根据当前选中的标签获取对应的订单
const filteredOrderProducts = computed(() => {
    const tabOrder = props.pendingOrders[activeTabIndex.value]
    // 这里假设pendingOrders中每个订单的tabIndex属性表示它属于哪个标签页
    // 如果没有tabIndex属性，我们可以按照某种规则(如奇偶数索引)来分配
    return tabOrder?.items||[]
})

// 获取订单总商品数量
const getTotalItems = () => {
    const tabOrder =  props.pendingOrders[activeTabIndex.value]
    if (!tabOrder?.items || !Array.isArray(tabOrder?.items)) return 0;
    return tabOrder?.items.reduce((total, item) => total + (item.quantity || 0), 0);
}

// 获取订单总金额
const getOrderTotal = () => {
    const tabOrder = props.pendingOrders[activeTabIndex.value]

    if (!tabOrder?.items || !Array.isArray(tabOrder?.items)) {
        return tabOrder?.totalAmount || 0;
    }
    
    // 如果订单有totalAmount属性，直接返回
    if (tabOrder?.totalAmount !== undefined) {
        return Number(tabOrder?.totalAmount).toFixed(2);
    }
    
    // 否则根据商品计算总价
    const total = tabOrder?.items.reduce((sum, item) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        return sum + (price * quantity);
    }, 0);
    
    return total.toFixed(2);
}

// 获取商品规格字符串
const getSpecsString = (item) => {
    if (item.specs) return item.specs;
    if (item.spec) return item.spec;
    
    const specsArray = [];
    if (item.size) specsArray.push(item.size);
    if (item.ice) specsArray.push(item.ice);
    if (item.sugar) specsArray.push(item.sugar);
    
    return specsArray.length > 0 ? specsArray.join('/') : '标准规格';
}

// 加载订单（取单）- 从挂单列表中移除并加载到购物车
const loadOrder = () => {
    const tabOrder =  props.pendingOrders[activeTabIndex.value]
    // 检查当前购物车是否为空
    if (props.currentCart.length > 0) {
        ElMessageBox.confirm(
            '当前购物车不为空，取单将清空当前购物车内容。是否继续？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                // 用户确认，执行取单操作
                emit('load-order', tabOrder)
                dialogVisible.value = false
                selectedOrderId.value = null
                ElMessage.success('取单成功')
            })
            .catch(() => {
                // 用户取消，不执行操作
            })
    } else {
        // 购物车为空，直接取单
        emit('load-order', tabOrder)
        dialogVisible.value = false
        selectedOrderId.value = null
        ElMessage.success('取单成功')
    }
}

// 删除订单
const deleteOrder = () => {
    const tabOrder = props.pendingOrders[activeTabIndex.value]

    ElMessageBox.confirm(
        '确定要删除这个挂单吗？',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            emit('delete-pending-order', tabOrder)
        })
        .catch(() => {
            // 用户取消，不执行操作
        })
}

</script>

<style lang="scss" scoped>
.pending-orders-dialog {
  
}
.el-dialog{
    .el-dialog__header{
        display: none !important;
    }
    .el-dialog__body {
        padding: 0 10px 10px 10px !important;
        margin: 0;
    }
}



.tabs-container {
    display: flex;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 16px;
}

.tab-item {
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    transition: all 0.3s;
}

.tab-item.active {
    color: var(--el-color-primary);
    font-weight: 600;
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--el-color-primary);
}

.empty-state {
    padding: 40px 0;
    text-align: center;
}

.pending-orders-list {
    max-height: 300px;
    overflow-y: auto;
}

.pending-order-item {
    padding: 16px;
    border-radius: 8px;
    background-color: #ffffff;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #ebeef5;
    
}

.product-section {
    margin-bottom: 12px;
}

.order-product {
    display: flex;
    align-items: center;
    padding: 8px 8px;
    background: #F1F3F6;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 12px;
}

.product-image-container {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    overflow: hidden;
    border-radius: 4px;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 14px;
    margin-bottom: 4px;
}

.product-specs {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
}
.product-price {
    font-size: 14px;
    color: #606266;
}

.product-quantity {
    font-size: 14px;
    margin-left: 16px;
    color: #303133;
}

.order-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 12px;
}

.summary-text {
    font-size: 12px;
    color: #4D5567;
}

.total-amount {
    font-size: 14px;
    color: var(--el-color-primary);
    font-weight: bold;
}

.total-amount .amount {
    font-size: 16px;
    font-weight: bold;
    color: #f56c6c;
}

.order-actions {
    display: flex;
    justify-content: space-between;
}

.delete-btn {
    color: #f56c6c;
    border-color: #f56c6c;
}

.use-btn {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
}
</style>