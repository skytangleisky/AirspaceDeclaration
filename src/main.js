import App from "./App.vue"
import 'virtual:svg-icons-register'
import SvgIcon from "~/myComponents/SvgIcon.vue"
import dragable from '~/directive/dragable'
import resize from '~/directive/resize'
import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "~/styles/index.scss"
import 'uno.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import "~/styles/element/index.scss";
import '~/theme'
import { pinia } from './pinia.js'
const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(VueDOMPurifyHTML)
app.directive('dragable',dragable)
app.directive('resize',resize)
app.component("svg-icon", SvgIcon);
app.mount('#app')
