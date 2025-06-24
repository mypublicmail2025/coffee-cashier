import { canvasStore } from '@/components/canvas/store/canvas'
import { storeToRefs } from 'pinia';
const canvasStoreObj = canvasStore();

export default function () {
  const { activeComponent, componentsData } = storeToRefs(canvasStoreObj);
  const { setComponentsData } = canvasStoreObj;
  return {
    activeComponent,
    componentsData,
    setComponentsData
  }
}
