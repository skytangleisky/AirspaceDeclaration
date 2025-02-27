// import rgyxWorkPoint from "./rgyx-work-point.vue"; // 引入封装好的组件
const rgyxWorkPoint = defineAsyncComponent(()=>import('../App.vue'))
// const rgyxWorkPoint = defineAsyncComponent(()=>import('./rgyx-work-point.vue'))
import {resize,dragable,pinia} from "../main.js";
// import {resize,dragable,pinia} from "../main.js";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
import 'uno.css'
import { defineAsyncComponent } from 'vue';
const coms = [rgyxWorkPoint]; // 将来如果有其它组件,都可以写到这个数组里
export default {
  install(Vue) {
    coms.forEach((com) => {
      Vue.component(com.name, com);
    });
  },
  rgyxWorkPoint, // 可以追加多个组件
  // App,
  resize,dragable,pinia,
  ...coms, // 展开数组应该也是可以的
};

// const myPlugin = {
//     install(app) {
//         app.component('RgyxWorkPoint', RgyxWorkPoint)
//     }
// }
// export default myPlugin
