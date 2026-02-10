import { defineStore, acceptHMRUpdate } from "pinia"
import moment from 'moment'
import { shallowReactive } from 'vue'
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
    planeCount:0,
    fps:0,
    数字时钟:moment().format('YYYY-MM-DD')+'&emsp;'+moment().format('HH:mm:ss'),
    //下面两行用于人影飞机跟踪
    飞机数据:shallowReactive<any[]>([]),
    注册飞机数据:shallowReactive<any[]>([]),
    需要重点关注的飞机:shallowReactive<any[]>([]),
    prevPlanRequestShow:false,
    prevPlanRequestData:{
      strID: "",
      strCode: "",
      strName: "",
      strPos: "",
      iMaxShotRange: 0,
      iMaxShotHei: 0,
      iWeapon: 0,
      iWorkType: 1,
      iShotRangeBegin: 0,
      iShotRangeEnd: 0,
      beginTime: moment().format("HH:mm:ss"),
      duration: 1,
      unitName:"",
    },
    prevPlanReplyShow:false,
    prevPlanReplyData:{
      strID: "",
      strCode: "",
      strName: "",
      strPos: "",
      iMaxShotRange: 0,
      iMaxShotHei: 0,
      iWeapon: 0,
      iWorkType:1,
      iShotRangeBegin: 0,
      iShotRangeEnd: 0,
      beginTime: moment().format("HH:mm:ss"),
      duration: 1,
    },
    作业点原始数据:shallowReactive<any[]>([]),
  }),
  persist: false,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSysStatusStore, import.meta.hot))
}

