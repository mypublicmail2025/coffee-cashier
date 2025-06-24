<template>
  <div class="layout hom-layout">
    <div
      v-for="(item, index) in componentsData"
      :key="index"
      class="list-group-item"
    >
      <component
        :is="defineAsyncComponent(componentMap[terminal - 1].get(item.type))"
        :component-content="item.componentContent"
        :terminal="terminal"
        :type-id="typeId"
        :shop-id="shopId"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, toRefs, defineAsyncComponent } from 'vue';
import componentMap from './componentMap'
import api from './config/api'
import { sendReqMixin } from './config/mixin'
const { sendReq } = sendReqMixin()
const componentsData = ref([])
const props = defineProps({
  terminal: {
    type: Number,
    default: 4,
  },
  typeId: {
    type: Number,
    default: 1,
  },
  shopId: {
    type: Number,
    default: 0,
  },
})
const { terminal, typeId, shopId } = toRefs(props)
onMounted(() => {
  canvasGet()
})

// 读取画布
function canvasGet () {
  var apiUrl =
      api.getCanvas + '?terminal=' + terminal.value + '&type=' + typeId.value
  if (shopId.value) {
    apiUrl += '&shopId=' + shopId.value
  }
  const params = {
    url: apiUrl,
    method: 'GET',
  }
  sendReq(params, (res) => {
    if (JSON.stringify(res.data) !== '{}') {
      componentsData.value = JSON.parse(res.data.json)
    }
    // console.log(JSON.parse(res.data.json))
  })
}
</script>

<style lang="scss" scoped>
.hom-layout {
  background-color: #f5f5f5;
}
</style>

<style lang="scss">
.warp {
  width: 690px;
  margin: 0 auto;
  max-width: 100%;
  &.terminal4 {
    width: 1200px;
    max-width: 100%;
  }
}
.flex-box {
  display: flex;
}
</style>
