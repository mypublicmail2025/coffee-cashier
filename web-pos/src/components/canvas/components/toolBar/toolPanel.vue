<template>
  <div class="toolWarp">
    <div class="toolPanel">
      <component :is="defineAsyncComponent(componentMap.get(activeComponent.type))" />
    </div>
  </div>
</template>

<script setup>
import componentMap from './componentMap'
import { defineAsyncComponent } from 'vue';
import { canvasStore } from '@/components/canvas/store/canvas'
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();
const { activeComponent } = storeToRefs(canvasStoreObj);
</script>

<style lang="scss" scoped>
.toolWarp {
  width: 100%;
}
.toolPanel {
  width: 100%;
  padding-bottom: 20px;
}
.toolPanel::-webkit-scrollbar {
  width: 4px;
  height: 1px;
}

.toolPanel::-webkit-scrollbar-thumb {
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 5px rgba(156, 148, 148, 0.2);
  background: #cdcdcd;
}
.toolPanel::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(158, 150, 150, 0.2);
  border-radius: 4px;
  background: #ededed;
}
</style>
