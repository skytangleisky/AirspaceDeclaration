// import rgyxWorkPoint from "./rgyx-work-point.vue"; // 引入封装好的组件
// const rgyxWorkPoint = defineAsyncComponent(()=>import('../App.vue'))
import rgyxWorkPoint from "../App.vue";
import dragable from '../directive/dragable'
import resize from '../directive/resize'
// const rgyxWorkPoint = defineAsyncComponent(()=>import('./rgyx-work-point.vue'))
// import {resize,dragable,pinia} from "../main.js";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
import { createPinia } from "pinia"
const pinia = createPinia()
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import piniaReset from '../tools/piniaReset'
pinia.use(piniaPluginPersistedstate)
pinia.use(piniaReset)
import 'uno.css'
const coms = [rgyxWorkPoint]; // 将来如果有其它组件,都可以写到这个数组里
export default {
  install(Vue) {
    coms.forEach((com) => {
      Vue.component(com.name, com);
    });
  },
  rgyxWorkPoint, // 可以追加多个组件
  pinia,
  resize,
  dragable,
  ...coms, // 展开数组应该也是可以的
};

// const myPlugin = {
//     install(app) {
//         app.component('RgyxWorkPoint', RgyxWorkPoint)
//     }
// }
// export default myPlugin
