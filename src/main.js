import App from "./App.vue"
import dragable from './directive/dragable'
import resize from './directive/resize'
import { createApp } from 'vue'
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import piniaReset from './tools/piniaReset'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import "~/styles/index.scss";
import '~/composables';//初始化主题，默认自动主题
import 'uno.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import "~/styles/element/index.scss";
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(piniaReset)
const app = createApp(App)
app.use(pinia)
app.use(VueDOMPurifyHTML)
app.directive('dragable',dragable)
app.directive('resize',resize)
app.mount('#app')