// import rgyxWorkPoint from "./rgyx-work-point.vue"; // 引入封装好的组件
// const rgyxWorkPoint = defineAsyncComponent(()=>import("../App.vue"))
import dragable from '../directive/dragable'
import resize from '../directive/resize'
// import rgyxWorkPoint from "../App.vue";
import { defineAsyncComponent } from "vue";
const RgyxWorkPoint = defineAsyncComponent(()=>import("../App.vue"))
const SmokeStove = defineAsyncComponent(()=>import("~/myComponents/smokeStove/smokeStove.vue"))
// const rgyxWorkPoint = defineAsyncComponent(()=>import("./rgyx-work-point.vue"))
// import {resize,dragable,pinia} from "../main.js";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
import "~/styles/index.scss";
import '~/composables';//初始化主题，默认自动主题
import 'uno.css'
import "~/styles/element/index.scss"
import 'mapbox-gl/dist/mapbox-gl.css';
// const coms = [rgyxWorkPoint]; // 将来如果有其它组件,都可以写到这个数组里
// export default {
//   install(Vue) {
//     coms.forEach((com) => {
//       Vue.component(com.name, com);
//     });
//   },
//   rgyxWorkPoint,
//   ...coms, // 展开数组应该也是可以的
// };
export {
  resize,
  dragable,
  RgyxWorkPoint,
  SmokeStove
}
// const myPlugin = {
//     install(app) {
//         app.component('RgyxWorkPoint', RgyxWorkPoint)
//     }
// }
// export default myPlugin
