import { defineAsyncComponent } from "vue";
import dragable from './directive/dragable'
import resize from './directive/resize'
import { createApp } from 'vue'
const App = defineAsyncComponent(()=>import("./App.vue"))
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import piniaReset from './tools/piniaReset'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "~/styles/index.scss";

import '~/composables';//初始化主题，默认自动主题
import 'uno.css'
// import "~/styles/element/index.scss"
import 'mapbox-gl/dist/mapbox-gl.css';
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(piniaReset)
const app = createApp(App)
app.use(pinia)
app.use(VueDOMPurifyHTML)
app.directive('dragable',dragable)
app.directive('resize',resize)
app.mount('#app')