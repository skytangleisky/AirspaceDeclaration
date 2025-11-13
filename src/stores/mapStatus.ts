import { defineStore, acceptHMRUpdate } from "pinia"
export const useMapStatusStore = defineStore('mapStatus',{
  state: () => ({
    pitch: 0,
    bearing: 0,
    zoom: 5,
    center: [
      115.3683244,
      40.915085
    ]
  }),
  persist: true,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMapStatusStore, import.meta.hot))
}

