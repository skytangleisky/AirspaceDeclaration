// import rgyxWorkPoint from "./rgyx-work-point.vue"; // 引入封装好的组
import dragable from '../directive/dragable'
import resize from '../directive/resize'
// import rgyxWorkPoint from "../App.vue";
import 'virtual:svg-icons-register'
import SvgIcon from "./myComponents/SvgIcon.vue";
import RgyxWorkPoint from "../App.vue"
import SmokeStove from "~/myComponents/smokeStove/smokeStove.vue"
import {useSettingStore} from "~/stores/setting";
// import {resize,dragable,pinia} from "../main.js";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
import "~/style.css"
import "~/styles/index.scss"
import '~/composables'//初始化主题，默认自动主题
import 'uno.css'
import "~/styles/element/index.scss"
import 'mapbox-gl/dist/mapbox-gl.css'
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
  SmokeStove,
  SvgIcon,
  useSettingStore,
}
// const myPlugin = {
//     install(app) {
//         app.component('RgyxWorkPoint', RgyxWorkPoint)
//     }
// }
// export default myPlugin
