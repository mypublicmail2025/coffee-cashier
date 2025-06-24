<script setup lang="ts">
import * as ShopApi from '@/api/mall/shop/shop'
import {useUserStore} from '@/store/modules/user'

const userStore = useUserStore()
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formEdit = ref(false) // 表单的编辑状态
const formData = ref({
    id: undefined,
    receiptSn: undefined,
    receiptKey: undefined,
    labelSn: undefined,
    labelKey: undefined,
})
const formRules = reactive({
    receiptSn: [{required: true, message: '小票机Sn不能为空', trigger: 'blur'}],
    receiptKey: [{required: true, message: '小票机Key不能为空', trigger: 'blur'}],
    labelSn: [{required: true, message: '标签机Sn不能为空', trigger: 'blur'}],
    labelKey: [{required: true, message: '标签机Key不能为空', trigger: 'blur'}],
    
})
const formRef = ref() // 表单 Ref


/** 表单提交 */
const submitForm = async () => {
    // 表单校验
    const valid = await formRef.value.validate()
    if (!valid) return
    // 提交请求
    formLoading.value = true
    try {
       const res = await ShopApi.updateShop(formData.value)
       if(res){
        ElMessage.success('操作成功')
       }else{
        ElMessage.error(res.message||'操作失败')
       }
    } finally {
        formLoading.value = false
    }
}

onMounted(() => {
    ShopApi.getShop(userStore.shopId).then(res => {
        formData.value = {
            id: res.id,
            receiptSn: res.receiptSn,
            receiptKey: res.receiptKey,
            labelSn: res.labelSn,
            labelKey: res.labelKey,
        }
    })
    
})


</script>

<template>
    <div class="shop-device-container flex flex-col">
        <div class="shop-form-container">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="小票机Sn" prop="lat">
                            <el-input :disabled="!formEdit" v-model="formData.receiptSn" placeholder="请输入小票打印机Sn" />
                        </el-form-item>
                        <el-form-item label="小票机Key" prop="lat">
                            <el-input :disabled="!formEdit" v-model="formData.receiptKey" placeholder="请输入小票打印机Key" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="标签机Sn" prop="lat">
                            <el-input :disabled="!formEdit" v-model="formData.labelSn" placeholder="请输入标签打印机Sn" />
                        </el-form-item>
                        <el-form-item label="标签机Key" prop="lat">
                            <el-input :disabled="!formEdit" v-model="formData.labelKey" placeholder="请输入标签打印机Key" />
                        </el-form-item>
                    </el-col>

                </el-row>

            </el-form>
            <div class="shop-device-footer">
                <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
                <el-button v-if="formEdit" @click="formEdit = false" >取 消</el-button>
                <el-button v-if="!formEdit" @click="formEdit = true" >编 辑</el-button>
            </div>
        </div>


    </div>

</template>

<style scoped>
.shop-device-container {
    display: flex;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    background-color: white;
}
.shop-device-footer{
    margin-bottom: 20px;
    margin-left: 20px;

}

.shop-form-container {
    display: flex;
    padding: 20px;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
}

.el-divider {
    margin: 24px 0;
}
</style>
