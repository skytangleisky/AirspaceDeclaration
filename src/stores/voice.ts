// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
export const useVoiceStore = defineStore({
  id: 'voice',
  state: () => ({
    engine: 0,
    locale: 0,
    voice: 0,
    pitch: 1,
    rate: 1,
    volume: 1,
    remark: '收到作业申请'
  }),
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVoiceStore, import.meta.hot))
}