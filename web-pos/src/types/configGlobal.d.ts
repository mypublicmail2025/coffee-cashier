import { ElementPlusSize } from './elementPlus'
export interface ConfigGlobalTypes {
  size?: ElementPlusSize
}
declare global {
  interface Window {
    UE: any;
  }
}
