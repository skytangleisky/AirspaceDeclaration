import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import piniaReset from './tools/piniaReset'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(piniaReset)