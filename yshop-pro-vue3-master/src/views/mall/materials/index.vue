<template>
  <MaterialsMain ref="materialsMainRef" :pageSize="18"/>
</template>

<script setup>
import MaterialsMain from '@/components/Materials/src/MaterialsMain.vue'
import {ref, onMounted, nextTick} from "vue";
const materialsMainRef = ref()
onMounted(()=>{
  nextTick(()=>{
    materialsMainRef.value.getMaterialgroupPage()
  })
})
</script>

<style scoped>

</style>
