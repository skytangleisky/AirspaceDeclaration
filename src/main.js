import App from "./App.vue"
import 'virtual:svg-icons-register'
import SvgIcon from "~/myComponents/SvgIcon.vue"
import dragable from '~/directive/dragable'
import resize from '~/directive/resize'
import { createApp } from 'vue'
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import piniaReset from './tools/piniaReset'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "~/styles/index.scss"
import 'mapbox-gl_wstd/dist/mapbox-gl.css';
import "~/styles/element/index.scss";
import '~/theme'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(piniaReset)
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