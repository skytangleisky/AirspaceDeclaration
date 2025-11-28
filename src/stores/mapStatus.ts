import { defineStore, acceptHMRUpdate } from "pinia"
export const useMapStatusStore = defineStore('mapStatus',{
  state: () => ({
    pitch: 0,
    bearing: 0,
    zoom: 6,
    center: [
      101.974380,
      30.375163,
    ]
  }),
  persist: true,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMapStatusStore, import.meta.hot))
}

