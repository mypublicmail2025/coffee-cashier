<template>
  <shopCanvas ref="shopCanvasRef" />
</template>

<script setup lang="ts">
import shopCanvas from '@/components/canvas/views/index.vue'
// const route = useRoute()
const route = useRoute();

const shopCanvasRef = ref()
onMounted(()=>{
  const id = toRaw(route).query.id
  shopCanvasRef.value.canvasGet(id)
})
</script>

<style scoped>

</style>
