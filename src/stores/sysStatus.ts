import { defineStore, acceptHMRUpdate } from "pinia"
export const useSysStatusStore = defineStore('sysStatus',{
  state: () => ({
    触发系统菜单数据查询:Date.now(),
    触发作业状态数据查询:Date.now(),
    触发历史作业状态数据查询:Date.now(),
    触发完成信息查询:Date.now(),
    触发注册飞机查询:Date.now(),
    触发语音记录查询:Date.now(),
    触发网络信息查询:Date.now(),
    触发电子围栏信息查询:Date.now(),
    触发无人机空域信息查询:Date.now(),
    触发飞行活动信息查询:Date.now(),
    在线人数:'',
    网络状态: '',
    内存占用:'',
  }),
  persist: false,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSysStatusStore, import.meta.hot))
}

