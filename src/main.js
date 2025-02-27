// import App from './App.vue'
import dragable from './directive/dragable'
import resize from './directive/resize'
import { createApp,defineAsyncComponent } from 'vue'
const App = defineAsyncComponent(()=>import('./App.vue'))
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import piniaReset from './tools/piniaReset'
import "~/styles/index.scss";
import '~/composables';//初始化主题，默认自动主题
import 'uno.css'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(piniaReset)
const app = createApp(App)
app.use(pinia)
app.directive('dragable',dragable)
app.directive('resize',resize)
app.mount('#app')
export {dragable,resize,pinia}