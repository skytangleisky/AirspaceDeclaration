<template>
  <div style="width: 100%; height: 100%; overflow: auto; position: relative;display: flex;">
    <div style="position: relative;flex:1;">
      <div
        v-resize="resize"
        ref="mapRef"
        class="mapboxContainer"
      ></div>
      <svg class="center" v-if="setting.人影.监控.准心" width="20" height="20" viewBox="0 0 20 20">
        <path
          d="M10 0 L10 20 M0 10 L20 10"
          stroke="#ff0000"
          stroke-width="1"
        />
      </svg>
      <Dialog
        v-show="setting.menus"
        class="stationDialog"
        v-model:menus="dialogOptions.menus"
      ></Dialog>
      <BatchDialog v-model:batchList="batchList" v-model:pointDialogVisible="batchDialogVisible"></BatchDialog>
      <Batch2Dialog v-model:batchList="batchList2" v-model:pointDialogVisible="batch2DialogVisible"></Batch2Dialog>
      <plan-panel
        v-show="setting.menus"
        :当前作业进度="planProps.当前作业进度"
        :今日作业记录="planProps.今日作业记录"
      ></plan-panel>
      <!-- <el-select
        class="select"
        style="position: absolute; width: 100px; left: 588px; top: 10px"
        size="small"
        v-model="color"
        placeholder="请选择颜色"
      >
        <el-option
          v-for="(v, k) in options"
          :label="v.label"
          :value="v.value"
          :key="k"
        ></el-option>
      </el-select> -->
      <div class="menu" ref="stationMenuRef" @mousedown.stop>
        <ul>
          <li v-if="menuType=='地面作业申请'" @click="作业申请()">地面作业申请</li>
          <li v-if="menuType=='地面作业申请'" @click="视频会议()">语音视频会议</li>
          <li v-if="menuType=='地面作业申请'" @click="语音管理()">语音数据管理</li>
          <li v-if="menuType=='人工批复'" @click="人工批复()">人工批复</li>
          <li v-if="menuType=='人工批复'" @click="手动移除()">手动移除</li>
          <li v-if="menuType=='人工批复'" @click="语音管理()">语音管理</li>
          <li v-if="menuType=='批量操作'" @click="批量申请()">批量申请</li>
          <li v-if="menuType=='批量操作'" @click="批量批复()">批量批复</li>
          <li v-if="menuType=='批量操作'" @click="批量移除()">批量移除</li>
          <li v-if="menuType=='批量操作'" @click="显示射界()">显示射界</li>
          <li v-if="menuType=='批量操作'" @click="批量烟炉操作()">烟炉操作</li>
          <li v-if="menuType=='批量操作'" @click="清除形状()">清除形状</li>
          <li v-if="menuType=='默认'" @click="手动移除()">手动移除</li>
          <li v-if="menuType=='默认'" @click="视频会议()">语音视频会议</li>
          <li v-if="menuType=='烟炉操作'" @click="烟炉操作()">烟炉操作</li>
          <!-- <li>查看作业点信息</li> -->
          <!-- <li>人工批复</li>
          <li>人工移除</li>
          <li>手动发结束报</li> -->
        </ul>
      </div>
      <Tool-Box />
    </div>
    <div v-if="视频列表.filter(it=>it.visible).length>0" style="position:relative;width:500px;overflow: auto;">
      <template v-for="item in 视频列表" :key="item.strWorkID">
        <Video :item="item" v-if="item.visible"></Video>
      </template>
    </div>
    <!-- <div v-dragable class="meeting" v-if="metting">
      <div class="close-btn" @click="metting=false" @mousedown.stop><el-icon v-html="closeUrl"></el-icon></div>
    </div> -->
    <Frame v-model:render="metting" once>
      <iframe style="width:100%;height:100%;user-select:none;background: linear-gradient(135deg, #5a5a71 0%, #33354a 100%);"  ref="iframeRef" src="https://172.18.7.38" frameborder="0" allow="camera; microphone; geolocation" @load="load"></iframe>
    </Frame>
    <ConfigureRegion></ConfigureRegion>
    <!-- <ConfigureSmokeStove></ConfigureSmokeStove> -->
    <ConfigureRocket></ConfigureRocket>
    <ConfigureAudioData></ConfigureAudioData>
    <ConfigureReplyRate></ConfigureReplyRate>
    <ConfigrueNetwork></ConfigrueNetwork>
    <!-- <Overview></Overview> -->
  </div>
</template>
<script lang="ts" setup>
import Frame from '~/frames/frame.vue'
import ConfigureReplyRate from '~/myComponents/人影/批复率统计/index.vue'
import ConfigureRegion from '~/myComponents/人影/配置区划/index.vue'
import ConfigureSmokeStove from '~/myComponents/人影/烟炉/index.vue'
import ConfigureRocket from '~/myComponents/人影/火箭架控制/index.vue'
import ConfigureAudioData from '~/myComponents/人影/语音管理/index.vue'
import ConfigrueNetwork from '~/myComponents/人影/网络信息/index.vue'
import Overview from '~/myComponents/人影/弹药概况/index.vue'
import { csv2list } from '~/tools'
import mettingData from '/空域申请会议号和终端列表.csv?url&raw'
const mettingList = csv2list(mettingData)
let 作业点原始数据 = new Array()//存放作业点最原始的数据
import closeUrl from '~/assets/close.svg?raw'
async function 批量烟炉操作(){
  // setting.显示烟炉 = true
  // $(stationMenuRef.value as HTMLDivElement).css({display:'none'});


console.log('aaaa')
let list = []
for(let j=0;j<stoveFeaturesData.features.length;j++){
  const targetPos = point(stoveFeaturesData.features[j].geometry.coordinates)
  let isInf = false
  for(let i=0;i<draw.getAll().features.length;i++){
    const feature = draw.getAll().features[i];
    const poly = polygon((feature.geometry as any).coordinates)
    if(booleanPointInPolygon(targetPos,poly)){
      isInf = true
      break
    }
  }
  if(isInf){
    list.push(stoveFeaturesData.features[j])
  }
}
station.currentStoveID = ''
await nextTick()
for(let i=0;i<list.length;i++){
  const feature = list[i];
  station.currentStoveID = feature.properties.strStoveID
  await nextTick()
}
setting.显示烟炉 = true
}
async function 烟炉操作(){
  station.currentStoveID = ''
  await nextTick()
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'});
  const data = $(stationMenuRef.value as HTMLDivElement).data();
  setting.显示烟炉 = true
  station.currentStoveID = data.strStoveID
}
function 视频会议(){
  let has = false
  for(let i=0;i<mettingList.length;i++){
    const item = mettingList[i]
    if(item.作业点编号 == station.人影界面被选中的设备){
      has = true
      break
    }
  }
  if(!has){
    ElMessage({
      message: `当前作业点${station.人影界面被选中的设备}不支持视频会议!`,
      type: 'warning',
    })
  }else{
    metting.value=true
  }
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
}
function 语音管理(){
  setting.语音管理 = true
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
}
function 清除形状(){
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
  移除draw绘制的所有图形()
  draw.changeMode('no_select')
}
const metting = ref(false)
import { 绘制主力量规划轨迹 } from './主力量规划航迹.js'
import { 辅助力量规划航迹 } from './辅助力量规划航迹.js'
import { 紧急力量规划航迹 } from './紧急力量规划航迹.js'
import MYJCurl from '~/assets/MYJC.png?url'
import JYJCurl from '~/assets/JYJC.png?url'
let sixMinutesTimer:any;
let fifteenMinutesTimer:any;
let threeMinutesTimer:any;
let adsbTimer:any;
let fpsTimer:any;
const decoder = new TextDecoder('gbk')
import Video from './pages/video.vue'
import ToolBox from './pages/toolBox.vue'
import custom_draw_line_with_distance from './CustomDrawLineWithDistance.js'
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import BatchDialog from "./batchDialog.vue";
import Batch2Dialog from "./batch2Dialog.vue";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import transparentPng from '~/assets/transparent.png?url'
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.scss";
import styles from './drawTheme/theme.js'
import mapboxgl from 'mapbox-gl_wstd'
import menusSvg from '~/assets/menus.svg?raw'
import adsbSvg from '~/assets/adsb.svg?url'
import banSvg from '~/assets/ban.svg?url'
import stoveUrl from '~/assets/stove.svg?url'
import planeUrl from "~/assets/飞机.svg?url";
import projectileUrl from "~/assets/projectile.svg?url";
import triangleUrl from "~/assets/triangle.svg?url"
import circleUrl from '~/assets/circle.svg?url'
import 导航台图标 from '~/assets/navigationStation.svg?url'
import 火箭弹图标 from '~/assets/火箭弹.svg?url'
import 高炮图标 from '~/assets/高炮.svg?url'
import adsbUrl from '~/assets/plane.svg?url'
import popSvg from '~/assets/pop.svg?url'
import trackSvg from '~/assets/track.svg?url'
import axios from 'axios'
import { eventbus } from "~/eventbus";
import { reactive, onMounted, onBeforeUnmount, ref, watch, shallowRef,computed, nextTick } from "vue";
const cache = new Array()
const 视频列表 = computed(()=>{
  const arr = new Array()
  planProps.当前作业进度.forEach((item:any)=>{
    if(item.strZydID.startsWith('110')){
      if(cache.filter(it=>it.strZydID == item.strZydID).length>0){//复用缓冲中的记录，避免窗口被隐藏后，依然会被再次刷新列表展示出来
        arr.push(Object.assign(cache.filter(it=>it.strZydID == item.strZydID)[0],item))
      }else{
        //如果不存在记录，先默认显示，再缓存记录
        item.visible = true
        arr.push(item)
        cache.push(item)
      }
    }
  })
  //清除在缓存中存在，但是返回的数据列表中不存在的记录
  for(let i=0;i<cache.length;i++){
    if(arr.filter(it=>it.strZydID == cache[i].strZydID).length==0){
      cache.splice(i--,1)
    }
  }
  return arr
})
import { planDataType,zyddataType } from "./planPanel.vue";
import PlanPanel from "./planPanel.vue";
import Dialog from "./dialog.vue";
import { addFeatherImages,View,fromDMS,toDMS } from "~/tools";
import { getImage } from '~/tools/project.js'
import CustomLayer from "./webglLayer/CustomLayer.js";
import airstrip from "./airstrip.js";
import {getTodayRecords,airspaceApply} from "~/api/人影/index.js"
import { loadImage2Map } from "~/tools/index.ts";
// import contour from './gridContour'
import contour from './testContour'
import contour2 from './discreteContour'
import moment from "moment";
// import { wgs84togcj02 } from "~/myComponents/map/workers/mapUtil";
function wgs84togcj02(lng,lat){//不做纠偏
  return [lng,lat]
}
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useSettingStore,formatUrl } from "~/stores/setting.js";
import { useMapStatusStore } from "~/stores/mapStatus"
const mapStatus = useMapStatusStore()
const setting = useSettingStore();
import * as turf from "@turf/turf";
const dialogOptions = reactive({ menus: new Array() });
const stationMenuRef = ref<HTMLDivElement>();
const iframeRef = ref<HTMLIFrameElement>()
const menuType=ref('地面作业申请');
let circleFeaturesData: any = {
  type: "FeatureCollection",
  features: [],
};
let forewarningFeaturesData: any = {
  type: "FeatureCollection",
  features: [],
};
let trackFeatures: any = [];//存放飞机尾迹
let adsbTrackFeatures: any = []//存放ADSB尾迹
const batchDialogVisible = ref(false)
const batch2DialogVisible = ref(false)
let batchList = reactive([])
let batchList2 = reactive([])
let testFeaturesData: any = {
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [112.906944, 39.807222],
    },
    properties: {
      strName: "消云试验点1",
      'icon-image':'projectile-test',
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [112.917500, 39.823333],
    },
    properties: {
      strName: "消云试验点2",
      'icon-image':'projectile-test',
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [112.910278, 39.837778],
    },
    properties: {
      strName: "消云试验点3",
      'icon-image':'projectile-test',
    },
  }],
};
let stoveFeaturesData: any = {
  type: "FeatureCollection",
  features: [],
};
let zydFeaturesData: any = {
  type: "FeatureCollection",
  features: [],
};
let synergyFeaturesData:any = {
  type: "FeatureCollection",
  features: [],
};
import {华北飞行区域,作业点,协同作业点,机场,当前作业查询,作业状态数据,ADSB,红外云图,组合反射率,CMPAS降水融合3km,睿图雷达,历史作业查询,空域申请移除,基本站,一般站,区域站,getTrack,getPlanPath,真彩图,烟炉数据} from '~/api/天工'
function status2value(key:number){
  let ubyStatus = [
    { key: 0, value: "空闲" },
    { key: 9, value: "作业完成" },
    { key: 70, vlaue: "作业保存" },
    { key: 72, value: "作业申请待批复" },
    { key: 73, value: "撤销申请待回执" },
    { key: 74, value: "已撤销" },
    { key: 75, value: "作业批准" },
    { key: 76, value: "作业不批准" },
    { key: 90, value: "作业开始带回执" },
    { key: 91, value: "作业开始" },
    { key: 92, value: "作业暂停待回执" },
    { key: 93, value: "作业强制终止" },
    { key: 99, value: "人工移除" },
    { key: 100, value: "作业结束" },
  ]
  return ubyStatus.filter((item) => item.key == key)[0]?.value || `未知状态${key}`;
}
const emits = defineEmits([
  "update:center",
  "update:zoom",
  "update:pitch",
  "update:bearing",
  "update:prevRequestShow",
  "update:prevRequestData",
  'update:prevReplyShow',
  'update:prevReplyData',
]);
let 批量申请 = () => {
  setting.人影.监控.是否显示分布面板 = false
  setting.人影.监控.是否显示产品面板 = false
  setting.人影.监控.是否显示工具面板 = false
  let list = []
  for(let j=0;j<dialogOptions.menus.length;j++){
    let station = dialogOptions.menus[j];
    let targetPos = point(wgs84togcj02(...fromDMS((station as any).strPos)))
    let isInf = false
    for(let i=0;i<draw.getAll().features.length;i++){
      const feature = draw.getAll().features[i];
      const poly = polygon((feature.geometry as any).coordinates)
      if(booleanPointInPolygon(targetPos,poly)){
        isInf = true
        break
      }
    }
    if(isInf){
      list.push(station)
    }
  }
  //过滤掉处于['作业申请待批复','作业批准','作业开始']状态作业点
  list = list.filter((item:any)=>{
    for(let i=0;i<circleFeaturesData.features.length;i++){
      if(item.strID==circleFeaturesData.features[i].properties.strID){
        if(['作业申请待批复','作业批准','作业开始'].includes(circleFeaturesData.features[i].properties.ubyStatus)){
          return false
        }
      }
    }
    return true
  })
  batchList.splice(0,batchList.length,...list)
  batchDialogVisible.value = true
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
}
function 显示射界(){
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
  let source = map.getSource("zydSource");
  /*
  zydFeaturesData.features = zydFeaturesData.features.map((item: any) => {
    // if (item.properties.id == station.人影界面被选中的设备) {
    //   item.properties["icon-image"] = "projectile-orange";
    // } else {
    //   item.properties["icon-image"] = "projectile-orange";
    // }
    return item;
  });
  source.setData(zydFeaturesData);
  */

  let list = new Array()
  for(let j=0;j<dialogOptions.menus.length;j++){
    let station = dialogOptions.menus[j];
    let targetPos = point(wgs84togcj02(...fromDMS((station as any).strPos)))
    let isInf = false
    for(let i=0;i<draw.getAll().features.length;i++){
      const feature = draw.getAll().features[i];
      const poly = polygon((feature.geometry as any).coordinates)
      if(booleanPointInPolygon(targetPos,poly)){
        isInf = true
        break
      }
    }
    if(isInf){
      list.push(station)
    }
  }
  list.forEach((item:any)=>map.setFeatureState({source:'最大射程source',id:item.strID},{opacity:0.5}))
  list.forEach((item:any)=>map.setFeatureState({source:'警戒圈source',id:item.strID},{opacity:0.5}))
}
let 批量批复 = () => {
  let list = new Array()
  for(let j=0;j<dialogOptions.menus.length;j++){
    let station = dialogOptions.menus[j];
    let targetPos = point(wgs84togcj02(...fromDMS((station as any).strPos)))
    let isInf = false
    for(let i=0;i<draw.getAll().features.length;i++){
      const feature = draw.getAll().features[i];
      const poly = polygon((feature.geometry as any).coordinates)
      if(booleanPointInPolygon(targetPos,poly)){
        isInf = true
        break
      }
    }
    if(isInf){
      list.push(station)
    }
  }
  //过滤掉处于['作业申请待批复']以外状态的作业点
  list = list.filter((item:any)=>{
    for(let i=0;i<circleFeaturesData.features.length;i++){
      if(item.strID==circleFeaturesData.features[i].properties.strID){
        if(['作业申请待批复'].includes(circleFeaturesData.features[i].properties.ubyStatus)){
          item.properties = circleFeaturesData.features[i].properties
          return true
        }
      }
    }
    return false
  })
  batchList2.splice(0,batchList2.length,...list)
  batch2DialogVisible.value = true
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
}
let 批量移除 = () => {
  let list = new Array()
  for(let j=0;j<dialogOptions.menus.length;j++){
    let station = dialogOptions.menus[j];
    let targetPos = point(wgs84togcj02(...fromDMS((station as any).strPos)))
    let isInf = false
    for(let i=0;i<draw.getAll().features.length;i++){
      const feature = draw.getAll().features[i];
      const poly = polygon((feature.geometry as any).coordinates)
      if(booleanPointInPolygon(targetPos,poly)){
        isInf = true
        break
      }
    }
    if(isInf){
      list.push(station)
    }
  }
  //过滤掉处于['作业申请待批复']以外状态的作业点
  list = list.filter((item:any)=>{
    for(let i=0;i<circleFeaturesData.features.length;i++){
      if(item.strID==circleFeaturesData.features[i].properties.strID){
        if(['作业申请待批复','作业批准','作业开始'].includes(circleFeaturesData.features[i].properties.ubyStatus)){
          item.properties = circleFeaturesData.features[i].properties
          return true
        }
      }
    }
    return false
  })
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
  let data = list.map(item=>{
    return {strWorkID:item.properties.strWorkID}
  })
  if(data.length==0){
    ElMessage({
      message: '没有要移除的作业点',
      type: 'warning',
    })
    return
  }
  空域申请移除(data).then(res=>{
    ElMessage({
      message: '移除成功',
      type: 'success',
    })
    data.map(item=>{
      map.setFeatureState({source:'最大射程source',id:item.strWorkID},{
        ubyStatus:'空闲',
        opacity:0
      })
      map.setFeatureState({source:'警戒圈source',id:item.strWorkID},{
        ubyStatus:'空闲',
        opacity:0
      })
      map.setFeatureState({source:'zydSource',id:item.strWorkID},{
        ubyStatus:'空闲',
        opacity:0
      })
    })
    station.人影界面被选中的设备 = ''
    清除形状()
  }).catch(e=>{
    ElMessage({
      message: '移除失败',
      type:'error',
    })
  })
}
const 人工批复 = () => {
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
  let properties = $(stationMenuRef.value as HTMLDivElement).data();
  emits("update:prevReplyShow", true);
  emits("update:prevReplyData", properties);
}
const 手动移除=async () => {
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
  let properties = $(stationMenuRef.value as HTMLDivElement).data();
  空域申请移除([{strWorkID:properties.strWorkID}]).then(res=>{
    ElMessage({
      message: '移除成功',
      type: 'success',
    })
    map.setFeatureState({source:'最大射程source',id:properties.strID},{
      ubyStatus:'空闲',
      opacity:0
    })
    map.setFeatureState({source:'警戒圈source',id:properties.strID},{
      ubyStatus:'空闲',
      opacity:0
    })
    map.setFeatureState({source:'zydSource',id:properties.strID},{
      ubyStatus:'空闲',
      opacity:0
    })
    station.人影界面被选中的设备 = ''
  }).catch(e=>{
    ElMessage({
      message: '移除失败',
      type:'error',
    })
  })
}
let 作业申请 = () => {
  setting.人影.监控.是否显示分布面板 = false
  setting.人影.监控.是否显示产品面板 = false
  setting.人影.监控.是否显示工具面板 = false
  let properties = $(stationMenuRef.value as HTMLDivElement).data();
  $(stationMenuRef.value as HTMLDivElement).css({display:'none'})
  emits("update:prevRequestShow", true);
  properties.beginTime = moment().format('HH:mm:ss')
  emits("update:prevRequestData", properties);
};
import {
  calculateSectorPoints,
  calculateCirclePoints,
} from "~/tools/index.ts";
import { prevRequestDataType } from "../dialog_plan_request.vue";
mapboxgl.accessToken = "pk.eyJ1IjoidGFuZ2xlaTIwMTMxNCIsImEiOiJjbGtmOTdyNWoxY2F1M3Jqczk4cGllYXp3In0.9N-H_79ehy4dJeuykZa0xA";
const Marker = mapboxgl.Marker;
const Popup = mapboxgl.Popup;
const NavigationControl = mapboxgl.NavigationControl;
const FullscreenControl = mapboxgl.FullscreenControl;
let timer = 0;
let frameCounter = 0;
const mapRef = ref<HTMLCanvasElement>();
// const color = ref("red");
// const options = ref([
//   { label: "红色", value: "red" },
//   { label: "绿色", value: "green" },
//   { label: "蓝色", value: "blue" },
// ]);
type zydparaType = {
  strID: "110108082";
  strCode: "110108082";
  strName: "北马场作业站烟炉";
  strRelayUnit: "110108000";
  strMgrUnit: "990201000";
  strPos: "116090001E39584800N";
  strWeapon: 3;
  iMaxShotHei: 8000;
  iMaxShotRange: 10000;
  strShotSector: "360";
  strShotAngle: "90";
  strIP: "NULL";
  strSimNo: "NULL";
  bAutoUpSend: 1;
  bAutoDownSend: 1;
  iVersion: 2;
  listenPort: 15;
  iShortAngelBegin: number;
  iShortAngelEnd: 360;
  iType: null;
  connectType: 0;
  dataver: 50;
  iAltitude: 0;
  unitName: string;
};
type stationData = {
  unitName: string;
} & zydparaType;
let map: any;
const resize = () => {
  map && map.resize();
};
const planProps = reactive({
  当前作业进度: new Array<planDataType>(),
  今日作业记录: new Array<planDataType>(),
});
const props = withDefaults(
  defineProps<{
    prevReplyShow?: boolean;
    prevReplyData?: prevRequestDataType;
    prevRequestShow?: boolean;
    prevRequestData?: prevRequestDataType;
    routeLine?: boolean;
    district?: boolean;
    zyd?: boolean;
    center?: object;
    zoom?: number;
    pitch?: number;
    bearing?: number;
    zdz?: boolean;
    plane?: boolean;
    airport?: boolean;
    isolines?: boolean;
    isobands?: boolean;
    gridPoint?: boolean;
    gridValue?: boolean;
    feather?: boolean;
    equidistantRing?: boolean;
  }>(),
  {
    routeLine: true,
    zyd: true,
    district: true,
    tile: () => ({
      name: "高德卫星地图",
      url: formatUrl("https://wprd01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"),
      tileData: ["https://wprd01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"],
    }),
    zdz: false,
    plane: true,
    airport: false,
    isolines: true,
    isobands: true,
    gridPoint: true,
    gridValue: true,
    feather: false,
    equidistantRing: false,
    prevReplyShow: false,
  }
);
import {useTheme} from '~/theme';
const theme = useTheme()
// style.layers.map((v: any) => {
//   if (v.id == "simple-tiles") {
//     v.layout.visibility = props.loadmap ? "visible" : "none";
//   } else if (v.id == "districtLineOver" || v.id == "districtLineBase") {
//     // v.layout.visibility = props.district ? "visible" : "none";
//   }
// });
let active = () => {};
const mousemoveFunc = (e:any)=>{
  setting.人影.监控.经纬度 = toDMS(e.lngLat.lng,e.lngLat.lat)
}
const zoomFunc = () => {
  mapStatus.zoom = map.getZoom()
};
const pitchFunc = () => {
  mapStatus.pitch = map.getPitch()
};
const bearingFunc = () => {
  console.log(map.getBearing());
  mapStatus.bearing = map.getBearing()
};
const moveFunc = () => {
  const center = map.getCenter()
  mapStatus.center = [center.lng,center.lat]
};
function 网络上报(data:prevRequestDataType){
  airspaceApply(data).then((res:any)=>{
    console.log('空域申请成功')
  })
  emits('update:prevRequestShow',false)//关闭弹窗
}
function 过滤({altitude,ssrCode}){
  if((setting.人影.监控.飞机高度下限<=altitude&&altitude<=setting.人影.监控.飞机高度上限)&&
    (setting.人影.监控.二次码下限<=ssrCode&&ssrCode<=setting.人影.监控.二次码上限)){
    return true
  }else{
    return false
  }
}
function 移除draw绘制的所有图形(){
  draw&&draw.deleteAll()
}
function 处理飞机实时位置(d:Array<{
  "uiTrackNo": 7,
  "uiAdsAddress": 0,
  "ubyTrackState": 1,
  "ubyTrackQuality": 0,
  "fLongitude": 116.90878295898438,
  "fLatitude": 47.65209197998047,
  "ubyAltitudeMCValid": 0,
  "iAltitudeMC": 0,
  "ubyAltitudeADSValid": 1,
  "iAltitudeADS": 2590,
  "unSsrCode": 5,
  "ubyRadarDataType": 2,
  "ubySim": 0,
  "ubyFixTarget": 0,
  "ubySpiFlag": 0,
  "ubyEmergencyType": 0,
  "fSpeedZ": 0,
  "fSpeed": 302.3819885253906,
  "fHeading": 0.9228208065032959,
  "ubyFlyingState": 0,
  "ubyEmitterCat": 5,
  "strCallCode": ""
}>){
  const tmp = d.filter(item=>{
    for(let plane of setting.人影.监控.注册飞机数据){
      if(item.unSsrCode == Number(plane.iAddress)){
        return true
      }
    }
    return false
  })

  for(let j=0;j<tmp.length;j++){
    for(let i=0;i<setting.人影.监控.需要重点关注的飞机.length;i++){
      const item = setting.人影.监控.需要重点关注的飞机[i]
      if(item.iAddress == tmp[j].unSsrCode){
        tmp[j].icon = 'airplaneMock'
      }
    }
    /*
    let has = false;
    for(let i=0;i<trackLinesFeaturesData.features.length;i++){
      if(trackLinesFeaturesData.features[i].properties.uiTrackNo == tmp[j].uiTrackNo&&trackLinesFeaturesData.features[i].properties.unSsrCode == tmp[j].unSsrCode){
        has = true;
        trackLinesFeaturesData.features[i].properties.icon = tmp[j].icon
        trackLinesFeaturesData.features[i].geometry.coordinates.push(wgs84togcj02(tmp[j].fLongitude,tmp[j].fLatitude))
        break;
      }
    }
    if(!has){
      for(let i=0;i<setting.人影.监控.需要重点关注的飞机.length;i++){
        const item = setting.人影.监控.需要重点关注的飞机[i]
        if(item.iAddress == tmp[j].unSsrCode){
          tmp[j].icon = 'airplaneMock';
          console.log(tmp[j].icon)
        }
      }
      trackLinesFeaturesData.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates:[wgs84togcj02(tmp[j].fLongitude,tmp[j].fLatitude)],
        },
        properties: {
          uiTrackNo:tmp[j].uiTrackNo,
          unSsrCode:tmp[j].unSsrCode,
          icon:tmp[j].icon
        }
      })
    }
    */

    let has = false;
    for(let i=0;i<trackPointsFeaturesData.features.length;i++){
      if(trackPointsFeaturesData.features[i].properties.uiTrackNo == tmp[j].uiTrackNo&&trackPointsFeaturesData.features[i].properties.unSsrCode == tmp[j].unSsrCode){
        has = true;
        trackPointsFeaturesData.features[i].properties.icon = tmp[j].icon
        trackPointsFeaturesData.features[i].geometry.coordinates.push(wgs84togcj02(tmp[j].fLongitude,tmp[j].fLatitude))
        break;
      }
    }
    if(!has){
      for(let i=0;i<setting.人影.监控.需要重点关注的飞机.length;i++){
        const item = setting.人影.监控.需要重点关注的飞机[i]
        if(item.iAddress == tmp[j].unSsrCode){
          tmp[j].icon = 'airplaneMock';
          console.log(tmp[j].icon)
        }
      }
      trackPointsFeaturesData.features.push({
        type: 'Feature',
        geometry: {
          type: 'MultiPoint',
          coordinates:[wgs84togcj02(tmp[j].fLongitude,tmp[j].fLatitude)],
        },
        properties: {
          uiTrackNo:tmp[j].uiTrackNo,
          unSsrCode:tmp[j].unSsrCode,
          icon:tmp[j].icon
        }
      })
    }

  }

  map?.getSource('track')?.setData(trackLinesFeaturesData)
  map?.getSource('trackPoint')?.setData(trackPointsFeaturesData)



  //飞机航迹开始
  // for(let j=0;j<d.length;j++){

  //   for(let i=0;i<setting.人影.监控.需要重点关注的飞机.length;i++){
  //     const item = setting.人影.监控.需要重点关注的飞机[i]
  //     if(item.iAddress == d[j].unSsrCode){
  //       d[j].icon = 'airplaneMock'
  //     }
  //   }

  //   let has = false;
  //   for(let i=0;i<trackFeatures.length;i++){
  //     if(d[j]&&d[j].uiTrackNo===trackFeatures[i].properties.uiTrackNo){
  //       has = true;
  //       trackFeatures[i].properties = {...d[j],opacity:1}
  //       trackFeatures[i].geometry.coordinates.push(wgs84togcj02(d[j].fLongitude,d[j].fLatitude))
  //       if(trackFeatures[i].geometry.coordinates.length>setting.人影.监控.trackCount){
  //         trackFeatures[i].geometry.coordinates.splice(0,trackFeatures[i].geometry.coordinates.length - setting.人影.监控.trackCount)
  //       }
  //       break;
  //     }
  //   }
  //   if(!has){
  //     trackFeatures.push({
  //       type: "Feature",
  //       properties: {...d[j],opacity:1},
  //       geometry: {
  //         type: "MultiPoint",
  //         coordinates: [wgs84togcj02(d[j].fLongitude,d[j].fLatitude)],
  //       },
  //     })
  //   }
  // }
  // map?.getSource("trackSource")?.setData({
  //   type: "FeatureCollection",
  //   features: trackFeatures,
  // })
  //飞机航迹结束
  let data = airplanesData;
  for(let j=0;j<d.length;j++){
    // if(d[j].unSsrCode==0)continue;

    d[j].label = d[j].strCallCode
    for(let i=0;i<setting.人影.监控.需要重点关注的飞机.length;i++){
      const item = setting.人影.监控.需要重点关注的飞机[i]
      if(item.iAddress == d[j].unSsrCode){
        d[j].label = setting.人影.监控.需要重点关注的飞机[i].strCallCode
      }
    }

    let has = false,i=0;
    for(;i<data.features.length;i++){
      if(d[j]&&d[j].uiTrackNo===data.features[i].properties.uiTrackNo){
        has = true;
        break;
      }
    }
    if(has){
      Object.assign(data.features[i].properties,{time:moment().format('YYYY-MM-DD HH:mm:ss'),...d[j],label:'A'+d[j].unSsrCode.toString(8).padStart(4,'0')+(d[j].label?'-'+d[j].label:''),opacity:1,lastTime:performance.now()})
      data.features[i].geometry.coordinates = wgs84togcj02(d[j].fLongitude,d[j].fLatitude)
    }else{
      if(d[j]){
        data.features.push({
          type: "Feature",
          properties: {icon:"airplane",time:moment().format('YYYY-MM-DD HH:mm:ss'),...d[j],label:'A'+d[j].unSsrCode.toString(8).padStart(4,'0')+(d[j].label?'-'+d[j].label:''),opacity:1,lastTime:performance.now()},
          geometry: {
            type: "Point",
            coordinates: wgs84togcj02(d[j].fLongitude,d[j].fLatitude),
          },
        })
      }else{
        console.log(`共${d.length}架，第${j}架飞机数据错误`,d[j])
      }
    }
  }
  for(let k=0;k<data.features.length;k++){
    if(performance.now() - data.features[k].properties.lastTime>10*1e3){
      for(let l=0;l<trackFeatures.length;l++){
        if(trackFeatures[l].properties.uiTrackNo===data.features[k].properties.uiTrackNo){
          trackFeatures.splice(l--,1)
        }
      }
      data.features.splice(k--,1)
    }
  }
  setting.人影.监控.飞机数据.splice(0,setting.人影.监控.飞机数据.length,...data.features)
  map?.getSource("飞机原数据")?.setData(data);
}
function 处理ADSB(d:Array<{
		"aircraft_code": "B788",
		"airline_iata": "TR",
		"airline_icao": "TGW",
		"altitude": 41075,
		"callsign": "TGW180",
		"destination_airport_iata": "NKG",
		"ground_speed": 487,
		"heading": 3,
		"icao_24bit": "76BCCA",
		"id": "39f58fa6",
		"latitude": 26,
		"longitude": 114.9,
		"number": "TR180",
		"on_ground": 0,
		"origin_airport_iata": "SIN",
		"registration": "9V-OFJ",
		"squawk": "",
		"time": 1745043327,
		"vertical_speed": -64
	}>){
  //飞机航迹开始
  for(let j=0;j<d.length;j++){
    let has = false;
    for(let i=0;i<adsbTrackFeatures.length;i++){
      if(d[j]&&d[j].id===adsbTrackFeatures[i].properties.id){
        has = true;
        adsbTrackFeatures[i].properties = {...d[j]}
        adsbTrackFeatures[i].geometry.coordinates.push(wgs84togcj02(d[j].longitude,d[j].latitude))
        if(adsbTrackFeatures[i].geometry.coordinates.length>setting.人影.监控.trackCount){
          adsbTrackFeatures[i].geometry.coordinates.splice(0,adsbTrackFeatures[i].geometry.coordinates.length - setting.人影.监控.trackCount)
        }
        break;
      }
    }
    if(!has){
      adsbTrackFeatures.push({
        type: "Feature",
        properties: {...d[j]},
        geometry: {
          type: "MultiPoint",
          coordinates: [wgs84togcj02(d[j].longitude,d[j].latitude)],
        },
      })
    }
  }
  map?.getSource("adsbTrackSource")?.setData({
    type: "FeatureCollection",
    features: adsbTrackFeatures,
  })
  //飞机航迹结束
  let data = adsbData;
  for(let j=0;j<d.length;j++){
    let has = false,i=0;
    for(;i<data.features.length;i++){
      if(d[j]&&d[j].id===data.features[i].properties.id){
        has = true;
        break;
      }
    }
    if(has){
      Object.assign(data.features[i].properties,d[j],{label:(d[j].ground_speed).toFixed()+'km/h',lastTime:performance.now()})
      data.features[i].geometry.coordinates = wgs84togcj02(d[j].longitude,d[j].latitude)
    }else{
      if(d[j]){
        data.features.push({
          type: "Feature",
          properties: {...d[j],label:(d[j].ground_speed).toFixed()+'km/h',lastTime:performance.now()},
          geometry: {
            type: "Point",
            coordinates: wgs84togcj02(d[j].longitude,d[j].latitude),
          },
        })
      }else{
        console.log(`共${d.length}架，第${j}架飞机数据错误`,d[j])
      }
    }
  }
  for(let k=0;k<data.features.length;k++){
    if(performance.now() - data.features[k].properties.lastTime>10*1e3){
      for(let l=0;l<adsbTrackFeatures.length;l++){
        if(adsbTrackFeatures[l].properties.id===data.features[k].properties.id){
          adsbTrackFeatures.splice(l--,1)//删除轨迹
        }
      }
      data.features.splice(k--,1)//删除飞机
    }
  }
  map?.getSource("adsb原数据")?.setData(data);
}
const flyTo = (item: any) => {
  try {
    active();
    if(Array.isArray(item)){
      map.flyTo({
        center: item, // 新的中心点 [经度, 纬度]
        zoom: 12, // 目标缩放级别
        speed: 1, // 飞行速度，1 为默认速度
        // curve: 1, // 飞行路径的曲率, 1 是直线
        // easing: function (t) {
        //   return t;
        // }, // 自定义缓动函数
        essential: true, // 这个飞行动作对于用户交互是必要的
      });
    }else{
      let position = wgs84togcj02(...fromDMS(item.strPos));
      map.flyTo({
        center: position, // 新的中心点 [经度, 纬度]
        zoom: item.zoom || 9, // 目标缩放级别
        speed: 1, // 飞行速度，1 为默认速度
        // curve: 1, // 飞行路径的曲率, 1 是直线
        // easing: function (t) {
        //   return t;
        // }, // 自定义缓动函数
        essential: true, // 这个飞行动作对于用户交互是必要的
      });
    }
  } catch (error) {
    console.log({ longitude: item.lng, latitude: item.lat });
    console.log(error);
  }
};
const loop = ()=>{
  // aid = requestAnimationFrame(loop)
  // forewarningFeatures.map(item=>{
  //   item.properties.opacity = Math.random()
  // })
  // map.getSource("警戒圈source")?.setData({
  //   type: "FeatureCollection",
  //   features: forewarningFeatures,
  // })

}
const zoomIn = ()=>{
  map&&map.zoomIn()
  map.getCanvas().style.cursor = "default";
}
const zoomOut = ()=>{
  map&&map.zoomOut()
  map.getCanvas().style.cursor = "default";
}
const 批量操作 = ()=>{
  draw.changeMode('draw_polygon')
  map.getCanvas().style.cursor = "crosshair";
}
const 经纬度 = ()=>{
  setting.获取经纬度 = true
}
watch(()=>setting.人影.监控.tileOpacity,(opacity)=>{
  map.setPaintProperty('simple-tiles','raster-opacity',opacity)
})
watch(()=>setting.获取经纬度,()=>{
  setting.获取经纬度 ? map.getCanvas().style.cursor = "crosshair" : map.getCanvas().style.cursor = "default";
})
const 测距 = ()=>{
  draw.changeMode('custom_draw_line_with_distance')
}
const 清除 = ()=>{
  清除形状()
}

setting.zoomIn = zoomIn
setting.zoomOut = zoomOut
setting.批量操作 = 批量操作
setting.测距 = 测距
setting.清除 = 清除
setting.标点 = ()=>{
  map.getCanvas().style.cursor = "crosshair";
  draw.changeMode('draw_point')
}
setting.标线 = ()=>{
  map.getCanvas().style.cursor = "crosshair";
  draw.changeMode('draw_line_string')
}
setting.标面 = ()=>{
  map.getCanvas().style.cursor = "crosshair";
  draw.changeMode('draw_polygon')
}

setting.绘制复原 = ()=>{
  map.getCanvas().style.cursor = "default";
  draw.changeMode('simple_select')
}
let draw:MapboxDraw;
defineExpose({
  zoomIn,
  zoomOut,
  批量操作,
  经纬度,
})
let aid = 0;
import getStyle from './editMap.js'
let style = getStyle()
const keydownFunc = (event) => {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    draw&&draw.trash()
  }
}
let airplanesData = {//存放飞机
  type: "FeatureCollection",
  features: new Array<any>(),
}
let adsbData: any = {//存放adsb飞机
  type:"FeatureCollection",
  features:new Array<any>(),
};
let airplanesMockData = {
  type: "FeatureCollection",
  features: new Array<any>(),
}
let trackLinesFeaturesData = {
  type: "FeatureCollection",
  features: new Array<any>(),
}
let trackPointsFeaturesData = {
  type: "FeatureCollection",
  features: new Array<any>(),
}

function convertMultiPointToLineString(multiPointFeature) {
  if (
    multiPointFeature?.geometry?.type === "MultiPoint" &&
    Array.isArray(multiPointFeature.geometry.coordinates)
  ) {
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: multiPointFeature.geometry.coordinates
      },
      properties: { ...multiPointFeature.properties }
    };
  } else {
    throw new Error("Invalid MultiPoint feature");
  }
}
import Plane,{PointLayer} from './三维物体/CustomLayer.js'
import { ElMessage } from 'element-plus';
function load(){
  for(let i=0;i<mettingList.length;i++){
    const item = mettingList[i]
    if(item.作业点编号 == station.人影界面被选中的设备){
      iframeRef.value?.contentWindow?.postMessage({
        type:'hello',
        meeting:item.终端号,
        meetingName:'会议',
      },'*')
      break
    }
  }
}
onMounted(async() => {
  // ElMessage({
  //   message: '当前版本为1.1.97',
  //   type: 'info',
  // })

  // 视频会议结束
  window.addEventListener('message', (event) => {
    if(event.data){
      if(event.data.type==='close'){
        metting.value = false
      }
    }
  });
  document.addEventListener("keydown", keydownFunc);
  aid = requestAnimationFrame(loop)
  map = new mapboxgl.Map({
    container: (mapRef.value as unknown) as HTMLCanvasElement,
    projection: "mercator",//mercator|globe|equirectangular
    // style: raster,/Users/admin/Desktop/3D/mapbox-gl-js/dist/mapbox-gl.js.map
    style:style as any,
    fadeDuration: 100,
    // dragRotate: false,
    // touchRotate: false,
    // touchPitch: false,
    // dragPitch: false,
    // bounds: turf.bbox(boundaries),
    // localIdeographFontFamily: "Microsoft YoHei",
    localIdeographFontFamily: "Menlo,Consolas,Monaco",
    antialias: true,
    renderWorldCopies: true,
    // maxZoom: 17,
    maxZoom: 21, //mapbox最高支持21,瓦片等级最高到22级
    // minZoom: 1,
    // maxBounds: [
    //   [60.0, 0],
    //   [160.0, 60],
    // ],
    // zoom: 18,
    // center: [148.9819, -35.3981],
    zoom: mapStatus.zoom,
    center: mapStatus.center as mapboxgl.LngLatLike,
    pitch: mapStatus.pitch,
    bearing: mapStatus.bearing,
  });
  map.getCanvas().style.cursor = 'default';
  const GISTYPE={
    GIS_POINT: 1,
    GIS_LINE: 2,
    GIS_REGION: 3,
    GIS_POINT2: 11,
    GIS_LINE2 : 12,
    GIS_REGION2: 13,
    GIS_AIRLINE: 20,//航线
    GIS_AIRMAPPOINT: 21,//新的点数据文件
    GIS_AIRMAPLINE: 22,//新的点数据文件
    GIS_AIRMAPREGION: 23,//新的点数据文件
    GIS_AIRLINE2: 30,//新定义的航线，增加航段长，航向信息
    GIS_DATA_POINT: 31,//新的面图元数据
    GIS_DATA_LINE: 32,//新的面图元数据
    GIS_DATA_REGION: 33,//新的面图元数据
  }
  let lastFrameCounter = 0
  map.on("load", async () => {
    if(!map)return;
    await axios.get(`/backend/region/360000_full.json`).then(res=>{

      map.addLayer({
        'id': '360000_full.json_fill',
        'type': 'fill',
        'source': {
          "type":"geojson",
          "data": res.data
        },
        'layout': {
          visibility:setting.人影.监控.sichuanOptions.district?'visible':'none'
        },
        'paint': {
          'fill-color': `rgba(${setting.人影.监控.sichuanOptions.districtFillColor.r},${setting.人影.监控.sichuanOptions.districtFillColor.g},${setting.人影.监控.sichuanOptions.districtFillColor.b},${setting.人影.监控.sichuanOptions.districtFillColor.a})`,
          'fill-outline-color':'transparent',
          'fill-opacity':setting.人影.监控.sichuanOptions.districtFillOpacity,
        }
      })
      map.addLayer({
        'id': '360000_full.json_line',
        'type': 'line',
        'source': {
          "type":"geojson",
          "data": res.data
        },
        'layout': {
          'visibility':setting.人影.监控.sichuanOptions.districtBase?'visible':'none',
          'line-join':'round',
          'line-cap':'round',
        },
        'paint': {
          'line-color': `rgba(${setting.人影.监控.sichuanOptions.districtBaseColor.r},${setting.人影.监控.sichuanOptions.districtBaseColor.g},${setting.人影.监控.sichuanOptions.districtBaseColor.b},${setting.人影.监控.sichuanOptions.districtBaseColor.a})`,
          'line-width': setting.人影.监控.sichuanOptions.districtBaseWidth,
          'line-opacity':setting.人影.监控.sichuanOptions.districtBaseOpacity,
        }
      })
      map.addLayer({
        'id': '360000_full.json_over',
        'type': 'line',
        'source': {
          "type":"geojson",
          "data": res.data
        },
        'layout': {
          'visibility':setting.人影.监控.sichuanOptions.districtLine?'visible':'none',
          'line-join':'round',
          'line-cap':'round',
        },
        'paint': {
          'line-color': `rgba(${setting.人影.监控.sichuanOptions.districtLineColor.r},${setting.人影.监控.sichuanOptions.districtLineColor.g},${setting.人影.监控.sichuanOptions.districtLineColor.b},${setting.人影.监控.sichuanOptions.districtLineColor.a})`,
          'line-width': setting.人影.监控.sichuanOptions.districtLineWidth,
          'line-opacity':setting.人影.监控.sichuanOptions.districtLineOpacity,
          // 'line-dasharray': [1,1],
        }
      })

    })
    fpsTimer = setInterval(()=>{
      setting.人影.监控.fps = map.painter.frameCounter - lastFrameCounter
      lastFrameCounter = map.painter.frameCounter
    },1000)
/*
      map.addSource('pointSource', {
        type: 'geojson',
        promoteId: 'strID',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {
              strID:1
            },
            geometry: { type: 'Point', coordinates: [116.4, 39.9] }
          }]
        }
      });

      map.addLayer({
        id: 'pointLayer',
        type: 'circle',
        source: 'pointSource',
        paint: {
          'circle-radius': 10,
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'active'], false],
            'red',
            'gray'
          ]
        }
      });

      document.onclick = () => {
        const state = map.getFeatureState({ source: 'pointSource', id: 1 })
        console.log(state)
        map.setFeatureState(
          { source: 'pointSource', id: 1 },
          { active:!state.active }
        );
      };
*/



    map.addLayer({
      "id": "routeLineLayer",
      "type": "raster",
      "source": "raster-route",
      "minzoom": 0,
      "maxzoom": 22,
      layout:{
        visibility:setting.人影.监控.routeLine?'visible':'none'
      },
      paint:{
        'raster-opacity':1.0
      }
    })
    map.addLayer({
      'id': 'beijingLayer',
      'type': 'fill',
      'source': 'beijing', // reference the data source
      'layout': {
        visibility:setting.人影.监控.beijingOptions.district?'visible':'none'
      },
      'paint': {
        'fill-color': `rgba(${setting.人影.监控.beijingOptions.districtFillColor.r},${setting.人影.监控.beijingOptions.districtFillColor.g},${setting.人影.监控.beijingOptions.districtFillColor.b},${setting.人影.监控.beijingOptions.districtFillColor.a})`,
        'fill-outline-color':'transparent',
        'fill-opacity':setting.人影.监控.beijingOptions.districtFillOpacity,
      }
    })
    map.addLayer({
      'id': 'beijingLineBase',
      'type': 'line',
      'source': 'beijing',
      'layout': {
        'visibility':setting.人影.监控.beijingOptions.districtBase?'visible':'none',
        'line-join':'round',
        'line-cap':'round',
      },
      'paint': {
        'line-color': `rgba(${setting.人影.监控.beijingOptions.districtBaseColor.r},${setting.人影.监控.beijingOptions.districtBaseColor.g},${setting.人影.监控.beijingOptions.districtBaseColor.b},${setting.人影.监控.beijingOptions.districtBaseColor.a})`,
        'line-width': setting.人影.监控.beijingOptions.districtBaseWidth,
        'line-opacity':setting.人影.监控.beijingOptions.districtBaseOpacity,
      }
    })
    map.addLayer({
      'id': 'beijingLineOver',
      'type': 'line',
      'source': 'beijing',
      'layout': {
        'visibility':setting.人影.监控.beijingOptions.districtLine?'visible':'none',
        'line-join':'round',
        'line-cap':'round',
      },
      'paint': {
        'line-color': `rgba(${setting.人影.监控.beijingOptions.districtLineColor.r},${setting.人影.监控.beijingOptions.districtLineColor.g},${setting.人影.监控.beijingOptions.districtLineColor.b},${setting.人影.监控.beijingOptions.districtLineColor.a})`,
        'line-width': setting.人影.监控.beijingOptions.districtLineWidth,
        'line-opacity':setting.人影.监控.beijingOptions.districtLineOpacity,
        // 'line-dasharray': [1,1],
      }
    })
    // map.addLayer({
    //   'id': 'beijingBorderLineBase',
    //   'type': 'line',
    //   'source': 'beijingBorder',
    //   'layout': {
    //     'visibility':setting.人影.监控.beijingOptions.districtBase?'visible':'none',
    //     'line-join':'round',
    //     'line-cap':'round',
    //   },
    //   'paint': {
    //     'line-color': '#99B2D6',
    //     'line-width': 5,
    //     'line-opacity':1,
    //   }
    // })
    // map.addLayer({
    //   'id': 'beijingBorderLineOver',
    //   'type': 'line',
    //   'source': 'beijingBorder',
    //   'layout': {
    //     'visibility':'visible',
    //     'line-join':'round',
    //     'line-cap':'round',
    //   },
    //   'paint': {
    //     'line-color': '#f00',
    //     'line-width':2,
    //     'line-opacity':1,
    //     // 'line-dasharray': [1,1],
    //   }
    // })
    setting.人影.监控.基本站 && 基本站().then(({data}:any)=>{
      map.getSource('wms-source1').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
    }).catch(e=>{
      console.log(e)
    })
    setting.人影.监控.一般站 && 一般站().then(({data}:any)=>{
      map.getSource('wms-source2').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
    }).catch(e=>{
      console.log(e)
    })
    setting.人影.监控.区域站 && 区域站().then(({data}:any)=>{
      map.getSource('wms-source3').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
    }).catch(e=>{
      console.log(e)
    })
    setting.人影.监控.红外云图&&红外云图().then(async({data}:any)=>{
      const extent = data.extent.split(',').map(Number)
      // const imageUrl = await getImage(data.data,extent)
      const obj = {
        url: data.data,
        coordinates: [
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]],
        ]
      }
      if(map){
        const source = map.getSource(map.getLayer('overlay-layer1').source)
        source.updateImage(obj);
      }
    }).catch((err=>{
      console.log(err)
    }))
    setting.人影.监控.真彩图&&真彩图().then(async({data}:any)=>{
      const extent = data.extent.split(',').map(Number)
      // const imageUrl = await getImage(data.data,extent)
      const obj = {
        url: data.data,
        coordinates: [
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]],
        ]
      }
      if(map){
        const source = map.getSource(map.getLayer('overlay-layer5').source)
        source.updateImage(obj);
      }
    }).catch((err=>{
      console.log(err)
    }))
    setting.人影.监控.CMPAS降水融合3km && CMPAS降水融合3km().then(async({data}:any)=>{
      const extent = data.extent.split(',').map(Number)
      // const imageUrl = await getImage(data.data,extent)
      const obj = {
        url: data.data,
        coordinates: [
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]],
        ]
      }
      if(map){
        const source = map.getSource(map.getLayer('overlay-layer3').source)
        source.updateImage(obj);
      }
    }).catch(err=>{
      console.log(err)
    })
    setting.人影.监控.睿图雷达 && 睿图雷达().then(async({data})=>{
      const extent = data.extent.split(',').map(Number)
      const imageUrl = await getImage(data.data,extent)
      const obj = {
        url: imageUrl,
        coordinates: [
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]],
        ]
      }
      if(map){
        const source = map.getSource(map.getLayer('overlay-layer4').source)
        source.updateImage(obj);
      }
    }).catch(err=>{
      console.log(err)
    })
    setting.人影.监控.组合反射率 && 组合反射率().then(async({data}:any)=>{
      const extent = data.extent.split(',').map(Number)
      const imageUrl = await getImage(data.data,extent)
      const obj = {
        url: imageUrl,
        coordinates: [
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]],
        ]
      }
      if(map){
        const source = map.getSource(map.getLayer('overlay-layer2').source)
        source.updateImage(obj)
      }
    }).catch(err=>{
      console.log(err)
    })
    fifteenMinutesTimer = setInterval(()=>{
      setting.人影.监控.红外云图 && 红外云图().then(async({data}:any)=>{
        const extent = data.extent.split(',').map(Number)
        // const imageUrl = await getImage(data.data,extent)
        const obj = {
          url: data.data,
          coordinates: [
            [extent[0], extent[3]],
            [extent[2], extent[3]],
            [extent[2], extent[1]],
            [extent[0], extent[1]],
          ]
        }
        if(map){
          const source = map.getSource(map.getLayer('overlay-layer1').source)
          source.updateImage(obj)
        }
      }).catch((err=>{
        console.log(err)
      }))
      setting.人影.监控.真彩图 && 真彩图().then(async({data}:any)=>{
        const extent = data.extent.split(',').map(Number)
        // const imageUrl = await getImage(data.data,extent)
        const obj = {
          url: data.data,
          coordinates: [
            [extent[0], extent[3]],
            [extent[2], extent[3]],
            [extent[2], extent[1]],
            [extent[0], extent[1]],
          ]
        }
        if(map){
          const source = map.getSource(map.getLayer('overlay-layer5').source)
          source.updateImage(obj)
        }
      }).catch((err=>{
        console.log(err)
      }))
    },15*60*1e3)
    sixMinutesTimer = setInterval(()=>{
      setting.人影.监控.CMPAS降水融合3km && CMPAS降水融合3km().then(async({data}:any)=>{
        const extent = data.extent.split(',').map(Number)
        // const imageUrl = await getImage(data.data,extent)
        const obj = {
          url: data.data,
          coordinates: [
            [extent[0], extent[3]],
            [extent[2], extent[3]],
            [extent[2], extent[1]],
            [extent[0], extent[1]],
          ]
        }
        if(map){
          const source = map.getSource(map.getLayer('overlay-layer3').source)
          source.updateImage(obj)
        }
      }).catch(err=>{
        console.log(err)
      })
      setting.人影.监控.组合反射率 && 组合反射率().then(async({data}:any)=>{
        const extent = data.extent.split(',').map(Number)
        const imageUrl = await getImage(data.data,extent)
        const obj = {
          url: imageUrl,
          coordinates: [
            [extent[0], extent[3]],
            [extent[2], extent[3]],
            [extent[2], extent[1]],
            [extent[0], extent[1]],
          ]
        }
        if(map){
          const source = map.getSource(map.getLayer('overlay-layer2').source)
          source.updateImage(obj)
        }
      }).catch(err=>{
        console.log(err)
      })

      setting.人影.监控.基本站 && 基本站().then(async({data}:any)=>{
        map.getSource('wms-source1').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
      }).catch(e=>{
        console.log(e)
      })
      setting.人影.监控.一般站 && 一般站().then(async({data}:any)=>{
        map.getSource('wms-source2').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
      }).catch(e=>{
        console.log(e)
      })
      setting.人影.监控.区域站 && 区域站().then(async({data}:any)=>{
        map.getSource('wms-source3').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
      }).catch(e=>{
        console.log(e)
      })
    },6*60*1e3)
    threeMinutesTimer = setInterval(()=>{
      setting.人影.监控.睿图雷达 && 睿图雷达().then(async({data}:any)=>{
        const extent = data.extent.split(',').map(Number)
        const imageUrl = await getImage(data.data,extent)
        const obj = {
          url: imageUrl,
          coordinates: [
            [extent[0], extent[3]],
            [extent[2], extent[3]],
            [extent[2], extent[1]],
            [extent[0], extent[1]],
          ]
        }
        if(map){
          const source = map.getSource(map.getLayer('overlay-layer4').source)
          source.updateImage(obj)
        }
      }).catch(err=>{
        console.log(err)
      })
    }, 3*60*1e3)
    // axios.get('/cdb/api/v1/rada/radarV3Product/getProduct?fileName=Z_RADA_C_BABJ_20250701120620_P_DOR_ACHN_CREF_20250701_120000.bin_EPSG4326_CR.png&productType=RADA_L3_MST_CREF_QC&smooth=false&sdpTime=1751371914550').then(({data})=>{
    //   const extent = data.data.extent.split(',').map(Number)
    //   console.log(data)
    //   map.addLayer({
    //     id: 'overlay-layer1',
    //     source: {
    //       type: 'image',
    //       url: data.data.data,
    //       coordinates: [
    //         [extent[0], extent[3]],
    //         [extent[2], extent[3]],
    //         [extent[2], extent[1]],
    //         [extent[0], extent[1]],
    //       ]
    //     },
    //     type: 'raster',
    //     paint: {
    //       'raster-opacity': 1,
    //       'raster-resampling': 'nearest'
    //     }
    //   });
    // })







    const center: [number, number] = wgs84togcj02(116.3913,39.907105) as [
      number,
      number
    ]; // 圆心点的经纬
    let radius: number = 60*1000; // 半径（单位：米
    let steps: number = 360; // 用于生成圆弧的步数，越大越平滑
    let units: turf.Units = "meters"; // 半径的单位
    let sectorPoints: [number, number][] = calculateCirclePoints(
      center,
      radius,
      steps,
      units
    );
    let sectorPolygon = turf.polygon([sectorPoints], {});
    map.addLayer({
      id: "line1",
      type: "line",
      source: {
        type:'geojson',
        data:{
          type: "FeatureCollection",
          features: [sectorPolygon],
        },
      },
      layout:{
        visibility:setting.人影.监控.北京保障圈?'visible':'none'
      },
      paint: {
        "line-color": "rgb(102,102,102)",
        "line-width": 1,
        // "line-dasharray": [1, 1],
      },
    });

    radius = 120*1000; // 半径（单位：米
    steps = 360; // 用于生成圆弧的步数，越大越平滑
    units = "meters"; // 半径的单位
    sectorPoints = calculateCirclePoints(
      center,
      radius,
      steps,
      units
    );
    sectorPolygon = turf.polygon([sectorPoints], {});
    map.addLayer({
      id: "line2",
      type: "line",
      source: {
        type:'geojson',
        data:{
          type: "FeatureCollection",
          features: [sectorPolygon],
        },
      },
      layout:{
        visibility:setting.人影.监控.北京保障圈?'visible':'none'
      },
      paint: {
        "line-color": "rgb(255,0,0)",
        "line-width": 1,
        // "line-dasharray": [1, 1],
      },
    });

    radius = 180*1000; // 半径（单位：米
    steps = 360; // 用于生成圆弧的步数，越大越平滑
    units = "meters"; // 半径的单位
    sectorPoints = calculateCirclePoints(
      center,
      radius,
      steps,
      units
    );
    sectorPolygon = turf.polygon([sectorPoints], {});
    map.addLayer({
      id: "line3",
      type: "line",
      source: {
        type:'geojson',
        data:{
          type: "FeatureCollection",
          features: [sectorPolygon],
        },
      },
      layout:{
        visibility:setting.人影.监控.北京保障圈?'visible':'none'
      },
      paint: {
        "line-color": "rgb(70,108,135)",
        "line-width": 1,
        // "line-dasharray": [1, 1],
      },
    });

    radius = 360*1000; // 半径（单位：米
    steps = 360; // 用于生成圆弧的步数，越大越平滑
    units = "meters"; // 半径的单位
    sectorPoints = calculateCirclePoints(
      center,
      radius,
      steps,
      units
    );
    sectorPolygon = turf.polygon([sectorPoints], {});
    map.addLayer({
      id: "line4",
      type: "line",
      source: {
        type:'geojson',
        data:{
          type: "FeatureCollection",
          features: [sectorPolygon],
        },
      },
      layout:{
        visibility:setting.人影.监控.北京保障圈?'visible':'none'
      },
      paint: {
        "line-color": "rgb(58,130,0)",
        "line-width": 1,
        // "line-dasharray": [1, 1],
      },
    });




    for(let i=0;i<8;i++){
      const bearing = 45*i;
      const distance = 360;
      const startPoint = turf.point(center);
      const endPoint = turf.destination(startPoint, distance, bearing, { units: 'kilometers' });
      map.addLayer({
        id: 'line-layer'+i,
        type: 'line',
        source: {
          type:'geojson',
          data:{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                center,
                endPoint.geometry.coordinates
              ]
            },
            properties: {}
          }
        },
        layout: {
          visibility:setting.人影.监控.北京保障圈?'visible':'none',
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'rgb(255,0,0)',
          'line-width': 1
        }
      });
    }










    adsbTimer = setInterval(()=>{
      setting.人影.监控.adsb && ADSB().then(res=>{
        处理ADSB(res.data)
      }).catch(e=>{
        // console.log(e)
      })
    },5000)
    setting.人影.监控.adsb && ADSB().then(res=>{
      处理ADSB(res.data)
    }).catch(e=>{
      // console.log(e)
    })
    if(!draw){
      draw = new MapboxDraw({
        displayControlsDefault: false,
        modes:{...MapboxDraw.modes,
          no_select:{
            ...MapboxDraw.modes.simple_select,
            onClick:()=>{},
            onMouseMove(state, e) {},
          },
          custom_draw_line_with_distance
        },
        styles,
        defaultMode: 'no_select',
      })
      map.addControl(draw)
    }
    const image = new Image()
    image.onload = ()=>{
      if(!map)return
      map.addImage('pop',image,{ sdf: true })
    }
    image.src = popSvg

    const img = new Image()
    img.onload = ()=>{
      if(!map)return
      map.addImage('MYJC',img)
    }
    img.src = MYJCurl



    const img2 = new Image()
    img2.onload = ()=>{
      if(!map)return
      map.addImage('JYJC',img2)
    }
    img2.src = JYJCurl

    map.removeImage('airport');
    await loadImage2Map(map,stoveUrl,36,36,{
      stove:{
        style: 'fill:#fa0;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      },
      stoveBurning:{
        style: 'fill:#f00;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      }
    })
    await loadImage2Map(map,banSvg,16,16,{
      airport:{
        style: 'fill:#0f0;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      }
    })
    // await loadImage2Map(map,adsbSvg,16,16,{
    //   adsb:{
    //     style: 'fill:#0f0;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
    //   }
    // })
    await loadImage2Map(map,planeUrl,24,24,{
      airplane:{
        style: 'opacity:1.0;fill:yellow;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      },
      airplaneMock:{
        style: 'fill:#0f0;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      },
    })
    await loadImage2Map(map,trackSvg,6,6,{
      'trackSvg':{
        style:"fill:#0f0;stroke:black;stroke-width:50px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      }
    })
    await loadImage2Map(map,adsbUrl,22,22,{
      'adsb':{
        style:"fill:orange;stroke:#000;stroke-width:1px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      }
      // fill="#1296db"
    })
    await loadImage2Map(map,circleUrl,24,24,{
      'projectile-white':{
        style:"fill:#fff;stroke:black;stroke-width:2px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
      // 'projectile-red':{
      //   style:"fill:#E14D27;stroke:black;stroke-width:2px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      // },
      'projectile-blue':{
        style:"fill:#fff;stroke:black;stroke-width:2px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
      'projectile-orange':{
        style:"fill:#fff;stroke:#000;stroke-width:2px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
      'projectile-test':{
        style:"fill:#fff;stroke:#000;stroke-width:2px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
    })
    await loadImage2Map(map,triangleUrl,24,24,{
      'triangle-blue':{
        style:"fill:#fff;stroke:black;stroke-width:2px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
    })
    await loadImage2Map(map,导航台图标,14,14,{
      导航台图标:{
        style:'fill:white;stroke:black;stroke-width:1px',
      }
    })
    await loadImage2Map(map,火箭弹图标,32,32,{
      火箭弹图标:{
        style:"fill:white;stroke:black;stroke-width:30px;",
      }
    })
    await loadImage2Map(map,高炮图标,32,32,{
      高炮图标:{style:"fill:white;stroke:black;stroke-width:20px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;"}
    })
    await addFeatherImages(map);
    /*
    axios({
      method: 'get',
      url: 'https://data.tanglei.top/华北飞行区域.map',
      responseType: 'arraybuffer',
    }).then(res=>{
      let view = new View(res.data,true);
      type S_SimpleRegionSymbol = {
        Line:S_SimpleLineSymbol,//面边线
        FillColor:S_Color,//面填充颜色
        iStyle:number,//1字节，0不填充，1填充
      }
      type S_RegionUnit = {
        iID:number,//4字节
        UnitName:string,//10字节,图元名称
        LinePos:S_LinePos,
        RegionSymbol:S_SimpleRegionSymbol,
        TextSymbol:S_TextSymbol,
        sShow:number,//1字节，0都不显示，1仅显示图元，2仅显示标注，3都显示
      }
      type S_LinePoint = {
        PointPos:S_PointPos,
        sPointType:number,//1字节,(1-普通线，2-圆弧（后续四点在pLinePoint中依次存放:圆弧外包矩形的左上角点，右下角点；圆弧的起始点，终止点）)
        TextSymbol:S_TextSymbol,
      }
      type S_PointPos={
        dLong:number,//8字节
        dLat:number,//8字节
        x:number,//4字节
        y:number,//4字节
      }
      type S_Color={
        sRed:number,//1字节
        sGreen:number,//1字节
        sBlue:number,//1字节
        sTransperancy:number,//1字节,透明度
      }
      type S_Font = {
        szFontName:string//32字节，字体名称
        sFontSize:number//2字节,字体大小
        sFontBold:number//2字节,字体磅值
        sStyle:number//1字节,[1-1-000000]表示[斜体-下划线-000000]
      }
      type S_SimplePointSymbol={
        sSymbolType:number,//1字节，点符号类型（如Truetype字体,位图等）
        Angle:number,//2字节,角度
        Color:S_Color,
        Font:S_Font,
        iFontIndex:number,//2字节,字号
        szBitMap:string,//128字节，位图文件名
        iBitMapX:number,//2字节
        iBitMapY:number,//2字节
      }
      type S_TextSymbol = {
        Angle:number,//2字节
        Color:S_Color,
        Font:S_Font,
        AlignmentStyle:number,//1字节，文字横排风格，文字竖排风格，文字是否从右写到左
        iTextSize:number,//2字节，文本长度
        szText:string,//128字节，文本
        sTextPos:number,//1字节，标注位置
        fLong:number,//4字节，文本显示位置经度
        fLat:number,//4字节，文本显示位置纬度
      }
      type S_PointUnit ={
        iID:number,//4字节
        unitName:string,//10字节，图元名称
        Pos:S_PointPos,
        PointSymbol:S_SimplePointSymbol,
        TextSymbol:S_TextSymbol,
        sShow:number,//1字节，0都不显示，1仅显示图元，2仅显示标注，3都显示
      }
      type S_LinePos = {
        iPointNum:number,//4字节，点数目
        reserve:number,//4字节,保留，取代原S_LinePoint指针,指针在64位时长度变为8，导致程序编译为64位时无法正常读取地图文件
      }
      type S_SimpleLineSymbol = {
        Color:S_Color,
        sStyle:number,//1字节，线型[0000000-1|0]表示[0000000-虚线|实线]
        iWidth:number,//2字节
      }
      type S_LineUnit = {
        iID:number,//4字节，图元ID
        UnitName:string,//10字节,图元名称
        LinePos:S_LinePos,//线的空间属性
        LineSymbol:S_SimpleLineSymbol,//线符号
        TextSymbol:S_TextSymbol,//线标注
        sShow:number,//1字节，0都不显示，1仅显示图元，2仅显示标注，3都显示
      }


      let result = {
        filehead:{
          iLayerNum: view.getInt32(), //文件中包含的图层数。（建议一个图层一个文件，iLayerNum=1）int
          szReserved: view.getBytes(512), //保留字段。char[]
        },
        tagLayerPara:{
          iLayerID: view.getInt32(), //图层ID。int
          szLayerName: view.getBytes(128), //图层名称。char[]
          sLayerType: view.getUint16(),  //图层类型。（1-点、2-线、3-面、其他）short
          iLayerNotesLen: view.getInt32(),		//图层附加属性长度。int
          iUnitCount: view.getInt32(),  //图元个数。int
          iUnitNotesLen: view.getInt32(),	//图元附加属性长度。int
          iMapLevel: view.getInt32(),  //本图层所属层数。int
          dMaximumScale: view.getFloat64(),  // double
          dMinimumScale: view.getFloat64(),  //当Map Scale介于dMinimumScale和dMaximumScale之间时，才显示本图层。double
          bScaleSymbols: view.getUint8(),  //图层中的Symbol是否随图层放大而放大、随图层缩小而缩小。bool
          bVisible: view.getUint16(),  //图层是否显示。（1-全显示、2-部分显示、3-不显示）bool
          bShowLable: view.getUint16(),  //图元标注显示与否。（1-全显示、2-部分显示、3-不显示）bool
          layerTips:{ //图层标注（预留）。
            x:view.getFloat64(),double
            y:view.getFloat64(), //(x,y)指定标注位置。double
            szTips:view.getBytes(128), //标注文本 char[]
            bShowTips: view.getUint8() //是否显示图层标注 bool
          },
          spatialReference:{ //投影方式（预留）。
            iProjectMethod: view.getInt32(), //投影方式（1－正圆锥投影、）int
            dOrgLong: view.getFloat64(),		//投影坐标系坐标原点经度。/度 double
            dOrgLat: view.getFloat64(),			//投影坐标系坐标原点纬度。/度 double
            iOrgHeight: view.getInt32(),		//投影坐标系坐标原点高度。/米 int
            szReserved:view.getBytes(512),	//预留。 char[]
          },
          layerSource:{ //图层数据源，（预留）。
            sDataType:view.getUint16(),  //数据源类型（0―无源(可能是动态创建的)，1―文件，2―数据库）short
            DataSource:view.getBytes(128), //数据源。（*.gis）char[]
            szReserved:view.getBytes(128), //保留 char[]
            iReserved:view.getInt32()  //保留 int
          },
          layerEffects:{ //图层显示效果，（预留）。
            Brightness: view.getUint8(),  //明亮度（0～100）unsigned char
            Constrast: view.getUint8(),  //对比度（0～100）unsigned char
            Tranceparency: view.getUint8(),  //透明度（0～100）unsigned char
            bSupportsBrightnessChange: view.getUint8(),  //是否支持明亮度变化 bool
            bSupportsConstrastChange: view.getUint8(),  //是否支持对比度变化 bool
            bSupportsTranceparency: view.getUint8(),  //是否支持透明度 bool
            bSupportsInteractive: view.getUint8(),    //Indicates if the layer supports interactive effects changes bool
          }
        },
      }
      switch (result.tagLayerPara.sLayerType){
        // case GISTYPE.GIS_POINT:
        // case GISTYPE.GIS_POINT2:
        //   layerPara.m_cLayerType = GIS_POINT;
        //   bReadUnitOK = ReadPointLayer(rfile, pLayer, layerPara);
        //   break;
        // case GISTYPE.GIS_LINE:
        case GISTYPE.GIS_LINE2://如岛屿
          // layerPara.m_cLayerType = GIS_LINE;
          // bReadUnitOK = ReadLineLayer(rfile, pLayer, layerPara);
          console.log(view.getInt32())
          break;
        case GISTYPE.GIS_REGION:
        case GISTYPE.GIS_REGION2:
        //   layerPara.m_cLayerType = GIS_REGION;
        //   bReadUnitOK = ReadRegionLayer(rfile, pLayer, layerPara);
          const line:S_LineUnit = {
            iID:view.getInt32(),
            UnitName: d.decode(view.getBytes(10)),
            LinePos:{
              iPointNum:view.getInt32(),
              reserve:view.getInt32(),
            },
            LineSymbol:{
              Color:{
                sRed:view.getUint8(),//1字节
                sGreen:view.getUint8(),//1字节
                sBlue:view.getUint8(),//1字节
                sTransperancy:view.getUint8(),//1字节,透明度
              },
              sStyle:view.getUint8(),
              iWidth:view.getUint16(),//2字节
            },
            TextSymbol:{
              Angle:view.getInt32(),//2字节
              Color:{
                sRed:view.getUint8(),//1字节
                sGreen:view.getUint8(),//1字节
                sBlue:view.getUint8(),//1字节
                sTransperancy:view.getUint8(),//1字节,透明度
              },
              Font:{
                szFontName:d.decode(view.getBytes(32)),//32字节，字体名称
                sFontSize:view.getUint16(),//2字节,字体大小
                sFontBold:view.getUint16(),//2字节,字体磅值
                sStyle:view.getUint8()//1字节,[1-1-000000]表示[斜体-下划线-000000]
              },
              AlignmentStyle:view.getUint8(),//1字节，文字横排风格，文字竖排风格，文字是否从右写到左
              iTextSize:view.getUint16(),//2字节，文本长度
              szText:d.decode(view.getBytes(128)),//128字节，文本
              sTextPos:view.getUint8(),//1字节，标注位置
              fLong:view.getFloat32(),//4字节，文本显示位置经度
              fLat:view.getFloat32(),//4字节，文本显示位置纬度
            },
            sShow:view.getUint8()
          }
          console.log(line)
          // for(let i=0;i<result.tagLayerPara.iUnitCount;i++){
          //   let plane:S_RegionUnit = {
          //     iID:view.getInt32(),
          //     UnitName:d.decode(view.getBytes(10)),
          //     LinePos:{
          //       iPointNum:view.getInt32(),
          //       reserve:view.getInt32(),
          //     },
          //     RegionSymbol:{
          //       Line:{
          //         Color:{
          //           sRed:view.getUint8(),//1字节
          //           sGreen:view.getUint8(),//1字节
          //           sBlue:view.getUint8(),//1字节
          //           sTransperancy:view.getUint8(),//1字节,透明度
          //         },
          //         sStyle:view.getUint8(),//1字节，线型[0000000-1|0]表示[0000000-虚线|实线]
          //         iWidth:view.getInt32(),//2字节
          //       },//面边线
          //       FillColor:{
          //         sRed:view.getUint8(),//1字节
          //         sGreen:view.getUint8(),//1字节
          //         sBlue:view.getUint8(),//1字节
          //         sTransperancy:view.getUint8(),//1字节,透明度
          //       },//面填充颜色
          //       iStyle:view.getUint8(),//1字节，0不填充，1填充
          //     },
          //     TextSymbol:{
          //       Angle:view.getInt32(),//2字节
          //       Color:{
          //         sRed:view.getUint8(),//1字节
          //         sGreen:view.getUint8(),//1字节
          //         sBlue:view.getUint8(),//1字节
          //         sTransperancy:view.getUint8(),//1字节,透明度
          //       },
          //       Font:{
          //         szFontName:d.decode(view.getBytes(32)),//32字节，字体名称
          //         sFontSize:view.getUint16(),//2字节,字体大小
          //         sFontBold:view.getUint16(),//2字节,字体磅值
          //         sStyle:view.getUint8(),//1字节,[1-1-000000]表示[斜体-下划线-000000]
          //       },
          //       AlignmentStyle:view.getUint8(),//1字节，文字横排风格，文字竖排风格，文字是否从右写到左
          //       iTextSize:view.getUint16(),//2字节，文本长度
          //       szText:d.decode(view.getBytes(128)),//128字节，文本
          //       sTextPos:view.getUint8(),//1字节，标注位置
          //       fLong:view.getFloat32(),//4字节，文本显示位置经度
          //       fLat:view.getFloat32(),//4字节，文本显示位置纬度
          //     },
          //     sShow:view.getUint8()
          //   }
          //   console.log(plane)
          //   break;
          // }
          break;
        case GISTYPE.GIS_AIRLINE:
          // layerPara.m_cLayerType = GIS_AIRLINE;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          console.log(view.getBytes(view.getInt32()))
          break;
        case GISTYPE.GIS_AIRMAPPOINT:
          // layerPara.m_cLayerType = GIS_AIRMAPPOINT;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          let iDataLen = view.getInt32()
          if(iDataLen<=0){
            return;
          }
          let utf8Decoder = new TextDecoder('utf8')
          let tagPara = {
            m_clearType:view.getUint16(),
            m_strLayerName:utf8Decoder.decode(view.getBytes(view.getUint16())),
            iUnitNum:view.getInt32(),
          }
          let vecUnit = []
          for(let i=0;i<tagPara.iUnitNum;i++){//tagPara.iUnitNum
            let pUnit = {
              iID: view.getInt32(),//图元ID
              strCode: utf8Decoder.decode(view.getBytes(view.getUint16())),//图元名称
              tagRGB:{///图元颜色
                sBlue: view.getUint8(),
                sGreen: view.getUint8(),
                sRed: view.getUint8(),
              },
              tagText:{///标注信息
                strText:utf8Decoder.decode(view.getBytes(view.getUint16())),//标注内容
                tagPos:{//标注位置
                  dLong:view.getFloat64(),//Longitude 经度
                  dLat:view.getFloat64(),//Latitude	纬度
                  dHeight:view.getFloat64(),//Height 海拔高度 米
                },
              },
              ubyType:view.getUint8(),///类型，0未知，1点，2线，3面
              ubyShow:view.getUint8(),///是否显示
              ubyLevel:view.getUint8(),///图元等级
              tagPos:{//点的空间属性
                dLong:view.getFloat64(),//Longitude 经度
                dLat:view.getFloat64(),//Latitude	纬度
                dHeight:view.getFloat64(),//Height 海拔高度 米
              },
              ubyPointStyle:view.getUint8(),///点的形状
              ubyDataType:view.getUint8(),///地标类型，
              ubyAirLinePt:view.getUint8(),///航线航路过点
            }
            // MinLng = MinLng<pUnit.tagPos.dLong?MinLng:pUnit.tagPos.dLong
            // MinLat = MinLat<pUnit.tagPos.dLat?MinLat:pUnit.tagPos.dLat
            // MaxLng = MinLng<pUnit.tagPos.dLong?MinLng:pUnit.tagPos.dLong
            // MaxLat = MinLat<pUnit.tagPos.dLat?MinLng:pUnit.tagPos.dLat
            vecUnit.push(pUnit)
          }
          // UNITS = vecUnit
          // loadStatus = 'loaded'
          // test(args);//第一次使用后台返回的数据
          // for(let i=0;i<queue.length;i++){
          //   let args = queue.splice(i--,1)[0]
          //   test(args)
          // }
          break;
        case GISTYPE.GIS_DATA_POINT:
        case GISTYPE.GIS_DATA_LINE://如飞行管制分区
        case GISTYPE.GIS_DATA_REGION://如禁区
        //   layerPara.m_cLayerType = tagLayerPara.sLayerType;
        //   bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          break;
        default:
          throw new Error('Unknow GISTYPE: '+result.tagLayerPara.sLayerType)
      }
    })
    */
    function calculatePolygonCentroid(vertices:Array<[number,number]>) {
      let area = 0;
      let Cx = 0;
      let Cy = 0;
      const n = vertices.length;
      for (let i = 0; i < n; i++) {
        const x1 = vertices[i][0];
        const y1 = vertices[i][1];
        const x2 = vertices[(i + 1) % n][0];
        const y2 = vertices[(i + 1) % n][1];

        const crossProduct = (x1 * y2) - (x2 * y1);
        area += crossProduct;
        Cx += (x1 + x2) * crossProduct;
        Cy += (y1 + y2) * crossProduct;
      }

      area /= 2;
      Cx = Cx / (6 * area);
      Cy = Cy / (6 * area);
      return { x: Cx, y: Cy };
    }
    await 华北飞行区域().then((res)=>{
      if(!map)return;
      let areas:any[] = []
      let features:any[] = []
      for(let i=0;i<res.data.results.length;i++){
        let item = res.data.results[i]
        let strPoints = item.points
        let points = strPoints.split(' ').map(item=>{
          let lngLat = fromDMS(item)
          return wgs84togcj02(lngLat[0],lngLat[1])
        }) as Array<[number,number]>
        let centroid = calculatePolygonCentroid(points)
        features.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [centroid.x,centroid.y]
          },
          'properties': {
            'label': item.name,
          }
        })
        areas.push([points])
      }
      map?.addLayer({
        id: "华北飞行区域area",
        type: "fill",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: areas
            },
          },
        },
        layout: {
          visibility: setting.人影.监控.ryAirspaces.fill ? "visible" : "none",
        },
        paint: {
          "fill-color": `rgba(${setting.人影.监控.ryAirspaces.fillColor.r},${setting.人影.监控.ryAirspaces.fillColor.g},${setting.人影.监控.ryAirspaces.fillColor.b},${setting.人影.监控.ryAirspaces.fillColor.a})`,
          "fill-outline-color":'transparent',
          "fill-opacity":setting.人影.监控.ryAirspaces.fillOpacity,
        },
      });
      map.addLayer({
        id: "华北飞行区域baseLine",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: areas
            },
          },
        },
        layout: {
          visibility: setting.人影.监控.ryAirspaces.base ? "visible" : "none",
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          "line-color": `rgba(${setting.人影.监控.ryAirspaces.baseColor.r},${setting.人影.监控.ryAirspaces.baseColor.g},${setting.人影.监控.ryAirspaces.baseColor.b},${setting.人影.监控.ryAirspaces.baseColor.a})`,
          "line-width": setting.人影.监控.ryAirspaces.baseWidth,
          "line-opacity": setting.人影.监控.ryAirspaces.baseOpacity,
        },
      });
      map.addLayer({
        id: "华北飞行区域line",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: areas
            },
          },
        },
        layout: {
          visibility: setting.人影.监控.ryAirspaces.line ? "visible" : "none",
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          "line-color": `rgba(${setting.人影.监控.ryAirspaces.lineColor.r},${setting.人影.监控.ryAirspaces.lineColor.g},${setting.人影.监控.ryAirspaces.lineColor.b},${setting.人影.监控.ryAirspaces.lineColor.a})`,
          "line-width": setting.人影.监控.ryAirspaces.lineWidth,
          "line-opacity": setting.人影.监控.ryAirspaces.lineOpacity,
        },
      });
      map.addLayer({
        id: "华北飞行区域标签",
        type: "symbol",
        source:  {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features':features
          }
        },
        layout: {
          visibility: setting.人影.监控.ryAirspaces.label ? "visible" : "none",
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          "text-pitch-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-field": ["get", "label"],
          "text-font": ["simkai"],
          "text-size": 25,
          "text-transform": "uppercase",
          // "text-letter-spacing": 0.05,
          "text-anchor": "center",
          "text-line-height": 1,
          "text-justify": "center",
          "text-offset": [0, 0],
          "text-ignore-placement": true,
          "text-allow-overlap": true,
          "text-rotation-alignment": "map",
          "text-max-width": 400,
        },
        paint: {
          "text-opacity": setting.人影.监控.ryAirspaces.labelOpacity,
          "text-color": `rgba(${setting.人影.监控.ryAirspaces.labelColor.r},${setting.人影.监控.ryAirspaces.labelColor.g},${setting.人影.监控.ryAirspaces.labelColor.b},${setting.人影.监控.ryAirspaces.labelColor.a})`,
          "text-halo-color": "black",
          "text-halo-width": 0.1,
        }
      });
    })
    await axios({
      method:'get',
      url:'/kysq/resources/导航台.map',
      responseType: 'arraybuffer',
    }).then(async(res)=>{
      if(!map)return;
      let view = new View(res.data,true);
      let result = {
        filehead:{
          iLayerNum: view.getInt32(), //文件中包含的图层数。（建议一个图层一个文件，iLayerNum=1）/*int*/
          szReserved: view.getBytes(512), //保留字段。/*char[]*/
        },
        tagLayerPara:{
          iLayerID: view.getInt32(), //图层ID。/*int*/
          szLayerName: view.getBytes(128), //图层名称。/*char[]*/
          sLayerType: view.getInt16(),  //图层类型。（1-点、2-线、3-面、其他）/*short*/
          iLayerNotesLen: view.getInt32(),		//图层附加属性长度。/*int*/
          iUnitCount: view.getInt32(),  //图元个数。/*int*/
          iUnitNotesLen: view.getInt32(),	//图元附加属性长度。/*int*/
          iMapLevel: view.getInt32(),  //本图层所属层数。/*int*/
          dMaximumScale: view.getFloat64(),  // /*double*/
          dMinimumScale: view.getFloat64(),  //当Map Scale介于dMinimumScale和dMaximumScale之间时，才显示本图层。/*double*/
          bScaleSymbols: view.getUint8(),  //图层中的Symbol是否随图层放大而放大、随图层缩小而缩小。/*bool*/
          bVisible: view.getInt16(),  //图层是否显示。（1-全显示、2-部分显示、3-不显示）/*bool*/
          bShowLable: view.getInt16(),  //图元标注显示与否。（1-全显示、2-部分显示、3-不显示）/*bool*/
          layerTips:{ //图层标注（预留）。
            x:view.getFloat64(),/*double*/
            y:view.getFloat64(), //(x,y)指定标注位置。/*double*/
            szTips:view.getBytes(128), //标注文本 /*char[]*/
            bShowTips: view.getUint8() //是否显示图层标注 /*bool*/
          },
          spatialReference:{ //投影方式（预留）。
            iProjectMethod: view.getInt32(), //投影方式（1－正圆锥投影、）/*int*/
            dOrgLong: view.getFloat64(),		//投影坐标系坐标原点经度。/度 /*double*/
            dOrgLat: view.getFloat64(),			//投影坐标系坐标原点纬度。/度 /*double*/
            iOrgHeight: view.getInt32(),		//投影坐标系坐标原点高度。/米 /*int*/
            szReserved:view.getBytes(512),	//预留。 /*char[]*/
          },
          layerSource:{ //图层数据源，（预留）。
            sDataType:view.getInt16(),  //数据源类型（0―无源(可能是动态创建的)，1―文件，2―数据库）/*short*/
            DataSource:view.getBytes(128), //数据源。（*.gis）/*char[]*/
            szReserved:view.getBytes(128), //保留 /*char[]*/
            iReserved:view.getInt32()  //保留 /*int*/
          },
          layerEffects:{ //图层显示效果，（预留）。
            Brightness: view.getUint8(),  //明亮度（0～100）/*unsigned char*/
            Constrast: view.getUint8(),  //对比度（0～100）/*unsigned char*/
            Tranceparency: view.getUint8(),  //透明度（0～100）/*unsigned char*/
            bSupportsBrightnessChange: view.getUint8(),  //是否支持明亮度变化 /*bool*/
            bSupportsConstrastChange: view.getUint8(),  //是否支持对比度变化 /*bool*/
            bSupportsTranceparency: view.getUint8(),  //是否支持透明度 /*bool*/
            bSupportsInteractive: view.getUint8(),    //Indicates if the layer supports interactive effects changes /*bool*/
          }
        },
      }
      switch (result.tagLayerPara.sLayerType){
        // case GISTYPE.GIS_POINT:
        // case GISTYPE.GIS_POINT2:
        //   layerPara.m_cLayerType = GIS_POINT;
        //   bReadUnitOK = ReadPointLayer(rfile, pLayer, layerPara);
        //   break;
        // case GISTYPE.GIS_LINE:
        case GISTYPE.GIS_LINE2://如岛屿
          // layerPara.m_cLayerType = GIS_LINE;
          // bReadUnitOK = ReadLineLayer(rfile, pLayer, layerPara);
          console.log(view.getInt32())
          break;
        // case GISTYPE.GIS_REGION:
        // case GISTYPE.GIS_REGION2:
        //   layerPara.m_cLayerType = GIS_REGION;
        //   bReadUnitOK = ReadRegionLayer(rfile, pLayer, layerPara);
        //   break;
        case GISTYPE.GIS_AIRLINE:
          // layerPara.m_cLayerType = GIS_AIRLINE;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          console.log(view.getBytes(view.getInt32()))
          break;
        case GISTYPE.GIS_AIRMAPPOINT:
          // layerPara.m_cLayerType = GIS_AIRMAPPOINT;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          let iDataLen = view.getInt32()
          if(iDataLen<=0){
            return;
          }
          let utf8Decoder = new TextDecoder('utf8')
          let tagPara = {
            m_clearType:view.getInt16(),
            m_strLayerName:utf8Decoder.decode(view.getBytes(view.getUint16())),
            iUnitNum:view.getInt32(),
          }
          let vecUnit:any[] = []
          for(let i=0;i<tagPara.iUnitNum;i++){//tagPara.iUnitNum
            let pUnit = {
              iID: view.getInt32(),//图元ID
              strCode: utf8Decoder.decode(view.getBytes(view.getUint16())),//图元名称
              tagRGB:{///图元颜色
                sBlue: view.getUint8(),
                sGreen: view.getUint8(),
                sRed: view.getUint8(),
              },
              tagText:{///标注信息
                strText:utf8Decoder.decode(view.getBytes(view.getUint16())),//标注内容
                tagPos:{//标注位置
                  dLong:view.getFloat64(),//Longitude 经度
                  dLat:view.getFloat64(),//Latitude	纬度
                  dHeight:view.getFloat64(),//Height 海拔高度 米
                },
              },
              ubyType:view.getUint8(),///类型，0未知，1点，2线，3面
              ubyShow:view.getUint8(),///是否显示
              ubyLevel:view.getUint8(),///图元等级
              tagPos:{//点的空间属性
                dLong:view.getFloat64(),//Longitude 经度
                dLat:view.getFloat64(),//Latitude	纬度
                dHeight:view.getFloat64(),//Height 海拔高度 米
              },
              ubyPointStyle:view.getUint8(),///点的形状
              ubyDataType:view.getUint8(),///地标类型，
              ubyAirLinePt:view.getUint8(),///航线航路过点
            }
            vecUnit.push(pUnit)
          }
          for(let i=0;i<vecUnit.length;i++){
            zydFeaturesData.features.push({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': wgs84togcj02(vecUnit[i].tagPos.dLong,vecUnit[i].tagPos.dLat),
              },
              'properties': {
                'name': vecUnit[i].tagText.strText,
              }
            })
          }
          map.addLayer({
            id: "导航台图层",
            type: "symbol",
            source:  {
            'type': 'geojson',
            'data': zydFeaturesData
            },
            layout: {
              visibility: setting.人影.监控.navigationStation ? "visible" : "none",
              // This icon is a part of the Mapbox Streets style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              "icon-image":'导航台图标',
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "icon-pitch-alignment": "map",
              "icon-rotation-alignment":"map",
              "text-field": ["get", "name"],
              "text-font": ["simkai"],
              "text-size": 12,
              "text-transform": "uppercase",
              // "text-letter-spacing": 0.05,】,
              "text-line-height": 1,
              'text-anchor': 'bottom', // 水平垂直居中
              'text-offset': [0, -1], // 调整文本偏移量
              'text-justify': 'center', // 水平居中对齐
              "text-ignore-placement": true,
              "text-allow-overlap": true,
              "text-pitch-alignment": "map",
              "text-rotation-alignment": "map",
              // "text-max-width": 400,
            },
            paint: {
              "icon-opacity": 1,
              "text-color": "white",
              "text-halo-color": "black",
              "text-halo-width": 1,
            }
          });


          break;
        case GISTYPE.GIS_DATA_POINT:
        case GISTYPE.GIS_DATA_LINE://如飞行管制分区
        case GISTYPE.GIS_DATA_REGION://如禁区
        //   layerPara.m_cLayerType = tagLayerPara.sLayerType;
        //   bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          break;
        default:
          throw new Error('Unknow GISTYPE: '+result.tagLayerPara.sLayerType)
      }
    })
    if(!map)return;
    // 模拟飞机
    // for (let i = 0; i < 60; i++) {
    //   airplanesMockData.features.push({
    //     type: "Feature",
    //     properties: {
    //       name: "Example Point",
    //       fHeading: 360 * Math.random(),
    //       speed: ((800 + 200 * Math.random()) / 3.6 / 1000) * 33,
    //     },
    //     geometry: {
    //       type: "Point",
    //       coordinates: [115 + 3 * Math.random(), 36 + 3 * Math.random()],
    //       // coordinates: [0, 0],
    //     },
    //   });
    // }

    map.addLayer({
      id: "maine",
      type: "fill",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: airstrip,
          },
        },
      },
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.4,
      },
    });
    var marker = new Marker({
      element: stationMenuRef.value,
      draggable: false,
      // pitchAlignment: "map",
      // rotationAlignment: "map",
      anchor: "top-left",
    })
      .setLngLat([0, 0])
      .setOffset([0, 0])
      .addTo(map);
    const contextmenuFunc = (e: any) => {
      if(!e.handled){
        e.originalEvent.stopPropagation()
        e.originalEvent.preventDefault();
        const layers = map.getStyle().layers.filter(layer => layer.id.startsWith('gl-draw')).map(layer=>layer.id)
        const fs = map.queryRenderedFeatures(e.point, { layers });
        if(fs.length>0){
          marker.setLngLat([e.lngLat.lng,e.lngLat.lat]);
          $(stationMenuRef.value as HTMLDivElement).css({display:'block'});
          menuType.value = '批量操作'
          // $(stationMenu).removeData();
          // $(stationMenu).data(feature.properties);
        }
      }
    }
    // getTodayRecords().then((res:any)=>{
    //   planProps.今日作业记录 = res.data.data;
    // })
    if(!map.getSource("最大射程source")){
      map.addSource("最大射程source", {
        type: "geojson",
        data: circleFeaturesData,
        promoteId:'strID'
      });
    }

    if(!map.getSource("警戒圈source")){
      map.addSource("警戒圈source", {
        type: "geojson",
        data: forewarningFeaturesData,
        promoteId:'strID'
      });
    }
    await 作业点().then(async(res) => {
      if(!map)
        return
      作业点原始数据 = res.data.results;
      dialogOptions.menus = JSON.parse(JSON.stringify(作业点原始数据))
      zydFeaturesData.features.length = 0
      forewarningFeaturesData.features.length = 0;
      circleFeaturesData.features.length = 0;
      for(let i=0;i<dialogOptions.menus.length;i++){
        const item = dialogOptions.menus[i] as stationData
        if(!item.tags){
          item.tags = []
        }
        if(item.iType){
          if(!item.tags.includes('移动作业点')){
            item.tags.push('移动作业点')
          }
        }else{
          if(!item.tags.includes('固定作业点')){
            item.tags.push('固定作业点')
          }
        }
        if(item.iShortAngelBegin==null){
          item.iShortAngelBegin = 0
        }
        if (item.strPos) {
          // let position = (wgs84togcj02(...fromDMS(item.strPos)) as unknown) as [number, number]
          let position = (wgs84togcj02(...fromDMS(item.strPos)) as unknown) as [number, number]
          zydFeaturesData.features.push({
            type: "Feature",
            properties: {
              strID: item.strID,
              type: "站点",
              strCode: item.strCode,
              strName: item.strName,
              strPos: item.strPos,
              iMaxShotRange: item.iMaxShotRange,
              iMaxShotHei: item.iMaxShotHei,
              iWeapon: Number(item.strWeapon),
              iWorkType: 1,
              iShotRangeBegin: item.iShortAngelBegin,
              iShotRangeEnd: item.iShortAngelEnd,
              beginTime: moment().format("HH:mm:ss"),
              unitName: item.unitName,
              duration: 1,
              "icon-image": item.iType == 1 ? "triangle-blue" : "projectile-blue",
              // "icon-image": "火箭弹图标",
              发报单位:'360000000',
              delayTimeLen:10,
              beginDirection:270,
              endDirection:80,
              workTimeLen:1,
              workBeginTime:moment().format('HH:mm:ss'),
              denyCode:0,
              strMgrUnitName:item.strMgrUnitName,
              tags:item.tags,
              tag:setting.人影.监控.zydTag
            },
            geometry: {
              type: "Point",
              coordinates: position,
            },
          });
          // 有问题
          // let circle: any = Circle(wgs84togcj02(...fromDMS(item.strPos)), item.iMaxShotRange, {
          //   steps: 360,
          //   units: "meters",
          //   properties: {
          //     id: item.strID,
          //     color: "white",
          //   },
          // });
          // circleFeaturesData.features.push(circle);
          if (item.iShortAngelEnd - item.iShortAngelBegin >= 360) {
            const center: [number, number] = wgs84togcj02(...fromDMS(item.strPos)) as [
              number,
              number
            ]; // 圆心点的经纬度
            const radius: number = item.iMaxShotRange; // 半径（单位：米
            const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
            const units: turf.Units = "meters"; // 半径的单位
            const sectorPoints: [number, number][] = calculateCirclePoints(
              center,
              radius,
              steps,
              units
            );
            const sectorPolygon = turf.polygon([sectorPoints], {
              strID: item.strID,
              tags:item.tags,
              tag:setting.人影.监控.zydTag,
            });
            map.setFeatureState({source:'最大射程source',id:item.strID},{
              ubyStatus:'空闲',
              opacity:0,
            })
            circleFeaturesData.features.push(sectorPolygon);
          } else {
            const center: [number, number] = wgs84togcj02(...fromDMS(item.strPos)) as [
              number,
              number
            ]; // 圆心点的经纬度
            const radius: number = item.iMaxShotRange; // 半径（单位：米
            const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
            const startAngle: number = item.iShortAngelBegin; // 起始角度（单位：度）
            const endAngle: number =
              item.iShortAngelEnd > startAngle
                ? item.iShortAngelEnd
                : item.iShortAngelEnd + 360; // 终止角度（单位：度）
            const units: turf.Units = "meters"; // 半径的单位
            const sectorPoints: [number, number][] = calculateSectorPoints(
              center,
              radius,
              startAngle,
              endAngle,
              steps,
              units
            );
            const sectorPolygon = turf.polygon([sectorPoints], {
              strID: item.strID,
              tags:item.tags,
              tag:setting.人影.监控.zydTag,
            });
            map.setFeatureState({source:'最大射程source',id:item.strID},{
              ubyStatus:'空闲',
              opacity:0,
            })
            sectorPolygon.id = '空域'+item.strID
            circleFeaturesData.features.push(sectorPolygon);
          }
          //加入警戒圈
          const center: [number, number] = wgs84togcj02(...fromDMS(item.strPos)) as [
            number,
            number
          ]; // 圆心点的经纬度
          const radius: number = 20e3; // 半径（单位：米
          const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
          const units: turf.Units = "meters"; // 半径的单位
          const sectorPoints: [number, number][] = calculateCirclePoints(
            center,
            radius,
            steps,
            units
          );
          const sectorPolygon = turf.polygon([sectorPoints], {
            strID: item.strID,
            ubyStatus:'空闲',
            tags:item.tags,
            tag:setting.人影.监控.zydTag,
          });
          map.setFeatureState({source:'警戒圈source',id:item.strID},{
            ubyStatus:'空闲',
            opacity:0,
          })
          sectorPolygon.id = '警戒圈' + item.strID
          forewarningFeaturesData.features.push(sectorPolygon);
        }
      }
      map.getSource('警戒圈source').setData(forewarningFeaturesData)
      map.getSource('最大射程source').setData(circleFeaturesData)
      if(!map.getLayer('最大射程-fill')){
        map.addLayer({
          id: "最大射程-fill",
          type: "fill",
          source: "最大射程source",
          layout: {
            visibility: props.zyd ? "visible" : "none",
          },
          paint: {
            "fill-color": [
              "match",
              ['coalesce',["feature-state", "ubyStatus"],'空闲'],
              '作业申请待批复','#fa0',
              '作业批准','#00f',
              '作业开始','#f00',
              '作业结束','#888',
              '作业不批准','#888',
              '空闲','#888',
              '#fff'
            ],
            "fill-opacity": ['coalesce',['feature-state','opacity'],0],
          },
        });
      }
      if(!map.getLayer("最大射程-line")){
        map.addLayer({
          id: "最大射程-line",
          type: "line",
          source: "最大射程source",
          layout: {
            visibility: props.zyd ? "visible" : "none",
          },
          paint: {
            "line-color": [
              "match",
              ['coalesce',["feature-state", "ubyStatus"],'空闲'],
              '作业申请待批复','#fa0',
              '作业批准','#00f',
              '作业开始','#f00',
              '作业结束','#82a9f5',
              '作业不批准','#82a9f5',
              '空闲','#82a9f5',
              '#fff'
            ],
            "line-width": 1,
            "line-opacity": ['coalesce',['feature-state','opacity'],0]
            // "line-dasharray": [1, 1],
          },
        });
      }
      if(!map.getLayer("预警圈-line")){
        map.addLayer({
          id: "预警圈-line",
          type: "line",
          source: "警戒圈source",
          layout: {
            visibility: props.zyd ? "visible" : "none",
          },
          paint: {
            "line-color": [
              "match",
              ['coalesce',["feature-state", "ubyStatus"],'空闲'],
              '作业申请待批复','#fa0',
              '作业批准','#00f',
              '作业开始','#f00',
              '作业结束','#82a9f5',
              '作业不批准','#82a9f5',
              '空闲','#82a9f5',
              '#fff'
            ],
            "line-opacity": ['coalesce',['feature-state','opacity'],0],
            "line-width": 2,
            "line-dasharray": [4, 2],
          },
        });
      }
      if(!map.getLayer("synergyLayer")){
        map.addLayer({
          id: "synergyLayer",
          type: "symbol",
          source: {
            type:'geojson',
            data:synergyFeaturesData
          },
          layout: {
            visibility: setting.人影.监控.synergyZyd ? "visible" : "none",
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            "icon-anchor": "center",
            "icon-image": ["get", "icon-image"],
            'icon-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4, 0.25,
              5, 0.25,
              8, 0.6,
              15, 1.0
            ],
            // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
            "icon-rotate": 0,
            // "icon-offset": [10, 0],
            "icon-rotation-alignment": "map",
            "text-pitch-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
          paint: {
            "icon-opacity": 1,
          },
        });
        协同作业点().then(res=>{
          if(!map)return
          res.data.results.forEach(item=>{
            if(item.strPos){
              let position = (wgs84togcj02(...fromDMS(item.strPos)) as unknown) as [number, number]
              synergyFeaturesData.features.push({
                type: "Feature",
                properties: {
                  strID: item.strID,
                  type: "站点",
                  strCode: item.strCode,
                  strName: item.strName,
                  strPos: item.strPos,
                  iMaxShotRange: item.iMaxShotRange,
                  iMaxShotHei: item.iMaxShotHei,
                  iWeapon: Number(item.strWeapon),
                  iWorkType: 1,
                  iShotRangeBegin: item.iShortAngelBegin,
                  iShotRangeEnd: item.iShortAngelEnd,
                  beginTime: moment().format("HH:mm:ss"),
                  unitName: item.unitName,
                  duration: 1,
                  "icon-image": item.iType == 1 ? "projectile-red" : "projectile-blue",
                  // "icon-image": "火箭弹图标",
                  发报单位:'360000000',
                  delayTimeLen:10,
                  beginDirection:270,
                  endDirection:80,
                  workTimeLen:1,
                  workBeginTime:moment().format('HH:mm:ss'),
                  denyCode:0,
                  strMgrUnitName:item.strMgrUnitName,
                  tags:item.tags,
                  tag:setting.人影.监控.zydTag,
                },
                geometry: {
                  type: "Point",
                  coordinates: position,
                }
              })
            }
          })
          map.getSource('synergyLayer').setData(synergyFeaturesData)
        })
      }
      if(!map.getSource("zydSource")){
        map.addSource("zydSource", {
          type: "geojson",
          data: zydFeaturesData,
          promoteId:'strID'
        });
      }
      if(!map.getLayer("zydLayer")){
        map.addLayer({
          id: "zydLayer",
          type: "symbol",
          source: "zydSource",
          layout: {
            visibility: props.zyd ? "visible" : "none",
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            "icon-anchor": "center",
            "icon-image": ["get", "icon-image"],
            'icon-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4, 0.25,
              5, 0.25,
              8, 0.6,
              15, 1.0
            ],
            // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
            "icon-rotate": 0,
            // "icon-offset": [10, 0],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
          paint: {
            "icon-opacity": 1,
          },
          filter: ['any',...setting.人影.监控.zydTag.map(tag=>['in', tag, ['get', 'tags']])]
        });
      }
      if(!map.getLayer("textLayer")){
        map.addLayer({
          id: "textLayer",
          type: "symbol",
          source: "zydSource",
          layout: {
            visibility: props.zyd ? "visible" : "none",
            "text-field": ["get", "strName"],
            "text-font": ["simkai"],
            "text-size": 12,
            "text-transform": "uppercase",
            // "text-letter-spacing": 0.05,】,
            "text-line-height": 1,
            'text-anchor': 'bottom', // 水平垂直居中
            'text-offset': [0, -1], // 调整文本偏移量
            'text-justify': 'center', // 水平居中对齐
            "text-ignore-placement": true,
            "text-allow-overlap": true,
            "text-pitch-alignment": "map",
            "text-rotation-alignment": "map",
            "text-max-width": 400,
          },
          paint: {
            "text-color": "white",
            "text-halo-color": "black",
            "text-halo-width": 1,
            'text-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              9, 0,   // zoom <= 9 不显示文字
              10, 1   // zoom >= 10 显示文字
            ]
          },
          filter: ['any',...setting.人影.监控.zydTag.map(tag=>['in', tag, ['get', 'tags']])]
        });
      }
      if(!map.getSource("stoveSource")){
        map.addSource("stoveSource", {
          type: "geojson",
          data: stoveFeaturesData,
          promoteId:'strStoveID'
        });
      }
      if(!map.getLayer("stoveLayer")){
        map.addLayer({
          id: "stoveLayer",
          type: "symbol",
          source: "stoveSource",
          layout: {
            visibility: setting.人影.监控.zyd?'visible':'none',
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            "icon-anchor": "center",
            "icon-image": ["get", "icon-image"],
            'icon-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4, 0.25,
              5, 0.25,
              8, 0.6,
              15, 1.0
            ],
            // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
            "icon-rotate": 0,
            // "icon-offset": [10, 0],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "text-field": ["get", "name"],
            "text-font": ["simkai"],
            "text-size": 12,
            "text-transform": "uppercase",
            // "text-letter-spacing": 0.05,】,
            "text-line-height": 1,
            'text-anchor': 'bottom', // 水平垂直居中
            'text-offset': [0, -1], // 调整文本偏移量
            'text-justify': 'center', // 水平居中对齐
            "text-ignore-placement": true,
            "text-allow-overlap": true,
            "text-pitch-alignment": "map",
            "text-rotation-alignment": "map",
            "text-max-width": 400,
          },
          paint: {
            "icon-opacity": 1,
            "text-color": "white",
            "text-halo-color": "black",
            "text-halo-width": 1,
            'text-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              9, 0,   // zoom <= 9 不显示文字
              10, 1   // zoom >= 10 显示文字
            ]
          },
          filter: ['any',...setting.人影.监控.zydTag.map(tag=>['in', tag, ['get', 'tags']])]
        });
      }

      if(!map.getSource("testSource")){
        map.addSource("testSource", {
          type: "geojson",
          data: testFeaturesData,
        });
      }
      if(!map.getLayer("testLayer")){
        map.addLayer({
          id: "testLayer",
          type: "symbol",
          source: "testSource",
          layout: {
            visibility: setting.人影.监控.test ? "visible" : "none",
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            "icon-anchor": "center",
            "icon-image": ["get", "icon-image"],
            'icon-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4, 0.25,
              5, 0.25,
              8, 0.6,
              15, 1.0
            ],
            // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
            "icon-rotate": 0,
            // "icon-offset": [10, 0],
            "icon-rotation-alignment": "map",
            "text-pitch-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
          paint: {
            "icon-opacity": 1,
          }
        });
      }
      if(!map.getLayer("testLabelLayer")){
        map.addLayer({
          id: "testLabelLayer",
          type: "symbol",
          source: "testSource",
          layout: {
            visibility: setting.人影.监控.test ? "visible" : "none",
            // This icon is a part of the Mapbox Streets style.
            // To view all images available in a Mapbox style, open
            // the style in Mapbox Studio and click the "Images" tab.
            // To add a new image to the style at runtime see
            // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
            "text-pitch-alignment": "map",
            "text-field": ["get", "strName"],
            "text-font": ["simkai"],
            "text-size": 16,
            "text-transform": "uppercase",
            // "text-letter-spacing": 0.05,
            "text-anchor": "bottom",
            "text-line-height": 1,
            "text-justify": "center",
            "text-offset": [0, -1],
            "text-ignore-placement": true,
            "text-allow-overlap": true,
            "text-rotation-alignment": "map",
            "text-max-width": 400,
          },
          paint: {
            "text-color": "white",
            "text-halo-color": "black",
            "text-halo-width": 1,
          },
          "minzoom":9,
        });
      }


      map.on("contextmenu", "stoveLayer", (e: any) => {
        e.handled = true;
        e.originalEvent.stopPropagation()
        e.originalEvent.preventDefault();
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["stoveLayer"],
        });

        if (!fs.length) {
          return;
        }
        const feature = fs[0];
        station.人影界面被选中的烟炉 = feature.properties.strStoveID;
        marker.setLngLat(feature.geometry.coordinates);
        const state = map.getFeatureState({source:'stoveSource',id:feature.properties.strStoveID})
        menuType.value = '烟炉操作'
        $(stationMenuRef.value as HTMLDivElement).css({display:'block'});
        $(stationMenuRef.value as HTMLDivElement).removeData();
        $(stationMenuRef.value as HTMLDivElement).data(Object.assign(feature.properties,state));
      });
      map.on("contextmenu", "zydLayer", (e: any) => {
        e.handled = true;
        e.originalEvent.stopPropagation()
        e.originalEvent.preventDefault();
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["zydLayer"],
        });

        if (!fs.length) {
          return;
        }
        const feature = fs[0];
        station.人影界面被选中的设备 = feature.properties.strID;
        marker.setLngLat(feature.geometry.coordinates);
        const state = map.getFeatureState({source:'zydSource',id:feature.properties.strID})
        if(state.ubyStatus=='作业申请待批复'){
          menuType.value = '人工批复'
        }else if(state.ubyStatus=='作业开始'||state.ubyStatus=='作业批准'||state.ubyStatus=='作业结束'){
          menuType.value = '默认'
        }else if(state.ubyStatus=='空闲'||state.ubyStatus=='作业不批准'||state.ubyStatus=='作业完成'||state.ubyStatus==undefined){
          menuType.value = '地面作业申请'
        }else{
          console.log('未处理状态',state.ubyStatus)
          return
        }
        $(stationMenuRef.value as HTMLDivElement).css({display:'block'});
        $(stationMenuRef.value as HTMLDivElement).removeData();
        $(stationMenuRef.value as HTMLDivElement).data(Object.assign(feature.properties,state));
      });
      map.on("contextmenu", contextmenuFunc);
      map.on("mousedown", "zydLayer", (e: any) => {
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["zydLayer"],
        });
        if (!fs.length) {
          return;
        }
        const feature = fs[0];
        station.人影界面被选中的设备 = feature.properties.strID;
      });
      map.on("mousedown", (e) => {
        // console.log([e.lngLat.lng,e.lngLat.lat])
        $(stationMenuRef.value as HTMLDivElement).css({display:'none'});
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["zydLayer"],
        });
        if(fs.length){
          return;
        }
        if(e.originalEvent.button==0){
          if(station.人影界面被选中的设备 != ''){
            station.人影界面被选中的设备 = ''
          }else{
            active()
          }
        }
      });
      active = () => {
        circleFeaturesData.features.forEach((item:any)=>{
          const state = map.getFeatureState({source:'最大射程source',id:item.properties.strID})
          const opacity = item.properties.strID == station.人影界面被选中的设备||state.ubyStatus == '作业申请待批复'||state.ubyStatus == '作业批准'||state.ubyStatus == '作业开始'||state.ubyStatus == '作业结束'?0.5:0
          map.setFeatureState({source:'最大射程source',id:item.properties.strID},{opacity})
        })
        forewarningFeaturesData.features.forEach((item:any)=>{
          const state = map.getFeatureState({source:'警戒圈source',id:item.properties.strID})
          const opacity = item.properties.strID == station.人影界面被选中的设备||state.ubyStatus == '作业申请待批复'||state.ubyStatus == '作业批准'||state.ubyStatus == '作业开始'||state.ubyStatus == '作业结束'?0.5:0
          map.setFeatureState({source:'警戒圈source',id:item.properties.strID},{opacity})
        })
      }
      /*规划航线*/
      // await getPlanPath().then(async(data)=>{
      //   if(!map)return

      //   // 辅助力量站点
      //   if(data.standby_station){
      //     await axios({
      //       url:data.standby_station.replace('http://10.225.3.150:8091','/planPath'),
      //       method:'get',
      //     }).then(res=>{
      //       res.data.forEach(item=>{
      //         zydFeaturesData.features.forEach(feature=>{
      //           if(feature.properties.strID == item.stationid){
      //             if(!feature.properties.tags.includes('正西辅助力量')){
      //               feature.properties.tags.push('正西辅助力量')
      //             }
      //           }
      //         })
      //       })
      //       map.getSource('zydSource').setData(zydFeaturesData)
      //     })
      //   }

      //   // 主力量站点
      //   if(data.main_station){
      //     await axios({
      //       url:data.main_station.replace('http://10.225.3.150:8091','/planPath'),
      //       method:'get',
      //     }).then(res=>{
      //       res.data.forEach(item=>{
      //         zydFeaturesData.features.forEach(feature=>{
      //           if(feature.properties.strID == item.stationid){
      //             if(!feature.properties.tags.includes('西南主力量')){
      //               feature.properties.tags.push('西南主力量')
      //             }
      //           }
      //         })
      //       })
      //       map.getSource('zydSource').setData(zydFeaturesData)
      //     })
      //   }
      //   // 主力量轨迹
      //   if(data.main_plan){
      //     await axios({
      //       url:data.main_plan.replace('http://10.225.3.150:8091','/planPath'),
      //       method:'get',
      //     }).then(res=>{
      //       绘制主力量规划轨迹(map,res.data,setting,wgs84togcj02)
      //     })
      //   }

      //   // 辅助力量轨迹
      //   if(data.standby_plan){
      //     const url = data.standby_plan.replace('http://10.225.3.150:8091','/planPath')
      //     axios({
      //       url,
      //       method:'get',
      //     }).then(res=>{
      //       辅助力量规划航迹(map,res.data,setting,wgs84togcj02)
      //     })
      //   }

      //   // 消云
      //   if(data.three_plan){
      //     const url = data.three_plan.replace('http://10.225.3.150:8091','/planPath')
      //     axios({
      //       url,
      //       method:'get',
      //     }).then(res=>{
      //       紧急力量规划航迹(map,res.data,setting,wgs84togcj02)
      //     })
      //   }
      // }).catch(err=>{
      //   console.log(err)
      // })
      {
        if(map&&!map.getSource("trackSource")){
          map.addSource("trackSource", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: trackFeatures,
            },
          });
        }
        if(map&&!map.getLayer("trackLayer")){
          map.addLayer({
            id: "trackLayer",
            type: "symbol",
            source: "trackSource",
            layout: {
              visibility: (setting.人影.监控.track&&setting.人影.监控.plane) ? "visible" : "none",
              // This icon is a part of the Mapbox Streets style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              "icon-anchor": "center",
              "icon-image": "trackSvg",
              // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
              "icon-rotate": 0,
              // "icon-offset": [10, 0],
              "icon-rotation-alignment": "map",
              "text-pitch-alignment": "map",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "text-field": ["get", "strName"],
              "text-font": ["simkai"],
              "text-size": 16,
              "text-transform": "uppercase",
              // "text-letter-spacing": 0.05,
              "text-anchor": "bottom",
              "text-line-height": 1,
              "text-justify": "center",
              "text-offset": [0, -1],
              "text-ignore-placement": true,
              "text-allow-overlap": true,
              "text-rotation-alignment": "map",
              "text-max-width": 400,
            },
            paint: {
              "icon-opacity": ['get','opacity'],
              "text-color": "white",
              "text-halo-color": "black",
              "text-halo-width": 1,
            },
            // filter:['==', ['get', 'icon'], 'airplaneMock']
          });
        }
        if(map&&!map.getSource("adsbTrackSource")){
          map.addSource("adsbTrackSource", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: adsbTrackFeatures,
            },
          });
        }
        if(map&&!map.getLayer("adsbTrackLayer")){
          map.addLayer({
            id: "adsbTrackLayer",
            type: "symbol",
            source: "adsbTrackSource",
            layout: {
              visibility: (setting.人影.监控.track&&setting.人影.监控.adsb) ? "visible" : "none",
              // This icon is a part of the Mapbox Streets style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              "icon-anchor": "center",
              "icon-image": "trackSvg",
              // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
              "icon-rotate": 0,
              // "icon-offset": [10, 0],
              "icon-rotation-alignment": "map",
              "text-pitch-alignment": "map",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "text-field": ["get", "strName"],
              "text-font": ["simkai"],
              "text-size": 16,
              "text-transform": "uppercase",
              // "text-letter-spacing": 0.05,
              "text-anchor": "bottom",
              "text-line-height": 1,
              "text-justify": "center",
              "text-offset": [0, -1],
              "text-ignore-placement": true,
              "text-allow-overlap": true,
              "text-rotation-alignment": "map",
              "text-max-width": 400,
            },
            paint: {
              "icon-opacity": 1,
              "text-color": "white",
              "text-halo-color": "black",
              "text-halo-width": 1,
            },
          });
        }
        map.addLayer({
          id: 'track',
          type: 'line',
          source: {
            type:'geojson',
            data:trackLinesFeaturesData
          },
          layout: {
            visibility: (setting.人影.监控.track&&setting.人影.监控.plane) ? "visible" : "none",
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#0f0',
            'line-width': 1
          },
          filter:
          [
            'all',
            ['==', ['get', 'icon'], 'airplaneMock'],
            ['==', ['get', 'active'], true]
          ]
        });
        map.addLayer({
          id: 'trackPoint',
          type: 'symbol',
          source: {
            type:'geojson',
            data:trackPointsFeaturesData
          },
          layout: {
            visibility: (setting.人影.监控.track&&setting.人影.监控.plane) ? "visible" : "none",
            "icon-anchor": "center",
            "icon-image": "trackSvg",
            // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
            "icon-rotate": 0,
            // "icon-offset": [10, 0],
            "icon-rotation-alignment": "map",
            "text-pitch-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "text-field": '',
            "text-font": ["simkai"],
            "text-size": 16,
            "text-transform": "uppercase",
            // "text-letter-spacing": 0.05,
            "text-anchor": "bottom",
            "text-line-height": 1,
            "text-justify": "center",
            "text-offset": [0, -1],
            "text-ignore-placement": true,
            "text-allow-overlap": true,
            "text-rotation-alignment": "map",
            "text-max-width": 400,
          },
          filter:[
            'all',
            ['==', ['get', 'icon'], 'airplaneMock'],
            ['==', ['get', 'active'], true],
          ]
        });
        map.addSource("飞机原数据", {type:'geojson',data:airplanesData});
        map.addSource("adsb原数据", {type:'geojson',data:adsbData});
        map.addSource("模拟飞机", {type:'geojson',data:airplanesMockData});
        map.addLayer({
          id: "飞机",
          type: "symbol",
          source: "飞机原数据",
          layout: {
            "icon-image": ['get','icon'],
            // "icon-size": {
            //   base: 1,
            //   stops: [
            //     [0, 0.5],
            //     [22, 1],
            //   ],
            // },
            "icon-rotate": ["get", "fHeading"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: props.plane ? "visible" : "none",
          },
          paint:{
            "icon-opacity":['get','opacity'],
          },
          filter:setting.人影.监控.ryPlane?['==', ['get', 'icon'], 'airplaneMock']:['all']
        });
        map.addLayer({
          id: "飞机气泡图层",
          type: "symbol",
          source: "飞机原数据",
          layout: {
            "icon-image": "pop",
            // "icon-size": {
            //   base: 1,
            //   stops: [
            //     [0, 0.5],
            //     [22, 1],
            //   ],
            // },
            // "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            'icon-text-fit': 'both', // 核心配置，让背景跟文字自适应
            'icon-text-fit-padding': [4, 4, 4, 4], // 上右下左，像 padding
            'text-field': ['get', 'label'],
            // 'text-pitch-alignment':'map',
            'icon-anchor': 'bottom',
            'text-anchor': 'bottom',
            'text-offset': [0, -1],
            'text-font': ['simkai'],
            'text-allow-overlap':true,
            visibility: (setting.人影.监控.planeLabel)?"visible":'none',
          },
          paint:{
            'icon-color':'#5272ba',
            "icon-opacity":1,
            'text-color':'white'
          },
          filter:setting.人影.监控.ryPlane?['==', ['get', 'icon'], 'airplaneMock']:['all']
        });
        map.addLayer({
          id: "adsb气泡图层",
          type: "symbol",
          source: "adsb原数据",
          layout: {
            "icon-image": "pop",
            // "icon-size": {
            //   base: 1,
            //   stops: [
            //     [0, 0.5],
            //     [22, 1],
            //   ],
            // },
            // "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            'icon-text-fit': 'both', // 核心配置，让背景跟文字自适应
            'icon-text-fit-padding': [4, 4, 4, 4], // 上右下左，像 padding
            'text-field': ['get', 'label'],
            // 'text-pitch-alignment':'map',
            'icon-anchor': 'bottom',
            'text-anchor': 'bottom',
            'text-offset': [0, -1],
            'text-font': ['simkai'],
            'text-allow-overlap':true,
            visibility: (setting.人影.监控.planeLabel&&setting.人影.监控.adsb)?"visible":'none',
          },
          paint:{
            'icon-color':'white',
            "icon-opacity":1,
          }
        });
        map.addLayer({
          id: "adsb图层",
          type: "symbol",
          source: "adsb原数据",
          layout: {
            "icon-image": "adsb",
            // "icon-size": {
            //   base: 1,
            //   stops: [
            //     [0, 0.5],
            //     [22, 1],
            //   ],
            // },
            "icon-rotate": ["get", "heading"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: setting.人影.监控.adsb?"visible":"none",
          },
          paint:{
            "icon-opacity":1,
          }
        });
        map.addLayer({
          id: "模拟飞机图层",
          type: "symbol",
          source: "模拟飞机",
          layout: {
            "icon-image": "airplaneMock",
            // "icon-size": {
            //   base: 1,
            //   stops: [
            //     [0, 0.5],
            //     [22, 1],
            //   ],
            // },
            "icon-rotate": ["get", "fHeading"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            visibility: props.plane ? "visible" : "none",
          },
        });
        机场().then((res)=>{
          if(!map)return
          let data = res.data.results
          let airports:any[] = [];
          for (let i = 0; i < data.length; i++) {
            airports.push({
              type: "Feature",
              properties: {
                name: data[i].name,
                code:data[i].code,
                deg: 0,
              },
              geometry: {
                type: "Point",
                coordinates: wgs84togcj02(...fromDMS(data[i].strLonLat)),
                // coordinates: [0, 0],
              },
            });
          }
          map.addSource("机场数据", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: airports,
            },
          });
          map.addLayer({
            id: "机场图层",
            type: "symbol",
            source: "机场数据",
            layout: {
              "icon-image": "airport",
              // "icon-size": {
              //   base: 1,
              //   stops: [
              //     [0, 0.5],
              //     [22, 1],
              //   ],
              // },
              "icon-rotate": ["get", "deg"],
              "icon-rotation-alignment": "map",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              visibility: props.airport?"visible":'none',
              "text-pitch-alignment": "map",
              "text-field": ["get", "name"],
              "text-font": ["simkai"],
              "text-size": 16,
              "text-transform": "uppercase",
              // "text-letter-spacing": 0.05,
              "text-anchor": "left",
              "text-line-height": 1,
              "text-justify": "left",
              "text-offset": [1, 0],
              "text-ignore-placement": true,
              "text-allow-overlap": true,
              "text-rotation-alignment": "map",
              "text-max-width": 400,
            },
            paint: {
              "icon-opacity": 1,
              "text-color": "white",
              "text-halo-color": "black",
              "text-halo-width": 1,
            },
          });
        })
      }
    }).catch(e=>{
      console.log(e)
    })
    let abortController:AbortController|null = null;
    function work(){
      abortController?.abort()
      abortController = new AbortController()
      作业状态数据(abortController.signal).then(res=>{
        // zydFeaturesData.features.forEach((feature:any)=>map.setFeatureState({source:'最大射程source',id:feature.properties.strID},{ubyStatus:'空闲'}))//确保手动移除后，能做空域申请
        // circleFeaturesData.features.forEach((feature:any)=>map.setFeatureState({source:'最大射程source',id:feature.properties.strID},{ubyStatus:'空闲'}))//确保手动移除后，射界恢复默认颜色
        // forewarningFeaturesData.features.forEach((feature:any)=>map.setFeatureState({source:'警戒圈source',id:feature.properties.strID},{ubyStatus:'空闲'}))//确保手动移除后，警戒圈恢复默认颜色
        //实现空域闪烁效果
        function star(feature:any,row:any){
          if(row.ubyStatus == 75){
            feature.properties.fillColor = '#00f'
          }else if(row.ubyStatus == 91){
            feature.properties.fillColor = '#f00'
          }else{
            feature.properties.fillColor = '#000'
          }
          if(row.ubyStatus == 75||row.ubyStatus == 91){
            const millisecond = moment().diff(moment(row.tmAnswerRev,'YYYY-MM-DD HH:mm:ss'),'ms')
            feature.properties.opacity=(Math.floor(millisecond / 1000) % 2)?0.5:0;
            if(millisecond>20e3){
              feature.properties.opacity = 0.5
            }
          }
        }
        planProps.当前作业进度.splice(0,planProps.当前作业进度.length,...res.data[0]);
        for(let i=planProps.当前作业进度.length-1;i>=0;i--){
          let row = planProps.当前作业进度[i]
          row.ubySendStatus = 3//发送成功
          if(status2value(row.ubyStatus) == '作业批准' && moment(row.tmBeginAnswer).isBefore(moment())){
            row.ubyStatus = 91
          }
          if(status2value(row.ubyStatus) == '作业申请待批复'&&moment(row.tmBeginApply).add(row.iApplyTimeLen+10*60,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          if(status2value(row.ubyStatus) == '作业开始'&&moment(row.tmBeginAnswer).add(row.iAnswerTimeLen,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          //传入workID
          map.setFeatureState({source:'zydSource',id:row.strZydID},{
            ubyStatus:status2value(row.ubyStatus),
            workBeginTime:moment().format('HH:mm:ss'),
            strWorkID:row.strWorkID,
            tmBeginApply:row.tmBeginApply,
            tmUpdate:row.tmUpdate,
          })
          for (let i = 0; i < circleFeaturesData.features.length; i++) {
            if (circleFeaturesData.features[i].properties.strID == row.strZydID) {
              Object.assign(circleFeaturesData.features[i].properties,row)
              circleFeaturesData.features[i].properties.ubyStatus = status2value(row.ubyStatus);
              const state = map.getFeatureState({source:'最大射程source',id:row.strZydID})
              if(status2value(row.ubyStatus)!='作业空闲'){
                state.opacity = 0.5;
              }
              // star(circleFeaturesData.features[i],row)
              map.setFeatureState({source:'最大射程source',id:row.strZydID},{ubyStatus:status2value(row.ubyStatus),opacity:state.opacity})
              const center: [number, number] = wgs84togcj02(...fromDMS(row.strCurPos)) as [
                number,
                number
              ]; // 圆心点的经纬度
              const radius: number = row.iRange; // 半径（单位：米）
              const startAngle: number = row.iAngleBegin; // 起始角度（单位：度）
              const endAngle: number = row.iAngleEnd; // 终止角度（单位：度）
              const steps: number = 3600; // 用于生成圆弧的步数，越大越平滑
              const units: turf.Units = "meters"; // 半径的单位
              if (endAngle - startAngle >= 360) {
                const center: [number, number] = wgs84togcj02(...fromDMS(row.strCurPos)) as [
                  number,
                  number
                ]; // 圆心点的经纬度
                const radius: number = row.iRange; // 半径（单位：米
                const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
                const units: turf.Units = "meters"; // 半径的单位
                const sectorPoints: [number, number][] = calculateCirclePoints(
                  center,
                  radius,
                  steps,
                  units
                );
                const sectorPolygon = turf.polygon([sectorPoints], {
                  strID: row.strZydID,
                  opacity:0
                });
                circleFeaturesData.features[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
              } else {
                // const sectorPoints: [number, number][] = calculateSectorPoints(
                //   center,
                //   radius,
                //   startAngle,
                //   endAngle,
                //   steps,
                //   units
                // );
                // const sectorPolygon = turf.polygon([sectorPoints], {
                //   strID: row.strZydID,
                //   opacity:0
                // });
                // circleFeaturesData.features[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
              }
            }
          }
          for(let i=0;i<forewarningFeaturesData.features.length;i++){
            if(forewarningFeaturesData.features[i].properties.strID == row.strZydID){
              forewarningFeaturesData.features[i].properties.ubyStatus = status2value(row.ubyStatus);
              const state = map.getFeatureState({source:'警戒圈source',id:row.strZydID})
              if(status2value(row.ubyStatus)!='作业空闲'){
                state.opacity = 0.5;
              }
              // star(forewarningFeaturesData.features[i],row)
              map.setFeatureState({source:'警戒圈source',id:row.strZydID},{ubyStatus:status2value(row.ubyStatus),opacity:state.opacity})
            }
          }
        }
        // map?.getSource('zydSource').setData(zydFeaturesData)
        planProps.今日作业记录.splice(0,planProps.今日作业记录.length,...res.data[1]);
        for(let i=planProps.今日作业记录.length-1;i>=0;i--){
          let row = planProps.今日作业记录[i]
          row.ubySendStatus = 3//发送成功
          if(status2value(row.ubyStatus) == '作业批准' && moment(row.tmBeginAnswer).isBefore(moment())){
            row.ubyStatus = 91
          }
          if(status2value(row.ubyStatus) == '作业申请待批复'&&moment(row.tmBeginApply).add(row.iApplyTimeLen+10*60,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          if(status2value(row.ubyStatus) == '作业开始'&&moment(row.tmBeginAnswer).add(row.iAnswerTimeLen,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
        }
      }).catch(()=>{
        console.log('当前作业查询被终止')
      })
      /*
      当前作业查询(abortController.signal).then(async(res) => {
        zydFeaturesData.features.forEach((feature:any)=>map.setFeatureState({source:'最大射程source',id:feature.properties.strID},{ubyStatus:'空闲'}))//确保手动移除后，能做空域申请
        circleFeaturesData.features.forEach((feature:any)=>map.setFeatureState({source:'最大射程source',id:feature.properties.strID},{ubyStatus:'空闲'}))//确保手动移除后，射界恢复默认颜色
        forewarningFeaturesData.features.forEach((feature:any)=>map.setFeatureState({source:'警戒圈source',id:feature.properties.strID},{ubyStatus:'空闲'}))//确保手动移除后，警戒圈恢复默认颜色
        //实现空域闪烁效果
        function star(feature:any,row:any){
          if(row.ubyStatus == 75){
            feature.properties.fillColor = '#00f'
          }else if(row.ubyStatus == 91){
            feature.properties.fillColor = '#f00'
          }else{
            feature.properties.fillColor = '#000'
          }
          if(row.ubyStatus == 75||row.ubyStatus == 91){
            const millisecond = moment().diff(moment(row.tmAnswerRev,'YYYY-MM-DD HH:mm:ss'),'ms')
            feature.properties.opacity=(Math.floor(millisecond / 1000) % 2)?0.5:0;
            if(millisecond>20e3){
              feature.properties.opacity = 0.5
            }
          }
        }
        planProps.当前作业进度.splice(0,planProps.当前作业进度.length,...res.data.results);
        for(let i=planProps.当前作业进度.length-1;i>=0;i--){
          let row = planProps.当前作业进度[i]
          row.ubySendStatus = 3//发送成功
          if(status2value(row.ubyStatus) == '作业批准' && moment(row.tmBeginAnswer).isBefore(moment())){
            row.ubyStatus = 91
          }
          if(status2value(row.ubyStatus) == '作业申请待批复'&&moment(row.tmBeginApply).add(row.iApplyTimeLen+10*60,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          if(status2value(row.ubyStatus) == '作业开始'&&moment(row.tmBeginAnswer).add(row.iAnswerTimeLen,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          //传入workID
          map.setFeatureState({source:'zydSource',id:row.strZydID},{ubyStatus:status2value(row.ubyStatus),workBeginTime:moment().format('HH:mm:ss'),strWorkID:row.strWorkID})
          for (let i = 0; i < circleFeaturesData.features.length; i++) {
            if (circleFeaturesData.features[i].properties.strID == row.strZydID) {
              Object.assign(circleFeaturesData.features[i].properties,row)
              circleFeaturesData.features[i].properties.ubyStatus = status2value(row.ubyStatus);
              const state = map.getFeatureState({source:'最大射程source',id:row.strZydID})
              if(status2value(row.ubyStatus)!='作业结束'&&status2value(row.ubyStatus)!='作业不批准'){
                state.opacity = 0.5;
              }
              // star(circleFeaturesData.features[i],row)
              map.setFeatureState({source:'最大射程source',id:row.strZydID},{ubyStatus:status2value(row.ubyStatus),opacity:state.opacity})
              const center: [number, number] = wgs84togcj02(...fromDMS(row.strCurPos)) as [
                number,
                number
              ]; // 圆心点的经纬度
              const radius: number = row.iRange; // 半径（单位：米）
              const startAngle: number = row.iAngleBegin; // 起始角度（单位：度）
              const endAngle: number = row.iAngleEnd; // 终止角度（单位：度）
              const steps: number = 3600; // 用于生成圆弧的步数，越大越平滑
              const units: turf.Units = "meters"; // 半径的单位
              if (endAngle - startAngle >= 360) {
                const center: [number, number] = wgs84togcj02(...fromDMS(row.strCurPos)) as [
                  number,
                  number
                ]; // 圆心点的经纬度
                const radius: number = row.iRange; // 半径（单位：米
                const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
                const units: turf.Units = "meters"; // 半径的单位
                const sectorPoints: [number, number][] = calculateCirclePoints(
                  center,
                  radius,
                  steps,
                  units
                );
                const sectorPolygon = turf.polygon([sectorPoints], {
                  strID: row.strZydID,
                  opacity:0
                });
                circleFeaturesData.features[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
              } else {
                // const sectorPoints: [number, number][] = calculateSectorPoints(
                //   center,
                //   radius,
                //   startAngle,
                //   endAngle,
                //   steps,
                //   units
                // );
                // const sectorPolygon = turf.polygon([sectorPoints], {
                //   strID: row.strZydID,
                //   opacity:0
                // });
                // circleFeaturesData.features[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
              }
            }
          }
          for(let i=0;i<forewarningFeaturesData.features.length;i++){
            if(forewarningFeaturesData.features[i].properties.strID == row.strZydID){
              forewarningFeaturesData.features[i].properties.ubyStatus = status2value(row.ubyStatus);
              const state = map.getFeatureState({source:'警戒圈source',id:row.strZydID})
              if(status2value(row.ubyStatus)!='作业结束'&&status2value(row.ubyStatus)!='作业不批准'){
                state.opacity = 0.5;
              }
              // star(forewarningFeaturesData.features[i],row)
              map.setFeatureState({source:'警戒圈source',id:row.strZydID},{ubyStatus:status2value(row.ubyStatus),opacity:state.opacity})
            }
          }
        }
        // map?.getSource('zydSource').setData(zydFeaturesData)
        const tmp = await 历史作业查询()
        planProps.今日作业记录.splice(0,planProps.今日作业记录.length,...tmp.data.results);
        for(let i=planProps.今日作业记录.length-1;i>=0;i--){
          let row = planProps.今日作业记录[i]
          row.ubySendStatus = 3//发送成功
          if(status2value(row.ubyStatus) == '作业批准' && moment(row.tmBeginAnswer).isBefore(moment())){
            row.ubyStatus = 91
          }
          if(status2value(row.ubyStatus) == '作业申请待批复'&&moment(row.tmBeginApply).add(row.iApplyTimeLen+10*60,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          if(status2value(row.ubyStatus) == '作业开始'&&moment(row.tmBeginAnswer).add(row.iAnswerTimeLen,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
        }
      }).catch(()=>{
        console.log('当前作业查询被终止')
      });
      */
    }
    watch(()=>setting.触发作业状态数据查询,()=>{
      work()
    })
    work()
    // getDevice().then((res) => {
    //   dialogOptions.menus = res.data;
    //   let features: any = [];
    //   dialogOptions.menus.map((item: any) => {
    //     let position: [number, number] = (wgs84togcj02(...fromDMS(item.lngLat)) as unknown) as [
    //       number,
    //       number
    //     ];
    //     features.push({
    //       type: "Feature",
    //       properties: {
    //         type: "站点",
    //         name: item.name,
    //         color: item.color,
    //       },
    //       geometry: {
    //         type: "Point",
    //         coordinates: position,
    //       },
    //     });
    //     // let offset = (getRandomPointBetweenR1R2(50, 100) as unknown) as [number, number];
    //     // let div = document.createElement("div");
    //     // div.id = "人影" + item.id;
    //     // div.className = "deviceStation_人影";
    //     // div.style.position = "absolute";
    //     // $(div).data("id", item.id);
    //     // let device = $(
    //     //   `<div class="station" style="z-index:-1;left:50%;top:50%;transform:translate(-50%,-50%) translate(${-offset[0]}px,${-offset[1]}px)"><div class="projectile" style="filter: drop-shadow(${
    //     //     item.color
    //     //   } 0 -60px);transform:translateY(60px)"/></div>`
    //     // );
    //     // $(div).append(device);
    //     // $(div).append(
    //     //   $(
    //     //     `<div class="connectingLine" style="pointer-events:none;background:white;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) translate(${
    //     //       -offset[0] / 2
    //     //     }px,${-offset[1] / 2}px) rotate(${Math.atan2(
    //     //       offset[1],
    //     //       offset[0]
    //     //     )}rad);width:${Math.sqrt(offset[0] ** 2 + offset[1] ** 2)}px"></div>`
    //     //   )
    //     // );
    //     // let label = $(`<div class="label">${item.name}</div>`);
    //     // $(div).append(label);

    //     // device.on("click", function click() {
    //     //   station.人影界面被选中的设备 = $(this).parent().data("id");
    //     //   $(`#人影-${station.人影界面被选中的设备}`)[0].scrollIntoView({
    //     //     block: "nearest",
    //     //     behavior: "smooth",
    //     //     inline: "center",
    //     //   });
    //     // });
    //     // device.on("mousedown", (evt) => {
    //     //   evt.preventDefault();
    //     //   evt.stopPropagation();
    //     // });
    //     // var marker = new Marker(div, {
    //     //   draggable: true,
    //     //   pitchAlignment: "map",
    //     //   rotationAlignment: "map",
    //     //   anchor: "center",
    //     // })
    //     //   .setLngLat(position) // 设置标记的经纬度坐标
    //     //   .addTo(map)
    //     //   .setOffset(offset);
    //     // let dragStartOffset: { x: number; y: number };
    //     // marker.on("dragstart", () => {
    //     //   dragStartOffset = marker.getOffset() as { x: number; y: number };
    //     // });
    //     // marker.on("drag", (e: any) => {
    //     //   let dragEndPoint = marker.fromDMS();
    //     //   let pt1 = map.project({ lng: position[0], lat: position[1] });
    //     //   let pt2 = map.project(dragEndPoint);
    //     //   let x = dragStartOffset.x + pt2.x - pt1.x;
    //     //   let y = dragStartOffset.y + pt2.y - pt1.y;
    //     //   marker.setOffset([x, y]);
    //     //   let line = $("#人影" + item.id).find(".connectingLine")[0];
    //     //   line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
    //     //     -y / 2
    //     //   }px) rotate(${Math.atan2(y, x)}rad)`;
    //     //   line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
    //     //   let station = $("#人影" + item.id).find(".station")[0];
    //     //   station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
    //     //   marker.setLngLat(position);
    //     // });
    //     // marker.on("dragend", (e: any) => {
    //     //   let dragEndPoint = e.target.fromDMS();
    //     //   let pt1 = map.project({ lng: position[0], lat: position[1] });
    //     //   let pt2 = map.project(dragEndPoint);
    //     //   let offset = marker.getOffset() as { x: number; y: number };
    //     //   let x = offset.x + pt2.x - pt1.x;
    //     //   let y = offset.y + pt2.y - pt1.y;
    //     //   marker.setOffset([x, y]);
    //     //   let line = $("#人影" + item.id).find(".connectingLine")[0];
    //     //   line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
    //     //     -y / 2
    //     //   }px) rotate(${Math.atan2(y, x)}rad)`;
    //     //   line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
    //     //   let station = $("#人影" + item.id).find(".station")[0];
    //     //   station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
    //     //   marker.setLngLat(position);
    //     // });
    //   });
    //   map.addLayer({
    //     id: "zydLayer",
    //     type: "symbol",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: features,
    //       },
    //     },
    //     layout: {
    //       visibility: props.zyd ? "visible" : "none",
    //       // This icon is a part of the Mapbox Streets style.
    //       // To view all images available in a Mapbox style, open
    //       // the style in Mapbox Studio and click the "Images" tab.
    //       // To add a new image to the style at runtime see
    //       // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
    //       "icon-anchor": "left",
    //       "icon-image": "projectile",
    //       "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
    //       "icon-rotate": 0,
    //       "icon-rotation-alignment": "map",
    //       "icon-allow-overlap": true,
    //       "icon-ignore-placement": true,
    //       "text-field": ["get", "name"],
    //       "text-font": ["simkai"],
    //       "text-size": 16,
    //       "text-transform": "uppercase",
    //       // "text-letter-spacing": 0.05,
    //       "text-anchor": "center",
    //       "text-line-height": 1,
    //       "text-justify": "center",
    //       "text-offset": [0, -1],
    //       "text-ignore-placement": true,
    //       "text-allow-overlap": true,
    //       "text-rotation-alignment": "map",
    //       "text-max-width": 400,
    //     },
    //     paint: {
    //       "icon-opacity": 1,
    //       "text-color": "white",
    //       "text-halo-color": "black",
    //       "text-halo-width": 1,
    //     },
    //     filter: ["==", ["get", "type"], "站点"],
    //   });

    //   let feathers = [];
    //   for (let j = 0; j < 30; j++) {
    //     for (let i = 0; i < 20; i++) {
    //       const pt = turf.destination(
    //         turf.point([101.91223724839354, 36.548604620850995]),
    //         45 + 1000 * i,
    //         j * 10,
    //         {
    //           units: "meters",
    //         }
    //       );
    //       let speed = Math.random() * 60;
    //       feathers.push({
    //         type: "Feature",
    //         geometry: {
    //           type: "Point",
    //           coordinates: pt.geometry?.coordinates,
    //         },
    //         properties: {
    //           type: "风羽",
    //           风速: speed,
    //           image: "feather" + getFeather(speed),
    //           风向: 45,
    //         },
    //       });
    //     }
    //   }
    //   map.addLayer({
    //     id: "绘制风羽",
    //     type: "symbol",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: feathers,
    //       },
    //     },
    //     layout: {
    //       visibility: props.feather ? "visible" : "none",
    //       // This icon is a part of the Mapbox Streets style.
    //       // To view all images available in a Mapbox style, open
    //       // the style in Mapbox Studio and click the "Images" tab.
    //       // To add a new image to the style at runtime see
    //       // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
    //       "icon-anchor": ["match", ["get", "风速"], 0, "center", "bottom-left"],
    //       "icon-image": ["get", "image"],
    //       "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
    //       "icon-rotate": ["get", "风向"],
    //       "icon-rotation-alignment": "map",
    //       "icon-allow-overlap": true,
    //       "icon-ignore-placement": true,
    //       // "text-field": ["get", "风速"],
    //       // "text-font": ["simkai"],
    //       // "text-size": 14,
    //       // "text-transform": "uppercase",
    //       // // "text-letter-spacing": 0.05,
    //       // "text-anchor": "center",
    //       // "text-line-height": 1,
    //       // // "text-justify": "center",
    //       // "text-offset": [0, 0],
    //       // "text-ignore-placement": true,
    //       // "text-allow-overlap": true,
    //       // "text-rotation-alignment": "map",
    //     },
    //     paint: {
    //       "icon-opacity": setting.feather ? 1 : 0,
    //     },
    //     filter: ["==", ["get", "type"], "风羽"],
    //   });

    //   let circleFeaturesData.features = [];
    //   let pointFeatures = [];
    //   for (let i = 1; i <= 10; i++) {
    //     let circle = Circle([102.04150296221326, 36.530313361869744], i * 1000, {
    //       steps: 360,
    //       units: "meters",
    //     });
    //     circleFeaturesData.features.push(circle);

    //     let pts: any = [];
    //     const pt1 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       0,
    //       { units: "meters" }
    //     );
    //     const pt2 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       90,
    //       { units: "meters" }
    //     );
    //     const pt3 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       180,
    //       { units: "meters" }
    //     );
    //     const pt4 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       270,
    //       { units: "meters" }
    //     );
    //     pts.push(
    //       pt1.geometry?.coordinates,
    //       pt2.geometry?.coordinates,
    //       pt3.geometry?.coordinates,
    //       pt4.geometry?.coordinates
    //     );
    //     pointFeatures.push({
    //       type: "Feature",
    //       geometry: {
    //         type: "MultiPoint",
    //         coordinates: pts,
    //       },
    //       properties: {
    //         units: i + "km",
    //       },
    //     });
    //   }
    //   let marker = new Marker({
    //     draggable: false,
    //     pitchAlignment: "map",
    //     rotationAlignment: "map",
    //   }).setLngLat([102.04150296221326, 36.530313361869744]);
    //   marker.addTo(map);
    //   marker.remove();
    //   map.addLayer({
    //     id: "等距环",
    //     type: "line",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: circleFeaturesData.features,
    //       },
    //     },
    //     layout: {
    //       visibility: props.equidistantRing ? "visible" : "none",
    //     },
    //     paint: {
    //       "line-color": "#000",
    //       "line-width": 2,
    //       "line-dasharray": [2, 2],
    //     },
    //   });
    //   map.addLayer({
    //     id: "等距环的单位",
    //     type: "symbol",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: pointFeatures,
    //       },
    //     },
    //     layout: {
    //       visibility: props.equidistantRing ? "visible" : "none",
    //       "text-field": ["get", "units"],
    //       "text-font": ["simkai"],
    //       "text-size": 14,
    //       "text-anchor": "bottom-left",
    //       "text-allow-overlap": true,
    //       "text-ignore-placement": true,
    //       "text-rotation-alignment": "map",
    //       "text-pitch-alignment": "map",
    //     },
    //     paint: {
    //       "text-color": "white",
    //       "text-halo-color": "black",
    //       "text-halo-width": 1,
    //     },
    //   });
    //   map.addLayer({
    //     id: "绘制空域",
    //     type: "line",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "Feature",
    //         properties: {},
    //         geometry: {
    //           type: "LineString",
    //           coordinates: [
    //             [-122.48369693756104, 37.83381888486939],
    //             [-122.48348236083984, 37.83317489144141],
    //             [-122.48339653015138, 37.83270036637107],
    //             [-122.48356819152832, 37.832056363179625],
    //             [-122.48404026031496, 37.83114119107971],
    //             [-122.48404026031496, 37.83049717427869],
    //             [-122.48348236083984, 37.829920943955045],
    //             [-122.48356819152832, 37.82954808664175],
    //           ],
    //         },
    //       },
    //     },
    //     layout: {
    //       "line-cap": "round",
    //       "line-join": "round",
    //     },
    //     paint: {
    //       "line-color": "#f00",
    //       "line-width": {
    //         base: 2,
    //         stops: [
    //           [4, 2], // 线宽为2像素
    //           [22, 1000], // 线宽为10像素
    //         ],
    //       },
    //     },
    //   });
    // });
    // const points = turf.randomPoint(50, { bbox: [100, 35, 103, 38] });
    // points.features.forEach(
    //   (pt: any) => (pt.properties.elevation = Math.random() * 1000)
    // );
    // const grid = turf.interpolate(points, 0.04, {
    //   gridType: "point", // 以点为基础进行插值
    //   property: "elevation", // 从点的属性中提取值
    //   units: "degrees", // 单位
    //   weight: 5, // 使用反距离加权进行插值
    // });
    // const isobands = turf.isobands(grid, [NaN, ...breaks], {
    //   zProperty: "elevation",
    // });
    // map.addLayer({
    //   id: "isobands-layer",
    //   type: "fill",
    //   source: {
    //     type: "geojson",
    //     data: isobands,
    //   },
    //   layout: {},
    //   paint: {
    //     "fill-color": ["match", ["get", "elevation"], ...fillColors, "transparent"],
    //     "fill-opacity": 0.5,
    //   },
    // });
    // console.log(isobands);
    // const isolines = turf.isolines(grid, [NaN, ...breaks], {
    //   zProperty: "elevation",
    // });
    // map.addLayer({
    //   id: "isolines-layer",
    //   type: "line",
    //   source: {
    //     type: "geojson",
    //     data: isolines,
    //   },
    //   layout: {},
    //   paint: {
    //     "line-color": ["match", ["get", "elevation"], ...strokeColors, "transparent"],
    //     "line-width": 1,
    //     "line-opacity": 1,
    //   },
    // });

    //模拟飞机移动
    // timer = setInterval(() => {
    //   let source = map.getSource("模拟飞机");
    //   if (source) {
    //     let data = source.serialize().data;
    //     data.features.map((item: any) => {
    //       let coordinates = item.geometry.coordinates;
    //       let deg = item.properties.fHeading;
    //       let speed = item.properties.speed;
    //       const pt = turf.destination(turf.point(coordinates), speed, deg, {
    //         units: "meters",
    //       });
    //       item.geometry.coordinates = pt.geometry?.coordinates;
    //     });
    //     source.setData(data);
    //   }
    // }, 1000);
    if(false){
      contour2(map,{
        isobands:props.isobands,
        isolines:props.isolines,
        gridValue:props.gridValue,
        gridPoint:props.gridPoint,
        discrete:props.zdz
      })
    }else{
      contour(map,{
        isobands:props.isobands,
        isolines:props.isolines,
        gridValue:props.gridValue,
        gridPoint:props.gridPoint
      })
    }
    map.setPaintProperty("land","background-color",
      [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        `rgba(${setting.人影.监控.landColor.r},${setting.人影.监控.landColor.g},${setting.人影.监控.landColor.b},${setting.人影.监控.landColor.a})`,
        11,
        `rgba(${setting.人影.监控.landColor.r},${setting.人影.监控.landColor.g},${setting.人影.监控.landColor.b},${setting.人影.监控.landColor.a})`,
      ]
    )
    map.addLayer({
      "id": "roadLayer",
      "type": "raster",
      "source": "raster-road",
      "minzoom": 0,
      "maxzoom": 22,
      layout:{
        visibility:setting.人影.监控.roadMap ? 'visible' : 'none'
      }
    })
    // map.addLayer(CustomLayer)
    // map.addLayer(new Plane())
    // map.addLayer(new PointLayer())
    烟炉数据().then((res:any)=>{
      for(let item of res.data.results){
        const pos = fromDMS(item.tagPos)
        stoveFeaturesData.features.push({
          type: "Feature",
          properties: {
            strStoveID: item.strStoveID,
            name: item.strName,
            "icon-image": "stove",
            tags:['烟炉'],
            tag:setting.人影.监控.zydTag
          },
          geometry: {
            type: "Point",
            coordinates: pos,
          },
        });
        map.setFeatureState({source:'stoveSource',id:item.strStoveID},item)
      }
      map.getSource('stoveSource').setData(stoveFeaturesData)
    })
  });
  map.on('draw.create',(e)=>{
    e.features.map((feature:any)=>{
      draw.add(feature)
    })
    map.getCanvas().style.cursor = "default";
  })
  map.on('draw.update',(e)=>{
    console.log(e)
  })
  map.on('draw.modechange', function(e) {
    setting.绘制模式 = e.mode
  });
  map.on("click",(e)=>{
    if(setting.获取经纬度){
      setting.获取经纬度 = false
      map.getCanvas().style.cursor = "default";
      const dms = toDMS(e.lngLat.lng,e.lngLat.lat)
      const customMarkerElement = document.createElement('div');
      customMarkerElement.className = 'custom-marker'; // 自定义类名
      customMarkerElement.innerHTML = `
        <div class="marker-content position">
          <span>
          ${dms}
          </span>
          <svg>
            <path d="M0,0 L5,5 10,0"/>
          </svg>
        </div>
      `;
      const marker = new mapboxgl.Marker({
        element:customMarkerElement,
        anchor: "bottom",
        offset:[0,-4]
      })
        .setLngLat([e.lngLat.lng,e.lngLat.lat])
        .addTo(map);
      marker.getElement().addEventListener('click', () => {
        marker.remove()
      });
    }
  })
  map.on('mouseenter', '飞机', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', '飞机', () => {
    map.getCanvas().style.cursor = 'default';
  });

  let 原来的鼠标样式 = 'default'
  map.on('mouseenter', 'zydLayer', () => {
    原来的鼠标样式 = map.getCanvas().style.cursor
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'zydLayer', () => {
    map.getCanvas().style.cursor = 原来的鼠标样式
  });
  map.on('click','飞机',function(e){
    const features = e.features;
    if (!features || features.length === 0) return;

    const props = features[0].properties;
    const coordinates = features[0].geometry.coordinates.slice();


    let ryPlane = null;
    for(let i=0;i<setting.人影.监控.需要重点关注的飞机.length;i++){
      const item = setting.人影.监控.需要重点关注的飞机[i]
      if(item.iAddress == props.unSsrCode){
        ryPlane = item
      }
    }
    if(!ryPlane){
      return;
    }


    // (beginDateTime:string,endDateTime:string,unSsrCode:number,uiTrackNo:number)
    getTrack(ryPlane.dtRegTime,moment().format('YYYY-MM-DD HH:mm:ss'),props.unSsrCode,'').then(({data})=>{
      /*
      data.forEach((item:any)=>{
        for(let j=0;j<trackLinesFeaturesData.features.length;j++){
          if(trackLinesFeaturesData.features[j].properties.uiTrackNo == item.uiTrackNo && trackLinesFeaturesData.features[j].properties.unSsrCode == item.unSsrCode){
            trackLinesFeaturesData.features[j].properties.active = !trackLinesFeaturesData.features[j].properties.active
            trackLinesFeaturesData.features[j].geometry.coordinates = []
            item.tracks.forEach(it=>{
              trackLinesFeaturesData.features[j].geometry.coordinates.push(wgs84togcj02(it.fLongitude,it.fLatitude))
            })
          }
        }
      })
      map?.getSource('track')?.setData(trackLinesFeaturesData)
      */



      data.forEach(item=>{
        for(let j=0;j<trackPointsFeaturesData.features.length;j++){
          if(trackPointsFeaturesData.features[j].properties.uiTrackNo == item.uiTrackNo && trackPointsFeaturesData.features[j].properties.unSsrCode == item.unSsrCode){
            trackPointsFeaturesData.features[j].properties.active = !trackPointsFeaturesData.features[j].properties.active
            trackPointsFeaturesData.features[j].geometry.coordinates = []
            item.tracks.forEach(it=>{
              trackPointsFeaturesData.features[j].geometry.coordinates.push(wgs84togcj02(it.fLongitude,it.fLatitude))
            })
          }
        }
      })
      map?.getSource('trackPoint')?.setData(trackPointsFeaturesData)
    })













  })
  map.on("zoom", zoomFunc);
  map.on("pitch", pitchFunc);
  map.on("move", moveFunc);
  map.on("bearing", bearingFunc);
  map.on("mousemove", mousemoveFunc)
  eventbus.on("人影-将站点移动到屏幕中心", flyTo);
  eventbus.on("人影-地面作业申请-网络上报", 网络上报);
  eventbus.on("人影-飞机位置", 处理飞机实时位置);
  eventbus.on("移除draw绘制的所有图形",移除draw绘制的所有图形)
});
onBeforeUnmount(() => {
  if(map){
    document.removeEventListener("keydown", keydownFunc);
    cancelAnimationFrame(aid)
    console.log("onBeforeUnmount");
    clearInterval(timer);
    clearInterval(adsbTimer);
    clearInterval(sixMinutesTimer);
    clearInterval(fifteenMinutesTimer);
    clearInterval(threeMinutesTimer);
    clearInterval(fpsTimer);
    eventbus.off("人影-将站点移动到屏幕中心", flyTo);
    eventbus.off("人影-地面作业申请-网络上报", 网络上报);
    eventbus.off("人影-飞机位置", 处理飞机实时位置);
    eventbus.off("移除draw绘制的所有图形",移除draw绘制的所有图形)
    map.off("zoom", zoomFunc);
    map.off("move", moveFunc);
    map.off("pitch", pitchFunc);
    map.off("bearing", bearingFunc);
    map.off("mousemove", mousemoveFunc)
    map.remove();
    map = undefined
  }
});
let LAT = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI;
const baseTileData = {
  attribution: null,
  attribution2:
    '<a href="https://www.mapbox.com/about/maps/" target="_blank" title="Mapbox" aria-label="Mapbox">&copy; Mapbox</a> <a href="https://www.openstreetmap.org/about/" target="_blank" title="OpenStreetMap" aria-label="OpenStreetMap">&copy; OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/contribute/" target="_blank" title="Improve this map" aria-label="Improve this map">Improve this map</a> <a href="https://www.maxar.com/" target="_blank" title="Maxar" aria-label="Maxar">&copy; Maxar</a>',
  autoscale: true,
  bounds: [-180, -LAT, 180, LAT],
  cacheControl: "max-age=43200,s-maxage=2592000",
  center: [0, 0, 3],
  created: 1358310600000,
  id: "mapbox.satellite",
  mapbox_logo: false,
  maxzoom: 22,
  minzoom: 0,
  modified: 1614877124000,
  name: "Mapbox Satellite",
  private: false,
  scheme: "xyz",
  tilejson: "2.2.0",
  tiles: new Array<string>(),
  webpage: "https://dev-studio.tilestream.net/tilesets/mapbox.satellite",
};
function processTileData(tiles = new Array<string>()) {
  baseTileData.tiles = tiles;
  return URL.createObjectURL(
    new File([JSON.stringify(baseTileData)], Math.random() + ".json", {
      type: "application/json",
    })
  );
}
watch(()=>setting.人影.监控.selectedRegion,(newVal,oldVal)=>{
  if(oldVal==undefined){
    oldVal = []
  }
  oldVal.forEach((item:string)=>{
    if(!newVal.includes(item)){
      map.removeLayer(`${item}.json`)
      map.removeSource(`${item}.json`)
    }
  })
  newVal.forEach((item:string)=>{
    if(!oldVal.includes(item)){
      axios.get(`/backend/region/${item}.json`).then(res=>{
        map.addLayer({
          'id': `${item}.json`,
          'type': 'line',
          'source': {
            "type":"geojson",
            "data": res.data
          },
          'layout': {
            'visibility':'visible',
            'line-join':'round',
            'line-cap':'round',
          },
          'paint': {
            'line-color': '#fff',
            'line-width': 5,
            'line-opacity':1,
          }
        })
      })
    }
  })
},{deep:true,immediate:true})
watch(()=>setting.人影.监控.checkedKeys,(val)=>{
  dialogOptions.menus = 作业点原始数据.filter((item:any)=>{
    for(let i=0;i<val.length;i++){
      if(item.strID.startsWith(val[i])){
        return true
      }
    }
    return false
  });
  const features = zydFeaturesData.features.filter((feature:any)=>{
    for(let i=0;i<val.length;i++){
      if(feature.properties.strID.startsWith(val[i])){
        return true
      }
    }
    return false
  })
  map?.getSource('zydSource')?.setData({
    type:'FeatureCollection',
    features,
  })
})
watch(()=>setting.人影.监控.test,(val)=>{
  if(map.getLayer('testLayer')){
    map.setLayoutProperty('testLayer','visibility',val?'visible':'none')
  }
  if(map.getLayer('testLabelLayer')){
    map.setLayoutProperty('testLabelLayer','visibility',val?'visible':'none')
  }
})
watch(()=>setting.人影.监控.北京保障圈,(val)=>{
  map.setLayoutProperty('line1','visibility',val?'visible':'none')
  map.setLayoutProperty('line2','visibility',val?'visible':'none')
  map.setLayoutProperty('line3','visibility',val?'visible':'none')
  map.setLayoutProperty('line4','visibility',val?'visible':'none')
  const layers = map.getStyle().layers
  layers.forEach(layer=>{
    if(layer.id.startsWith('line-layer')){
      map.setLayoutProperty(layer.id,'visibility',setting.人影.监控.北京保障圈?'visible':'none')
    }
  })
})
watch(()=>setting.人影.监控.ryPlane,(val)=>{
  map.setFilter('飞机',val?['==', ['get', 'icon'], 'airplaneMock']:['all'])
  map.setFilter('飞机气泡图层',val?['==', ['get', 'icon'], 'airplaneMock']:['all'])
})
watch(()=>setting.人影.监控.zydTag,(zydTag)=>{
  map.setFilter('zydLayer', ['any',...zydTag.map(tag=>['in', tag, ['get', 'tags']])]);
  map.setFilter('textLayer', ['any',...zydTag.map(tag=>['in', tag, ['get', 'tags']])]);
  map.setFilter('stoveLayer', ['any',...zydTag.map(tag=>['in', tag, ['get', 'tags']])]);
},{deep:true})
watch(()=>setting.人影.监控.正西,(val)=>{
  const layers = map.getStyle().layers
  layers.forEach((layer:any)=>{
    if(layer.id.startsWith('main_arrive')||layer.id.startsWith('main_workline')||layer.id.startsWith('main_leave')){
      map.setLayoutProperty(layer.id,'visibility',setting.人影.监控.规划航线&&val?'visible':'none')
    }
  })
  if(map.getLayer('军用机场图层_main')){
    map.setLayoutProperty('军用机场图层_main','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
  if(map.getLayer('text-layer1')){
    map.setLayoutProperty('text-layer1','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
  if(map.getLayer('polygon-fill')){
    map.setLayoutProperty('polygon-fill','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
})
watch(()=>setting.人影.监控.西北,(val)=>{
  const layers = map.getStyle().layers
  if(map.getLayer('standby_polygon-fill')){
    map.setLayoutProperty('standby_polygon-fill','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
  layers.forEach((layer:any)=>{
    if(layer.id.startsWith('standby_arrive')||layer.id.startsWith('standby_workline')||layer.id.startsWith('standby_leave')){
      map.setLayoutProperty(layer.id,'visibility',setting.人影.监控.规划航线&&val?'visible':'none')
    }
  })
  if(map.getLayer('军用机场图层standby')){
    map.setLayoutProperty('军用机场图层standby','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
  if(map.getLayer('text-layer2')){
    map.setLayoutProperty('text-layer2','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
})
watch(()=>setting.人影.监控.西南,(val)=>{
  const layers = map.getStyle().layers
  if(map.getLayer('three_polygon-fill')){
    map.setLayoutProperty('three_polygon-fill','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
  layers.forEach((layer:any)=>{
    if(layer.id.startsWith('three_arrive')||layer.id.startsWith('three_workline')||layer.id.startsWith('three_leave')){
      map.setLayoutProperty(layer.id,'visibility',setting.人影.监控.规划航线&&val?'visible':'none')
    }
  })
  if(map.getLayer('军用机场图层three_plan')){
    map.setLayoutProperty('军用机场图层three_plan','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
  if(map.getLayer('text-layer3')){
    map.setLayoutProperty('text-layer3','visibility',setting.人影.监控.规划航线&&val?'visible':'none')
  }
})
watch(()=>setting.人影.监控.规划航线,()=>{
  const layers = map.getStyle().layers
  if(setting.人影.监控.正西){
    layers.forEach((layer:any)=>{
      if(layer.id.startsWith('main_arrive')||layer.id.startsWith('main_workline')||layer.id.startsWith('main_leave')){
        map.setLayoutProperty(layer.id,'visibility',setting.人影.监控.规划航线?'visible':'none')
      }
    })
    if(map.getLayer('军用机场图层_main')){
      map.setLayoutProperty('军用机场图层_main','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
    if(map.getLayer('text-layer1')){
      map.setLayoutProperty('text-layer1','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
    if(map.getLayer('polygon-fill')){
      map.setLayoutProperty('polygon-fill','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
  }
  if(setting.人影.监控.西北){
    if(map.getLayer('standby_polygon-fill')){
      map.setLayoutProperty('standby_polygon-fill','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
    layers.forEach((layer:any)=>{
      if(layer.id.startsWith('standby_arrive')||layer.id.startsWith('standby_workline')||layer.id.startsWith('standby_leave')){
        map.setLayoutProperty(layer.id,'visibility',setting.人影.监控.规划航线?'visible':'none')
      }
    })
    if(map.getLayer('军用机场图层standby')){
      map.setLayoutProperty('军用机场图层standby','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
    if(map.getLayer('text-layer2')){
      map.setLayoutProperty('text-layer2','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
  }
  if(setting.人影.监控.西南){
    if(map.getLayer('three_polygon-fill')){
      map.setLayoutProperty('three_polygon-fill','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
    layers.forEach((layer:any)=>{
      if(layer.id.startsWith('three_arrive')||layer.id.startsWith('three_workline')||layer.id.startsWith('three_leave')){
        map.setLayoutProperty(layer.id,'visibility',setting.人影.监控.规划航线?'visible':'none')
      }
    })
    if(map.getLayer('军用机场图层three_plan')){
      map.setLayoutProperty('军用机场图层three_plan','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
    if(map.getLayer('text-layer3')){
      map.setLayoutProperty('text-layer3','visibility',setting.人影.监控.规划航线?'visible':'none')
    }
  }
})
watch(()=>setting.人影.监控.基本站,(val)=>{
  setting.人影.监控.基本站 && 基本站().then(({data})=>{
    map.getSource('wms-source1').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
  }).catch(e=>{
    console.log(e)
  })
  if(val){
    map.setLayoutProperty('wms-layer1','visibility','visible')
  }else{
    map.setLayoutProperty('wms-layer1','visibility','none')
  }
})
watch(()=>setting.人影.监控.一般站,(val)=>{
  setting.人影.监控.一般站 && 一般站().then(({data})=>{
    map.getSource('wms-source2').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
  }).catch(e=>{
    console.log(e)
  })
  if(val){
    map.setLayoutProperty('wms-layer2','visibility','visible')
  }else{
    map.setLayoutProperty('wms-layer2','visibility','none')
  }
})
watch(()=>setting.人影.监控.区域站,(val)=>{
  setting.人影.监控.区域站 && 区域站().then(({data})=>{
    map.getSource('wms-source3').setTiles([`/geoserver/wms?service=WMS&request=GetMap&version=1.3.0&layers=${data.layerName}&styles=rain_shape&format=image/png&transparent=true&data=1753148119386&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`])
  }).catch(e=>{
    console.log(e)
  })
  if(val){
    map.setLayoutProperty('wms-layer3','visibility','visible')
  }else{
    map.setLayoutProperty('wms-layer3','visibility','none')
  }
})
watch(()=>setting.人影.监控.注册飞机数据,(registeredPlane)=>{
  airplanesData.features.map((feature,key)=>{
    registeredPlane.map((item)=>{
      if(feature.properties.unSsrCode == item.address){
        airplanesData.features[key].properties.icon = 'airplaneMock'
      }
    })
  })
  map?.getSource("飞机原数据")?.setData(airplanesData);
},{
  deep:true
})
watch(()=>setting.人影.监控.roadMap,(val)=>{
  map.setLayoutProperty('roadLayer','visibility',val?'visible':'none')
})
watch(()=>setting.人影.监控.红外云图,(val)=>{
  setting.人影.监控.红外云图&&红外云图().then(async({data}:any)=>{
    setting.人影.监控.色标.length = 0
    if(data.legendData.vals){
      data.legendData.vals.forEach((item:number,key:number)=>setting.人影.监控.色标.push({value:item,color:data.legendData.colors[key]}))
    }
    const extent = data.extent.split(',').map(Number)
    // const imageUrl = await getImage(data.data,extent)
    const obj = {
      url: data.data,
      coordinates: [
        [extent[0], extent[3]],
        [extent[2], extent[3]],
        [extent[2], extent[1]],
        [extent[0], extent[1]],
      ]
    }
    if(map){
      const source = map.getSource(map.getLayer('overlay-layer1').source)
      source.updateImage(obj)
    }
  }).catch((err=>{
    console.log(err)
  }))
  map.getLayer('overlay-layer1')&&map.setLayoutProperty('overlay-layer1','visibility',val?'visible':'none')
})
watch(()=>setting.人影.监控.真彩图,(val)=>{
  setting.人影.监控.真彩图&&真彩图().then(async({data}:any)=>{
    setting.人影.监控.色标.length = 0
    if(data.legendData.vals){
      data.legendData.vals.forEach((item:number,key:number)=>setting.人影.监控.色标.push({value:item,color:data.legendData.colors[key]}))
    }
    const extent = data.extent.split(',').map(Number)
    // const imageUrl = await getImage(data.data,extent)
    const obj = {
      url: data.data,
      coordinates: [
        [extent[0], extent[3]],
        [extent[2], extent[3]],
        [extent[2], extent[1]],
        [extent[0], extent[1]],
      ]
    }
    if(map){
      const source = map.getSource(map.getLayer('overlay-layer5').source)
      source.updateImage(obj)
    }
  }).catch((err=>{
    console.log(err)
  }))
  map.getLayer('overlay-layer5')&&map.setLayoutProperty('overlay-layer5','visibility',val?'visible':'none')
})
watch(()=>setting.人影.监控.组合反射率,(val)=>{
  setting.人影.监控.组合反射率 && 组合反射率().then(async({data}:any)=>{
    setting.人影.监控.色标.length = 0
    if(data.legendData.vals){
      data.legendData.vals.forEach((item:number,key:number)=>setting.人影.监控.色标.push({value:item,color:data.legendData.colors[key]}))
    }
    const extent = data.extent.split(',').map(Number)
    const imageUrl = await getImage(data.data,extent)
    const obj = {
      url: imageUrl,
      coordinates: [
        [extent[0], extent[3]],
        [extent[2], extent[3]],
        [extent[2], extent[1]],
        [extent[0], extent[1]],
      ]
    }
    if(map){
      const source = map.getSource(map.getLayer('overlay-layer2').source)
      source.updateImage(obj)
    }
  }).catch(err=>{
    console.log(err)
  })
  map.getLayer('overlay-layer2')&&map.setLayoutProperty('overlay-layer2','visibility',val?'visible':'none')
})
watch(()=>setting.人影.监控.CMPAS降水融合3km,(val)=>{
  setting.人影.监控.CMPAS降水融合3km && CMPAS降水融合3km().then(async({data}:any)=>{
    setting.人影.监控.色标.length = 0
    if(data.legendData.vals){
      data.legendData.vals.forEach((item:number,key:number)=>setting.人影.监控.色标.push({value:item,color:data.legendData.colors[key]}))
    }
    const extent = data.extent.split(',').map(Number)
    const imageUrl = await getImage(data.data,extent)
    const obj = {
      url: imageUrl,
      coordinates: [
        [extent[0], extent[3]],
        [extent[2], extent[3]],
        [extent[2], extent[1]],
        [extent[0], extent[1]],
      ]
    }
    if(map){
      const source = map.getSource(map.getLayer('overlay-layer3').source)
      source.updateImage(obj)
    }
  }).catch(err=>{
    console.log(err)
  })
  map.getLayer('overlay-layer3')&&map.setLayoutProperty('overlay-layer3','visibility',val?'visible':'none')
})
watch(()=>setting.人影.监控.睿图雷达,(val)=>{
  setting.人影.监控.睿图雷达 && 睿图雷达().then(async({data}:any)=>{
    setting.人影.监控.色标.length = 0
    if(data.legendData.vals){
      data.legendData.vals.forEach((item:number,key:number)=>setting.人影.监控.色标.push({value:item,color:data.legendData.colors[key]}))
    }
    const extent = data.extent.split(',').map(Number)
    const imageUrl = await getImage(data.data,extent)
    const obj = {
      url: imageUrl,
      coordinates: [
        [extent[0], extent[3]],
        [extent[2], extent[3]],
        [extent[2], extent[1]],
        [extent[0], extent[1]],
      ]
    }
    if(map){
      const source = map.getSource(map.getLayer('overlay-layer4').source)
      source.updateImage(obj)
    }
  }).catch(err=>{
    console.log(err)
  })
  map.getLayer('overlay-layer4')&&map.setLayoutProperty('overlay-layer4','visibility',val?'visible':'none')
})
watch([()=>setting.人影.监控.飞机高度下限,()=>setting.人影.监控.飞机高度上限,()=>setting.人影.监控.二次码下限,()=>setting.人影.监控.二次码上限],()=>{
  trackFeatures.map((item)=>{
    if(过滤({altitude:item.properties.iAltitudeADS,ssrCode:item.properties.unSsrCode})){
      item.properties.opacity = 0.5
    }else{
      item.properties.opacity = 0
    }
  })
  map?.getSource("trackSource")?.setData({
    type: "FeatureCollection",
    features: trackFeatures,
  })
  map?.getSource("airplaneSource")?.setData(airplanesData)
})
watch(()=>setting.人影.监控.track,()=>{
  if(setting.人影.监控.track){
    if(setting.人影.监控.plane){
      map.setLayoutProperty('track','visibility','visible')
      map.setLayoutProperty('trackPoint','visibility','visible')
    }
    if(setting.人影.监控.adsb){
      map.setLayoutProperty('adsbTrackLayer','visibility','visible')
    }
  }else{
    map.setLayoutProperty('track','visibility','none')
    map.setLayoutProperty('trackPoint','visibility','none')
    map.setLayoutProperty('adsbTrackLayer','visibility','none')
  }
})
watch(()=>setting.人影.监控.planeLabel,()=>{
  if(setting.人影.监控.planeLabel){
    if(setting.人影.监控.plane){
      map.setLayoutProperty('飞机气泡图层','visibility','visible')
    }
    if(setting.人影.监控.adsb){
      map.setLayoutProperty('adsb气泡图层','visibility','visible')
    }
  }else{
    map.setLayoutProperty('飞机气泡图层','visibility','none')
    map.setLayoutProperty('adsb气泡图层','visibility','none')
  }
})
watch(()=>setting.人影.监控.trackCount,()=>{
  for(let i=0;i<trackFeatures.length;i++){
    if(trackFeatures[i].geometry.coordinates.length>setting.人影.监控.trackCount){
      trackFeatures[i].geometry.coordinates.splice(0,trackFeatures[i].geometry.coordinates.length - setting.人影.监控.trackCount)
    }
  }
  map?.getSource("trackSource")?.setData({
    type: "FeatureCollection",
    features: trackFeatures,
  })
  for(let i=0;i<adsbTrackFeatures.length;i++){
    if(adsbTrackFeatures[i].geometry.coordinates.length>setting.人影.监控.trackCount){
      adsbTrackFeatures[i].geometry.coordinates.splice(0,adsbTrackFeatures[i].geometry.coordinates.length - setting.人影.监控.trackCount)
    }
  }
  map?.getSource("adsbTrackSource")?.setData({
    type: "FeatureCollection",
    features: adsbTrackFeatures,
  })
})
watch(()=>setting.人影.监控.landColor,()=>{
  map.setPaintProperty("land","background-color",
    [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      `rgba(${setting.人影.监控.landColor.r},${setting.人影.监控.landColor.g},${setting.人影.监控.landColor.b},${setting.人影.监控.landColor.a})`,
      11,
      `rgba(${setting.人影.监控.landColor.r},${setting.人影.监控.landColor.g},${setting.人影.监控.landColor.b},${setting.人影.监控.landColor.a})`,
    ]
  )
},{
  deep:true
})
watch(
  () => setting.人影.监控.tile,
  (tile) => {
    setting.地图列表.map(item=>{
      if(item.value==tile){
        let s = map ? map.getStyle() : style;
        s.sources["raster-tiles"].url = processTileData(item.tileData);
        s.layers.map((v: any) => {
          if (v.id == "simple-tiles") {
            v.layout.visibility =  item.tileData.length>0? "visible" : "none";
          }
        });
        map && map.setStyle(s);
      }
    })
  },
  { deep: true, immediate: true }
);
watch([() => props.zoom, () => props.center], ([zoom, center]) => {
  //无法通过监听变量的变化实时设置地图的视角
});
watch(
  () => station.人影界面被选中的设备,
  (strID) => {
    $(`#人影-${strID}`)[0]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
      inline: "center",
    });
    active();
  }
);
watch(
  () => props.gridValue,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("网格值", "visibility", "visible");
    } else {
      map.setLayoutProperty("网格值", "visibility", "none");
    }
  }
);
watch(
  () => props.gridPoint,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("网格点", "visibility", "visible");
    } else {
      map.setLayoutProperty("网格点", "visibility", "none");
    }
  }
);
watch(
  () => props.isobands,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("等值带", "visibility", "visible");
    } else {
      map.setLayoutProperty("等值带", "visibility", "none");
    }
  }
);
watch(
  () => props.isolines,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("等值线", "visibility", "visible");
      map.setLayoutProperty("等值线值", "visibility", "visible");
    } else {
      map.setLayoutProperty("等值线", "visibility", "none");
      map.setLayoutProperty("等值线值", "visibility", "none");
    }
  }
);
watch(
  () => props.zdz,
  (newVal) => {
    if (newVal) {
      map.getLayer("离散值") && map.setLayoutProperty("离散值", "visibility", "visible");
      map.getLayer("离散点") && map.setLayoutProperty("离散点", "visibility", "visible");
    } else {
      map.getLayer("离散值") && map.setLayoutProperty("离散值", "visibility", "none");
      map.getLayer("离散点") && map.setLayoutProperty("离散点", "visibility", "none");
    }
  }
);
watch(()=>setting.人影.监控.synergyZyd,(newVal)=>{
  if(map.getLayer('synergyLayer')){
    map.setLayoutProperty('synergyLayer','visibility',newVal?'visible':'none')
  }
})
watch(
  () => props.zyd,
  () => {
    const visibility = setting.人影.监控.zyd?'visible':'none'
    map.getLayer('stoveLayer')&&map.setLayoutProperty("stoveLayer", "visibility", visibility)
    map.getLayer("zydLayer")&&map.setLayoutProperty("zydLayer", "visibility", visibility)
    map.getLayer("textLayer")&&map.setLayoutProperty("textLayer", "visibility", visibility)
    map.getLayer("最大射程-line")&&map.setLayoutProperty("最大射程-line", "visibility", visibility)
    map.getLayer("最大射程-fill")&&map.setLayoutProperty("最大射程-fill", "visibility", visibility)
    map.getLayer("预警圈-line")&&map.setLayoutProperty("预警圈-line", "visibility", visibility)
  }
);
watch(
  () => setting.人影.监控.plane,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("飞机", "visibility", "visible");
      setting.人影.监控.adsb = false
    } else {
      map.setLayoutProperty("飞机", "visibility", "none");
    }
    if(setting.人影.监控.track){
      if(newVal){
        map.setLayoutProperty('track','visibility','visible')
        map.setLayoutProperty('trackPoint','visibility','visible')
      }else{
        map.setLayoutProperty('track','visibility','none')
        map.setLayoutProperty('trackPoint','visibility','none')
      }
    }
    if(setting.人影.监控.planeLabel){
      if(newVal){
        map.setLayoutProperty('飞机气泡图层','visibility','visible')
      }else{
        map.setLayoutProperty('飞机气泡图层','visibility','none')
      }
    }
  }
);
watch(
  () => setting.人影.监控.adsb,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("adsb图层", "visibility", "visible");
      setting.人影.监控.plane = false
    } else {
      map.setLayoutProperty("adsb图层", "visibility", "none");
    }
    if(setting.人影.监控.track){
      if(newVal){
        map.setLayoutProperty('adsbTrackLayer','visibility','visible')
      }else{
        map.setLayoutProperty('adsbTrackLayer','visibility','none')
      }
    }
    if(setting.人影.监控.planeLabel){
      if(newVal){
        map.setLayoutProperty('adsb气泡图层','visibility','visible')
      }else{
        map.setLayoutProperty('adsb气泡图层','visibility','none')
      }
    }
  }
);
watch(
  () => props.airport,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("机场图层", "visibility", "visible");
    } else {
      map.setLayoutProperty("机场图层", "visibility", "none");
    }
  }
);
watch(()=>setting.人影.监控.navigationStation,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("导航台图层","visibility","visible")
  }else{
    map.setLayoutProperty("导航台图层","visibility","none")
  }
})
watch(
  () => props.routeLine,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("routeLineLayer", "visibility", "visible");
    } else {
      map.setLayoutProperty("routeLineLayer", "visibility", "none");
    }
  }
);
watch(
  () => props.district,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("districtLayer", "visibility", "visible");
    } else {
      map.setLayoutProperty("districtLayer", "visibility", "none");
    }
  }
);
{//北京行政区划
  watch(
    () => setting.人影.监控.beijingOptions.district,
    (newVal) => {
      if (newVal) {
        map.setLayoutProperty("beijingLayer", "visibility", "visible");
      } else {
        map.setLayoutProperty("beijingLayer", "visibility", "none");
      }
    }
  );
  watch(
    () => setting.人影.监控.beijingOptions.districtFillOpacity,
    (newVal) => {
      map.setPaintProperty("beijingLayer",'fill-opacity', newVal);
    }
  );
  watch(()=>setting.人影.监控.beijingOptions.districtBase,(newVal)=>{
    if(newVal){
      map.setLayoutProperty("beijingLineBase", "visibility", "visible");
    }else{
      map.setLayoutProperty("beijingLineBase", "visibility", "none");
    }
  })
  watch(()=>setting.人影.监控.beijingOptions.districtBaseOpacity,(newVal)=>{
    map.setPaintProperty("beijingLineBase", "line-opacity", newVal);
  })
  watch(()=>setting.人影.监控.beijingOptions.districtLine,(newVal)=>{
    if(map.getLayer("beijingLineOver")){
      if(newVal){
        map.setLayoutProperty("beijingLineOver", "visibility", "visible");
      }else{
        map.setLayoutProperty("beijingLineOver", "visibility", "none");
      }
    }
  })
  watch(()=>setting.人影.监控.beijingOptions.districtLineOpacity,(newVal)=>{
    map.setPaintProperty("beijingLineOver", "line-opacity", newVal);
  })
  watch(
    () => setting.人影.监控.beijingOptions.districtBaseWidth,
    (newVal) => {
      map.setPaintProperty("beijingLineBase","line-width",newVal)
    }
  );
  watch(
    () => setting.人影.监控.beijingOptions.districtLineWidth,
    (newVal) => {
      map.setPaintProperty("beijingLineOver","line-width",newVal)
    }
  );
  watch(
    () => setting.人影.监控.beijingOptions.districtLineColor,
    (newVal) => {
      if(map.getLayer('beijingLineOver')){
        map.setPaintProperty("beijingLineOver","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
      }
    }
  );
  watch(
    () => setting.人影.监控.beijingOptions.districtBaseColor,
    (newVal) => {
      if(map.getLayer('beijingLineBase')){
        map.setPaintProperty("beijingLineBase","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
      }
    }
  );
  watch(
    () => setting.人影.监控.beijingOptions.districtFillColor,
    (newVal) => {
      if(map.getLayer('beijingLayer')){
        map.setPaintProperty("beijingLayer","fill-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
      }
    }
  );
}
{//江西行政区划
  watch(
    () => setting.人影.监控.sichuanOptions.district,
    (newVal) => {
      if (newVal) {
        map.setLayoutProperty("360000_full.json_fill", "visibility", "visible");
      } else {
        map.setLayoutProperty("360000_full.json_fill", "visibility", "none");
      }
    }
  );
  watch(
    () => setting.人影.监控.sichuanOptions.districtFillColor,
    (newVal) => {
      if(map.getLayer('360000_full.json_fill')){
        map.setPaintProperty("360000_full.json_fill","fill-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
      }
    }
  );
  watch(
    () => setting.人影.监控.sichuanOptions.districtFillOpacity,
    (newVal) => {
      map.setPaintProperty("360000_full.json_fill",'fill-opacity', newVal);
    }
  );
  watch(()=>setting.人影.监控.sichuanOptions.districtBase,(newVal)=>{
    if(newVal){
      map.setLayoutProperty("360000_full.json_line", "visibility", "visible");
    }else{
      map.setLayoutProperty("360000_full.json_line", "visibility", "none");
    }
  })
  watch(
    () => setting.人影.监控.sichuanOptions.districtBaseColor,
    (newVal) => {
      if(map.getLayer('360000_full.json_line')){
        map.setPaintProperty("360000_full.json_line","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
      }
    }
  )
  watch(()=>setting.人影.监控.sichuanOptions.districtBaseOpacity,(newVal)=>{
    map.setPaintProperty("360000_full.json_line", "line-opacity", newVal);
  })
  watch(
    () => setting.人影.监控.sichuanOptions.districtBaseWidth,
    (newVal) => {
      map.setPaintProperty("360000_full.json_line","line-width",newVal)
    }
  )
  watch(()=>setting.人影.监控.sichuanOptions.districtLine,(newVal)=>{
    if(map.getLayer("360000_full.json_over")){
      if(newVal){
        map.setLayoutProperty("360000_full.json_over", "visibility", "visible");
      }else{
        map.setLayoutProperty("360000_full.json_over", "visibility", "none");
      }
    }
  })
  watch(
    () => setting.人影.监控.sichuanOptions.districtLineColor,
    (newVal) => {
      map.setPaintProperty("360000_full.json_over","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
    }
  )
  watch(()=>setting.人影.监控.sichuanOptions.districtLineOpacity,(newVal)=>{
    map.setPaintProperty("360000_full.json_over", "line-opacity", newVal);
  })
  watch(
    () => setting.人影.监控.sichuanOptions.districtLineWidth,
    (newVal) => {
      map.setPaintProperty("360000_full.json_over","line-width",newVal)
    }
  );
}
watch(()=>setting.人影.监控.districtOptions.districtBase,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("districtLineBase", "visibility", "visible");
  }else{
    map.setLayoutProperty("districtLineBase", "visibility", "none");
  }
})
watch(()=>setting.人影.监控.districtOptions.districtBaseOpacity,(newVal)=>{
  map.setPaintProperty("districtLineBase", "line-opacity", newVal);
})
watch(()=>setting.人影.监控.districtOptions.districtLineOpacity,(newVal)=>{
  map.setPaintProperty("districtLineOver", "line-opacity", newVal);
})
watch(()=>setting.人影.监控.districtOptions.districtLine,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("districtLineOver", "visibility", "visible");
  }else{
    map.setLayoutProperty("districtLineOver", "visibility", "none");
  }
})
watch(
  () => setting.人影.监控.districtOptions.districtBaseWidth,
  (newVal) => {
    map.setPaintProperty("districtLineBase","line-width",newVal)
  }
);
watch(
  () => setting.人影.监控.districtOptions.districtBaseColor,
  (newVal) => {
    map.setPaintProperty("districtLineBase","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
);
watch(
  () => setting.人影.监控.districtOptions.districtLineWidth,
  (newVal) => {
    map.setPaintProperty("districtLineOver","line-width",newVal)
  }
);
watch(
  () => setting.人影.监控.districtOptions.districtLineColor,
  (newVal) => {
    if(map.getLayer("districtLineOver")){
      map.setPaintProperty("districtLineOver","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
    }
  }
);
watch(
  () => setting.人影.监控.districtOptions.districtFillColor,
  (newVal) => {
    map.setPaintProperty("districtLayer","fill-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
);
watch(
  () => setting.人影.监控.districtOptions.districtFillOpacity,
  (newVal) => {
    map.setPaintProperty("districtLayer","fill-opacity",newVal)
  }
);
watch(()=>setting.人影.监控.ryAirspaces.fill,(newVal)=>{
  if(map.getLayer('华北飞行区域area')){
    if(newVal){
      map.setLayoutProperty("华北飞行区域area","visibility","visible")
    }else{
      map.setLayoutProperty("华北飞行区域area","visibility","none")
    }
  }
})
watch(()=>setting.人影.监控.ryAirspaces.fillOpacity,(newVal)=>{
  if(map.getLayer('华北飞行区域area')){
    map.setPaintProperty("华北飞行区域area","fill-opacity",newVal)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.fillColor,(newVal)=>{
  if(map.getLayer('华北飞行区域area')){
    map.setPaintProperty("华北飞行区域area","fill-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.base,(newVal)=>{
  if(map.getLayer('华北飞行区域baseLine')){
    if(newVal){
      map.setLayoutProperty("华北飞行区域baseLine","visibility","visible")
    }else{
      map.setLayoutProperty("华北飞行区域baseLine","visibility","none")
    }
  }
})
watch(()=>setting.人影.监控.ryAirspaces.baseOpacity,(newVal)=>{
  if(map.getLayer('华北飞行区域baseLine')){
    map.setPaintProperty("华北飞行区域baseLine","line-opacity",newVal)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.baseWidth,(newVal)=>{
  if(map.getLayer('华北飞行区域baseLine')){
    map.setPaintProperty("华北飞行区域baseLine","line-width",newVal)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.baseColor,(newVal)=>{
  if(map.getLayer('华北飞行区域baseLine')){
    map.setPaintProperty("华北飞行区域baseLine","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.line,(newVal)=>{
  if(map.getLayer('华北飞行区域line')){
    if(newVal){
      map.setLayoutProperty("华北飞行区域line","visibility","visible")
    }else{
      map.setLayoutProperty("华北飞行区域line","visibility","none")
    }
  }
})
watch(()=>setting.人影.监控.ryAirspaces.lineOpacity,(newVal)=>{
  if(map.getLayer('华北飞行区域line')){
    map.setPaintProperty("华北飞行区域line","line-opacity",newVal)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.lineWidth,(newVal)=>{
  if(map.getLayer('华北飞行区域line')){
    map.setPaintProperty("华北飞行区域line","line-width",newVal)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.lineColor,(newVal)=>{
  if(map.getLayer('华北飞行区域line')){
    map.setPaintProperty("华北飞行区域line","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.lineColor,(newVal)=>{
  if(map.getLayer('华北飞行区域line')){
    map.setPaintProperty("华北飞行区域line","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.label,(newVal)=>{
  if(map.getLayer('华北飞行区域标签')){
    if(newVal){
      map.setLayoutProperty("华北飞行区域标签","visibility","visible")
    }else{
      map.setLayoutProperty("华北飞行区域标签","visibility","none")
    }
  }
})
watch(()=>setting.人影.监控.ryAirspaces.labelColor,(newVal)=>{
  if(map.getLayer('华北飞行区域标签')){
    map.setPaintProperty("华北飞行区域标签","text-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
})
watch(()=>setting.人影.监控.ryAirspaces.labelOpacity,(newVal)=>{
  if(map.getLayer('华北飞行区域标签')){
    map.setPaintProperty("华北飞行区域标签","text-opacity",newVal)
  }
})
</script>

<style scoped lang="scss">
.custom-marker{
  background:black;
}
.center{
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;
}
.menu {
  width:fit-content;
  display: none;
  background: #ffffff88;
  border-radius: 10px;
  border-top-left-radius: 4px;
  border: 1px solid var(--el-border-color);
  opacity: 1 !important;
  ul {
    cursor: default;
    display: flex;
    position: relative;
    flex-direction: column;
    padding: 5px;
    box-sizing: border-box;
    margin-top: 0;
    margin-bottom: 0;
    li {
      cursor: pointer;
      border-radius: 4px;
      position: relative;
      font-size: 16px;
      list-style: none;
      padding: 2px;
      &:hover {
        background: rgba(62, 110, 197, 1);
      }
      &:active {
        background: inherit;
      }
      &:not(:first-child) {
        margin-top: 2px;
      }
    }
  }
}

.dark .menu {
  background: #00000088;
  ul {
    cursor: default;
    display: flex;
    position: relative;
    flex-direction: column;
    padding: 5px;
    box-sizing: border-box;
    margin-top: 0;
    margin-bottom: 0;
    li:hover {
      background: rgba(62, 110, 197, 1);
    }
  }
}

.mapboxgl-ctrl-bottom-left {
  bottom: 10px !important;
  left: auto !important;
  right: 10px !important;
}
.dark .select .ep-select__wrapper {
  background-color: #2b2b2b;
}
.deviceStation_人影 {
  box-sizing: border-box;
  position: absolute;
  font-size: 14px;
  filter: drop-shadow(#00000088 0 0 1px);
  &:hover,
  &:active {
    filter: drop-shadow(#000000 4px 4px);
  }
  .connectingLine {
    position: absolute;
    height: 4px;
    z-index: -1;
    clip-path: polygon(0% 50%, 100% 100%, 100% 0%, 0% 50%);
  }
  .label {
    position: relative;
    text-shadow: 0 0 2px #fff;
    &:hover {
      cursor: pointer;
    }
    color: black;
    padding: 4px;
    background-color: #ffffff;
    border-radius: 4px;
  }
  .station {
    cursor: pointer;
    width: 32px;
    height: 32px;
    position: absolute;
    overflow: hidden;
    border: none;
    .projectile {
      width: 100%;
      height: 100%;
      background: url("/src/assets/projectile.svg") no-repeat center center;
    }
  }
}
.stationDialog{
  position: absolute;
  top:$page-padding;
  left:$page-padding;
}
::v-deep(.mapboxgl-canvas:focus) {
  outline: none;
}
// 标牌
::v-deep(.marker-content){
  padding:5px;
  --line-width:2px;
  --border-color:gray;
  border:var(--line-width) solid var(--border-color);
  border-bottom:none;
  --radius:4px;
  border-radius: var(--radius);
  --background:#2b2b2b;
  background: var(--background);
  color:white;
  position: relative;
  &.position{
    font-family: menlo;
    font-size:20px;
    --line-width:2px;
    --border-color:white;
    --background: white;
    color:black;
    &:hover{
      color:white;
    }
  }
  &:before{
    content:'';
    position: absolute;
    left:-1px;
    top:0;
    box-sizing: content-box;
    width:calc(50% - 4px);
    height:100%;
    border-bottom-left-radius: var(--radius);
    border-bottom:var(--line-width) solid var(--border-color);
    box-sizing: border-box;
  }
  &:after{
    content:'';
    position: absolute;
    right:-1px;
    top:0;
    width:calc(50% - 4px);
    height:100%;
    border-bottom-right-radius: var(--radius);
    border-bottom:var(--line-width) solid var(--border-color);
    box-sizing: border-box;
  }
  &>svg{
    position: absolute;
    left:50%;
    top:calc(100% - var(--line-width));
    transform: translateX(-50%);
    stroke:var(--border-color);
    stroke-width:var(--line-width);
    fill:var(--background);
    width:10px;
    height: 10px;
  }
  &:hover{
    background: #000;
    &>svg{
      fill: #000;
    }
  }
}
.mapboxContainer{
  // background:linear-gradient(136.36deg, #3390C4 4.86%, #1D1252 94.85%);
  background:#d5e9fe;
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  line-height: 1;
}
.dark .mapboxContainer{
  background:radial-gradient(farthest-side ellipse at 10% 0, #0A0417 20%, #0D1635);
}
</style>