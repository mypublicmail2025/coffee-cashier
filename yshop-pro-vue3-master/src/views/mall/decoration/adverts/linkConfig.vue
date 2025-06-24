<template>
  <div class="link-config">
    <div v-if="props.linkType === 1">
      <span class="name">{{ formData.name }}</span>
      <el-button
        v-if="formData.name"
        type="primary"
        link
        @click="openProduct"
      >修改
      </el-button>
      <el-button
        v-else
        size="small"
        type="primary"
        @click="openProduct"
      >
        添加商品
      </el-button>
      <ProductSelect
        ref="productTable"
        :selectedId="formData.id"
        @success="proSubmit"
      />
    </div>
    <div v-if="props.linkType === 2">
      <el-cascader
        ref="cascader"
        v-model="formData.id"
        :options="categoryList"
        :props="{
          checkStrictly: true,
          label: 'name',
          value: 'id',
          children: 'children',
        }"
        clearable
        @change="categoryChange"
      />
    </div>
    <div v-if="props.linkType === 3">
      <ul
        v-if="formData && formData.items && formData.items.length > 0"
        class="coupon-list"
      >
        <li
          v-for="(item, index) in formData.items"
          :key="index"
        >
          <span class="name">{{ item.couponName }}</span>
          <el-button
            v-if="item.id"
            type="primary"
            link
            @click="openCoupon"
          >修改
          </el-button>
        </li>
      </ul>
      <el-button
        v-else
        size="small"
        type="primary"
        @click="openCoupon"
      >
        添加优惠券
      </el-button>
      <CouponSelect
        ref="couponTable"
        :selectedItems="formData.items"
        @success="couponSubmit"
      />
    </div>
    <div v-if="props.linkType === 4">
      <el-form
        class="link-form"
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="小程序app id">
          <el-input
            v-model="formData.appId"
            maxlength="20"
            class="input-sub"
          />
        </el-form-item>
        <el-form-item label="页面路径">
          <el-input
            v-model="formData.link"
            maxlength="40"
            class="input-sub"
          />
        </el-form-item>
      </el-form>
    </div>
    <div v-if="props.linkType === 5">
      <el-form
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="">
          <el-input
            v-model="formData.link"
            maxlength="40"
            class="input-sub"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductSelect from '@/components/Basics/productSelect.vue'
import CouponSelect from '@/components/Basics/couponSelect.vue'
import * as CategoryApi from '@/api/mall/product/category'
const props = defineProps({
  data: {
    type: Object,
    default: () => {
    },
  },
  linkType: {
    type: Number,
    default: 0,
  }
})
const formData = ref({})
const cascader = ref(null)
const productTable = ref(null)
const couponTable = ref(null)
const categoryList = ref([])
const emits = defineEmits(['update:data'])

watchEffect(() => {
  formData.value = props.data
  emits('update:data', formData.value)
})

onBeforeMount(() => {
  getCategoryList()
})

const openProduct = () => {
  productTable.value.open()
}
const proSubmit = (val) => {
  formData.value.id = val.id
  formData.value.name = val.storeName
}
const openCoupon = () => {
  couponTable.value.open()
}
const couponSubmit = (items) => {
  formData.value.items = items
}
// 获取类别
const getCategoryList = async () => {
  categoryList.value = await CategoryApi.getCategoryTree()
}
// 类别改变
const categoryChange = () => {
  const nodesObj = cascader.value.getCheckedNodes()
  const pathLabels = nodesObj[0].pathLabels.join('/')
  formData.value.name = pathLabels
}
</script>

<style lang="scss" scoped>
.link-config {
  .radio {
    padding: 5px 0;
  }

  .coupon-list {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
    }

    .el-button {
      margin-left: 10px;
      font-size: 14px;
    }
  }

  .input-sub {
    width: 300px;

    :deep(.el-input__inner) {
      height: 32px;
      line-height: 32px;
    }
  }

  .link-form {
    .el-form-item {
      margin-top: 10px;

      &:first-child {
        margin-top: 0px;
      }
    }
  }

  .el-button--text {
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>
