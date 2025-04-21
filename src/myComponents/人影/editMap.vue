<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <div
      v-resize="resize"
      ref="mapRef"
      class="dark:bg-#666 bg-white"
      style="
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 1;
      "
    ></div>
    <Dialog
      v-show="setting.menus"
      class="stationDialog"
      v-model:menus="dialogOptions.menus"
    ></Dialog>
    <BatchDialog v-model:batchList="batchList" v-model:pointDialogVisible="batchDialogVisible"></BatchDialog>
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
        <li @click="作业申请()">地面作业申请</li>
        <!-- <li>查看作业点信息</li> -->
        <!-- <li>人工批复</li>
        <li>人工移除</li>
        <li>手动发结束报</li> -->
      </ul>
    </div>
    <div class="menu" ref="batchMenuRef" @mousedown.stop>
      <ul>
        <li @click="批量申请()">批量申请</li>
        <!-- <li>查看作业点信息</li> -->
        <!-- <li>人工批复</li>
        <li>人工移除</li>
        <li>手动发结束报</li> -->
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
let adsbTimer:any;
const obj = {};
const adsbObj = {}
import custom_draw_line_with_distance from './CustomDrawLineWithDistance.js'
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import BatchDialog from "./batchDialog.vue";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.scss";
import styles from './drawTheme/theme.js'
import mapboxgl from 'mapbox-gl_wstd'
import menusSvg from '~/assets/menus.svg?raw'
import adsbSvg from '~/assets/adsb.svg?url'
import banSvg from '~/assets/ban.svg?url'
import planeUrl from "~/assets/飞机.svg?url";
import projectileUrl from "~/assets/projectile.svg?url";
import 导航台图标 from '~/assets/navigationStation.svg?url'
import 火箭弹图标 from '~/assets/火箭弹.svg?url'
import 高炮图标 from '~/assets/高炮.svg?url'
import popSvg from '~/assets/pop.svg?url'
import trackSvg from '~/assets/track.svg?url'
import axios from 'axios'
import { eventbus } from "~/eventbus";
import { reactive, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { planDataType,zyddataType } from "./planPanel.vue";
import PlanPanel from "./planPanel.vue";
import Dialog from "./dialog.vue";
import { addFeatherImages,View,fromDMS,toDMS } from "~/tools";
import CustomLayer from "./webglLayer/CustomLayer.js";
import airstrip from "./airstrip.js";
import { exec } from "~/api/index.js";
import {getTodayRecords,airspaceApply} from "~/api/人影/index.js"
import { loadImage2Map } from "~/tools/index.ts";
// import contour from './gridContour'
import contour from './testContour'
import contour2 from './discreteContour'
import moment from "moment";
import { wgs84togcj02 } from "~/myComponents/map/workers/mapUtil";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useSettingStore,formatUrl } from "~/stores/setting.js";
const setting = useSettingStore();
import * as turf from "@turf/turf";
const dialogOptions = reactive({ menus: [] });
const stationMenuRef = ref<HTMLDivElement>();
const batchMenuRef = ref<HTMLDivElement>();
let circleFeatures: any = [];
let forewarningFeatures: any = [];
let trackFeatures: any = [];//存放飞机尾迹
let adsbTrackFeatures: any = []//存放ADSB尾迹
const batchDialogVisible = ref(false)
let batchList = reactive([])
import {华北飞行区域,作业点,机场,作业状态数据,ADSB} from '~/api/天工'
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
]);
let 批量申请 = () => {
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
  batchList.splice(0,batchList.length)
  batchList.push(...list)
  batchDialogVisible.value = true
  $(batchMenuRef.value as HTMLDivElement).css({display:'none'})
}
let 作业申请 = () => {
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
const Map = mapboxgl.Map;
const Marker = mapboxgl.Marker;
const Popup = mapboxgl.Popup;
const NavigationControl = mapboxgl.NavigationControl;
const FullscreenControl = mapboxgl.FullscreenControl;
let timer = 0;
let taskTimer:any = 0;
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
    prevRequestShow?: boolean;
    prevRequestData?: prevRequestDataType;
    routeLine?: boolean;
    loadmap?: boolean;
    district?: boolean;
    zyd?: boolean;
    tile?: { 
      name: string,
      url: string,
      tileData: Array<string>,
    };
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
    loadmap: true,
    district: true,
    tile: () => ({
      name: "高德卫星地图",
      url: formatUrl("https://wprd01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"),
      tileData: ["https://wprd01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"],
    }),
    center: () => [0, 0],
    zoom: 4,
    pitch: 0,
    bearing: 0,
    zdz: false,
    plane: true,
    airport: false,
    isolines: true,
    isobands: true,
    gridPoint: true,
    gridValue: true,
    feather: false,
    equidistantRing: false,
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
  emits("update:zoom", map.getZoom());
};
const pitchFunc = () => {
  emits("update:pitch", map.getPitch());
};
const bearingFunc = () => {
  console.log(map.getBearing());
  emits("update:bearing", map.getBearing());
};
const moveFunc = () => {
  emits("update:center", map.getCenter());
};
function 网络上报(data:prevRequestDataType){
  airspaceApply(data).then((res:any)=>{
    console.log(res.data)
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
  //飞机航迹开始
  for(let j=0;j<d.length;j++){
    let has = false;
    for(let i=0;i<trackFeatures.length;i++){
      if(d[j]&&d[j].uiTrackNo===trackFeatures[i].properties.uiTrackNo){
        has = true;
        trackFeatures[i].properties = {...d[j],opacity:过滤({altitude:d[j].iAltitudeADS,ssrCode:d[j].unSsrCode})?1:0}
        trackFeatures[i].geometry.coordinates.push(wgs84togcj02(d[j].fLongitude,d[j].fLatitude))
        const marker = obj[trackFeatures[i].properties.uiTrackNo]
        if(marker){
          marker.setLngLat(wgs84togcj02(d[j].fLongitude,d[j].fLatitude))
          marker.getElement().querySelector('.speed').innerText = `${d[j].unSsrCode.toString(8).padStart(4,'0')}`
          过滤({altitude:d[j].iAltitudeADS,ssrCode:d[j].unSsrCode})?marker.getElement().style.display = 'block':marker.getElement().style.display = 'none'
        }
        if(trackFeatures[i].geometry.coordinates.length>setting.人影.监控.trackCount){
          trackFeatures[i].geometry.coordinates.splice(0,trackFeatures[i].geometry.coordinates.length - setting.人影.监控.trackCount)
        }
        break;
      }
    }
    if(!has){
      const customMarkerElement = document.createElement('div');
      customMarkerElement.className = 'custom-marker'; // 自定义类名
      customMarkerElement.innerHTML = `
        <div class="marker-content">
          <span class="speed">
          ${d[j].unSsrCode.toString(8).padStart(4,'0')}
          </span>
          <svg>
            <path d="M0,0 L5,5 10,0"/>
          </svg>
        </div>
      `;
      const marker = new mapboxgl.Marker({
        element:customMarkerElement,
        anchor: "bottom",
        offset:[0,-16]
      })
        .setLngLat(wgs84togcj02(d[j].fLongitude,d[j].fLatitude)) // 设置 Marker 的位置
        .addTo(map);
      marker.getElement().addEventListener('click', () => {
        marker.remove()
      });
      过滤({altitude:d[j].iAltitudeADS,ssrCode:d[j].unSsrCode})?marker.getElement().style.display = 'block':marker.getElement().style.display = 'none'
      obj[d[j].uiTrackNo] = marker
      trackFeatures.push({
        type: "Feature",
        properties: {...d[j],opacity:过滤({altitude:d[j].iAltitudeADS,ssrCode:d[j].unSsrCode})?1:0},
        geometry: {
          type: "MultiPoint",
          coordinates: [wgs84togcj02(d[j].fLongitude,d[j].fLatitude)],
        },
      })
    }
  }
  map?.getSource("trackSource")?.setData({
    type: "FeatureCollection",
    features: trackFeatures,
  })
  //飞机航迹结束
  let data = airplanesData;
  for(let j=0;j<d.length;j++){
    let has = false,i=0;
    for(;i<data.features.length;i++){
      if(d[j]&&d[j].uiTrackNo===data.features[i].properties.uiTrackNo){
        has = true;
        break;
      }
    }
    if(has){
      Object.assign(data.features[i].properties,{...d[j],opacity:过滤({altitude:d[j].iAltitudeADS,ssrCode:d[j].unSsrCode})?1:0})
      data.features[i].geometry.coordinates = wgs84togcj02(d[j].fLongitude,d[j].fLatitude)
    }else{
      if(d[j]){
        data.features.push({
          type: "Feature",
          properties: {...d[j],opacity:过滤({altitude:d[j].iAltitudeADS,ssrCode:d[j].unSsrCode})?1:0},
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
      Object.assign(data.features[i].properties,d[j],{label:(d[j].ground_speed).toFixed()+'km/h'})
      data.features[i].geometry.coordinates = wgs84togcj02(d[j].longitude,d[j].latitude)
    }else{
      if(d[j]){
        data.features.push({
          type: "Feature",
          properties: {...d[j],label:(d[j].ground_speed).toFixed()+'km/h'},
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
  map?.getSource("adsb原数据")?.setData(data);
}
const flyTo = (item: any) => {
  try {
    active();
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
  draw?.changeMode('draw_polygon')
  map.getCanvas().style.cursor = "crosshair";
}
let 获取经纬度 = false
const 经纬度 = ()=>{
  获取经纬度 = true
  map.getCanvas().style.cursor = "crosshair";
}
const 测距 = ()=>{
  draw?.changeMode('custom_draw_line_with_distance');
}
setting.zoomIn = zoomIn
setting.zoomOut = zoomOut
setting.批量操作 = 批量操作
setting.经纬度 = 经纬度
setting.测距 = 测距
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
onMounted(() => {
  document.addEventListener("keydown", keydownFunc);
  aid = requestAnimationFrame(loop)
  map = new Map({
    container: (mapRef.value as unknown) as HTMLCanvasElement,
    projection: "globe",//mercator|globe
    // style: raster,/Users/admin/Desktop/3D/mapbox-gl-js/dist/mapbox-gl.js.map
    style:style as any,
    fadeDuration: 0,
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
    zoom: props.zoom,
    center: props.center as mapboxgl.LngLatLike,
    pitch: props.pitch,
  });
  const d = new TextDecoder('gbk')
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
  map.on("load", async () => {
    adsbTimer = setInterval(()=>{
      ADSB().then(res=>{
        处理ADSB(res.data)
      })
    },5000)
    ADSB().then(res=>{
      处理ADSB(res.data)
    })
    if(!draw){
      console.log(custom_draw_line_with_distance)
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
      map.addImage('pop',image,{ sdf: true })
    }
    image.src = popSvg
    map.removeImage('airport');
    await loadImage2Map(map,banSvg,16,16,{
      airport:{
        style: 'fill:#0f0;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      }
    })
    await loadImage2Map(map,adsbSvg,16,16,{
      adsb:{
        style: 'fill:#0f0;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      }
    })
    await loadImage2Map(map,planeUrl,24,24,{
      airplane:{
        style: 'fill:yellow;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      }
    })
    await loadImage2Map(map,planeUrl,32,32,{
      airplaneMock:{
        style: 'fill:white;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      }
    })
    await loadImage2Map(map,projectileUrl,12,24,{
      'projectile-white':{
        style:"fill:white;stroke:black;stroke-width:1px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
      'projectile-red':{
        style:"fill:red;stroke:black;stroke-width:1px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      }
    })
    await loadImage2Map(map,trackSvg,8,8,{
      'trackSvg':{
        style:"fill:white;stroke:black;stroke-width:1px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      }
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
      let areas:any[] = []
      let features:any[] = []
      for(let i=0;i<res.data[0].length;i++){
        let item = res.data[0][i]
        let strPoints = d.decode(Uint8Array.from(item.points.data).buffer)
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

      map.addLayer({
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
      map.addLayer({
				'id': 'beijingBorderLineBase',
				'type': 'line',
				'source': 'beijingBorder',
				'layout': {
					'visibility':setting.人影.监控.beijingOptions.districtBase?'visible':'none',
					'line-join':'round',
					'line-cap':'round',
				},
				'paint': {
					'line-color': '#085991',
					'line-width': 20,
          'line-opacity':1,
				}
			})
      map.addLayer({
				'id': 'beijingBorderLineOver',
				'type': 'line',
				'source': 'beijingBorder',
				'layout': {
					'visibility':'visible',
					'line-join':'round',
					'line-cap':'round',
				},
				'paint': {
					'line-color': '#2387bb',
					'line-width': 6,
          'line-opacity':1,
					// 'line-dasharray': [1,1],
				}
			})
      map.addLayer({
				"id": "routeLineLayer",
				"type": "raster",
				"source": "raster-route",
				"minzoom": 0,
				"maxzoom": 22,
				layout:{
					visibility:setting.人影.监控.routeLine?'visible':'none'
				}
			})
    })
    await axios({
      method:'get',
      url:'/resources/导航台.map',
      responseType: 'arraybuffer',
    }).then(async(res)=>{
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
          let features:any[] = []
          for(let i=0;i<vecUnit.length;i++){
            features.push({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': wgs84togcj02(vecUnit[i].tagPos.dLong,vecUnit[i].tagPos.dLat)
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
            'data': {
                'type': 'FeatureCollection',
                'features':features
              }
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
    if(!map.getSource("trackSource")){
      map.addSource("trackSource", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: trackFeatures,
        },
      });
    }
    if(!map.getLayer("trackLayer")){
      map.addLayer({
        id: "trackLayer",
        type: "symbol",
        source: "trackSource",
        layout: {
          visibility: setting.人影.监控.track ? "visible" : "none",
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
      });
    }
    if(!map.getSource("adsbTrackSource")){
      map.addSource("adsbTrackSource", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: adsbTrackFeatures,
        },
      });
    }
    if(!map.getLayer("adsbTrackLayer")){
      map.addLayer({
        id: "adsbTrackLayer",
        type: "symbol",
        source: "adsbTrackSource",
        layout: {
          visibility: setting.人影.监控.track ? "visible" : "none",
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
    map.addSource("飞机原数据", {type:'geojson',data:airplanesData});
    map.addSource("adsb原数据", {type:'geojson',data:adsbData});
    map.addSource("模拟飞机", {type:'geojson',data:airplanesMockData});
    map.addLayer({
      id: "飞机",
      type: "symbol",
      source: "飞机原数据",
      layout: {
        "icon-image": "airplane",
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
      }
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
        visibility: setting.人影.监控.planeLabel?"visible":'none',
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
        visibility: setting.人影.监控.plane?"visible":"none",
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
    机场().then(res=>{
      let data = res.data[0]
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
    // map.addLayer(CustomLayer);
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
    var batchMarker = new Marker({
      element: batchMenuRef.value,
      draggable: false,
      // pitchAlignment: "map",
      // rotationAlignment: "map",
      anchor: "top-left",
    })
      .setLngLat([0, 0])
      .setOffset([0, 0])
      .addTo(map);
    // getTodayRecords().then((res:any)=>{
    //   planProps.今日作业记录 = res.data.data;
    // })
    作业点().then((res) => {
      dialogOptions.menus = res.data[0];
      let features: any = [];
      forewarningFeatures.length = 0;
      circleFeatures.length = 0;
      dialogOptions.menus.map((item: stationData) => {
        if(item.iShortAngelBegin==null){
          item.iShortAngelBegin = 0
        }
        if (item.strPos) {
          let position: [number, number] = (wgs84togcj02(...fromDMS(item.strPos)) as unknown) as [
            number,
            number
          ];
          features.push({
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
              // "icon-image": "projectile-white",
              "icon-image": "火箭弹图标",
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
          // circleFeatures.push(circle);
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
              opacity:0
            });
            circleFeatures.push(sectorPolygon);
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
              opacity:0
            });
            sectorPolygon.id = '空域'+item.strID
            circleFeatures.push(sectorPolygon);
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
            opacity:0
          });
          sectorPolygon.id = '警戒圈' + item.strID
          forewarningFeatures.push(sectorPolygon);
        }
      });
      if(!map.getSource("最大射程source")){
        map.addSource("最大射程source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: circleFeatures,
          },
        });
      }
      if(!map.getLayer('最大射程-fill')){
        map.addLayer({
          id: "最大射程-fill",
          type: "fill",
          source: "最大射程source",
          layout: {
            visibility: props.zyd ? "visible" : "none",
          },
          paint: {
            "fill-color": 'rgba(0,0,0,0.5)',
            "fill-opacity": ['get','opacity'],
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
              ["get", "ubyStatus"],
              '作业申请待批复','#0f0',
              '作业批准','#00f',
              '作业开始','#f00',
              '#fff'
            ],
            "line-width": 1,
            "line-opacity": ['get','opacity'],
            // "line-dasharray": [1, 1],
          },
        });
      }
      if(!map.getSource("警戒圈source")){
        map.addSource("警戒圈source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: forewarningFeatures,
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
              ["get", "ubyStatus"],
              '作业申请待批复','#0f0',
              '作业批准','#00f',
              '作业开始','#f00',
              '#fff'
            ],
            "line-opacity": ['get','opacity'],
            "line-width": 2,
            "line-dasharray": [4, 2],
          },
        });
      }
      if(!map.getSource("zydSource")){
        map.addSource("zydSource", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features,
          },
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
          filter: ["==", ["get", "type"], "站点"],
        });
      }
      map.on("contextmenu", "zydLayer", (e: any) => {
        e.preventDefault();
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["zydLayer"],
        });

        if (!fs.length) {
          return;
        }

        const feature = fs[0];
        station.人影界面被选中的设备 = feature.properties.strID;
        marker.setLngLat(feature.geometry.coordinates);
        $(stationMenuRef.value as HTMLDivElement).css({display:'block'});
        $(stationMenuRef.value as HTMLDivElement).removeData();
        $(stationMenuRef.value as HTMLDivElement).data(feature.properties);
      });
      map.on("contextmenu", (e: any) => {
        e.preventDefault();
        const layers = map.getStyle().layers.filter(layer => layer.id.startsWith('gl-draw')).map(layer=>layer.id)
        const fs = map.queryRenderedFeatures(e.point, { layers });
        if(fs.length>0){
          batchMarker.setLngLat([e.lngLat.lng,e.lngLat.lat]);
          $(batchMenuRef.value as HTMLDivElement).css({display:'block'});
          // $(stationMenu).removeData();
          // $(stationMenu).data(feature.properties);
        }
      });
      map.on("click", "zydLayer", (e: any) => {
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["zydLayer"],
        });
        if (!fs.length) {
          return;
        }
        const feature = fs[0];
        station.人影界面被选中的设备 = feature.properties.strID;
        active()
      });
      map.on("mousedown", () => {
        $(stationMenuRef.value as HTMLDivElement).css({display:'none'});
        $(batchMenuRef.value as HTMLDivElement).css({display:'none'});
      });
      active = () => {
        features = features.map((item: any) => {
          if (item.properties.id == station.人影界面被选中的设备) {
            item.properties["icon-image"] = "火箭弹图标";
          } else {
            item.properties["icon-image"] = "火箭弹图标";
          }
          return item;
        });
        let source = map.getSource("zydSource");
        source.setData({
          type: "FeatureCollection",
          features: features,
        });

        circleFeatures = circleFeatures.map((item: any) => {
          if (item.properties.strID == station.人影界面被选中的设备
            ||item.properties.ubyStatus == '作业申请待批复'
            ||item.properties.ubyStatus == '作业批准'
            ||item.properties.ubyStatus == '作业开始') {
            item.properties.opacity = 1;
          } else {
            item.properties.opacity = 0;
          }
          return item;
        });
        forewarningFeatures = forewarningFeatures.map((item: any) => {
          if (item.properties.strID == station.人影界面被选中的设备
            ||item.properties.ubyStatus == '作业申请待批复'
            ||item.properties.ubyStatus == '作业批准'
            ||item.properties.ubyStatus == '作业开始') {
            item.properties.opacity = 1
          } else {
            item.properties.opacity = 0
          }
          return item;
        });
        source = map.getSource("最大射程source");
        source?.setData({
          type: "FeatureCollection",
          features: circleFeatures,
        });
        source = map.getSource("警戒圈source");
        source?.setData({
          type: "FeatureCollection",
          features: forewarningFeatures,
        });
      };
    })
    let work = ()=>{
      作业状态数据().then((res) => {
        function star(feature:any,row:any){
          if(row.ubyStatus == 75||row.ubyStatus == 91){
            const millisecond = moment().diff(moment(row.tmAnswerRev,'YYYY-MM-DD HH:mm:ss'),'ms')
            feature.properties.opacity=Math.floor(millisecond / 1000) % 2
            if(millisecond>20e3){
              feature.properties.opacity = 1
            }
          }
        }
        planProps.当前作业进度 = res.data[0];
        planProps.当前作业进度.map((row: planDataType) => {

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


          for (let i = 0; i < circleFeatures.length; i++) {
            if (circleFeatures[i].properties.strID == row.strZydID) {
              circleFeatures[i].properties.ubyStatus = status2value(row.ubyStatus);
              if(row.ubyStatus!=100){//未结束的当前空域需要显示
                circleFeatures[i].properties.opacity = 1;
              }
              star(circleFeatures[i],row)
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
                circleFeatures[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
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
                // circleFeatures[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
              }
            }
          }
          for(let i=0;i<forewarningFeatures.length;i++){
            if(forewarningFeatures[i].properties.strID == row.strZydID){
              forewarningFeatures[i].properties.ubyStatus = status2value(row.ubyStatus);
              if(row.ubyStatus!=100){//未结束的当前空域需要显示
                forewarningFeatures[i].properties.opacity = 1;
              }
              star(forewarningFeatures[i],row)
            }
          }
        });
        planProps.今日作业记录 = res.data[1];
        planProps.今日作业记录.map((row:any)=>{
          row.ubySendStatus = 3//发送成功
          if(status2value(row.ubyStatus) == '作业批准' && moment(row.tmBeginAnswer).isBefore(moment())){
            row.ubyStatus = 91//作业开始
          }
          if(status2value(row.ubyStatus) == '作业申请待批复'&&moment(row.tmBeginApply).add(row.iApplyTimeLen+10*60,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          if(status2value(row.ubyStatus) == '作业开始'&&moment(row.tmBeginAnswer).add(row.iAnswerTimeLen,'s').isBefore(moment())){
            row.ubyStatus = 100
          }
          for (let i = 0; i < circleFeatures.length; i++) {
            if (circleFeatures[i].properties.strID == row.strZydID) {
              circleFeatures[i].properties.ubyStatus = status2value(row.ubyStatus);
              if(row.ubyStatus!=100){//未结束的当前空域需要显示
                circleFeatures[i].properties.opacity = 1;
              }
              star(circleFeatures[i],row)
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
                circleFeatures[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
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
                // circleFeatures[i].geometry.coordinates = sectorPolygon.geometry?.coordinates;
              }
            }
          }
          for(let i=0;i<forewarningFeatures.length;i++){
            if(forewarningFeatures[i].properties.strID == row.strZydID){
              forewarningFeatures[i].properties.ubyStatus = status2value(row.ubyStatus);
              if(row.ubyStatus!=100){//未结束的当前空域需要显示
                forewarningFeatures[i].properties.opacity = 1;
              }
              star(forewarningFeatures[i],row)
            }
          }
        })
        let source1 = map?.getSource("最大射程source");
        source1?.setData({
          type: "FeatureCollection",
          features: circleFeatures,
        });
        let source2 = map?.getSource("警戒圈source");
        source2?.setData({
          type: "FeatureCollection",
          features: forewarningFeatures,
        });
      });
    }
    taskTimer = setInterval(() => {
      work();
    }, 1000);
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

    //   let circleFeatures = [];
    //   let pointFeatures = [];
    //   for (let i = 1; i <= 10; i++) {
    //     let circle = Circle([102.04150296221326, 36.530313361869744], i * 1000, {
    //       steps: 360,
    //       units: "meters",
    //     });
    //     circleFeatures.push(circle);

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
    //         features: circleFeatures,
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
    // if (e.mode === 'simple_select') {
    //   draw.changeMode('no_select')
    // }
  });
  map.on("click",(e)=>{
    if(获取经纬度){
      获取经纬度 = false
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
  map.on("zoom", zoomFunc);
  map.on("pitch", pitchFunc);
  map.on("move", moveFunc);
  map.on("bearing", bearingFunc);
  map.on("mousemove", mousemoveFunc)
  eventbus.on("人影-将站点移动到屏幕中心", flyTo);
  eventbus.on("人影-地面作业申请-网络上报", 网络上报);
  eventbus.on("人影-飞机位置", 处理飞机实时位置);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", keydownFunc);
  cancelAnimationFrame(aid)
  console.log("onBeforeUnmount");
  clearInterval(timer);
  clearInterval(taskTimer);
  clearInterval(adsbTimer);
  eventbus.off("人影-将站点移动到屏幕中心", flyTo);
  eventbus.off("人影-地面作业申请-网络上报", 网络上报);
  eventbus.off("人影-飞机位置", 处理飞机实时位置);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("pitch", pitchFunc);
  map.off("bearing", bearingFunc);
  map.off("mousemove", mousemoveFunc)
  map.remove();
  map = undefined
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
watch([()=>setting.人影.监控.飞机高度下限,()=>setting.人影.监控.飞机高度上限,()=>setting.人影.监控.二次码下限,()=>setting.人影.监控.二次码上限],()=>{
  trackFeatures.map((item)=>{
    if(过滤({altitude:item.properties.iAltitudeADS,ssrCode:item.properties.unSsrCode})){
      item.properties.opacity = 1
    }else{
      item.properties.opacity = 0
    }
  })
  map?.getSource("trackSource")?.setData({
    type: "FeatureCollection",
    features: trackFeatures,
  })
  airplanesData.features.forEach((item)=>{
    const marker = obj[item.properties.uiTrackNo]
    if(过滤({altitude:item.properties.iAltitudeADS,ssrCode:item.properties.unSsrCode})){
      item.properties.opacity = 1
      marker.getElement().style.display = "block"
    }else{
      item.properties.opacity = 0
      marker.getElement().style.display = "none"
    }
  })
  map?.getSource("airplaneSource")?.setData(airplanesData)
})
watch(()=>setting.人影.监控.track,()=>{
  map.setLayoutProperty('trackLayer','visibility',setting.人影.监控.track?'visible':'none')
  map.setLayoutProperty('adsbTrackLayer','visibility',setting.人影.监控.track?'visible':'none')
})
watch(()=>setting.人影.监控.planeLabel,()=>{
  map.setLayoutProperty('adsb气泡图层','visibility',setting.人影.监控.planeLabel?'visible':'none')
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
  () => props.tile,
  (tile) => {
    if(tile.tileData.length>0){
      let s = map ? map.getStyle() : style;
      s.sources["raster-tiles"].url = processTileData(tile.tileData);
      // s.layers.map((v: any) => {
      //   if (v.id == "simple-tiles") {
      //     v.layout.visibility = props.loadmap ? "visible" : "none";
      //   } else if (v.id == "districtLineBase" || v.id == "districtLineOver") {
      //     // v.layout.visibility = props.district ? "visible" : "none";
      //   }
      // });
      map && map.setStyle(s);
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => props.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
  }
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
watch(
  () => props.zyd,
  (newVal) => {
    if (map.getLayer("zydLayer")) {
      newVal
        ? map.setLayoutProperty("zydLayer", "visibility", "visible")
        : map.setLayoutProperty("zydLayer", "visibility", "none");
    }
    if (map.getLayer("最大射程-line")) {
      newVal
        ? map.setLayoutProperty("最大射程-line", "visibility", "visible")
        : map.setLayoutProperty("最大射程-line", "visibility", "none");
    }
    if (map.getLayer("最大射程-fill")) {
      newVal
        ? map.setLayoutProperty("最大射程-fill", "visibility", "visible")
        : map.setLayoutProperty("最大射程-fill", "visibility", "none");
    }
    if (map.getLayer("预警圈-line")) {
      newVal
        ? map.setLayoutProperty("预警圈-line", "visibility", "visible")
        : map.setLayoutProperty("预警圈-line", "visibility", "none");
    }
  }
);
watch(
  () => props.plane,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("飞机", "visibility", "visible");
      map.setLayoutProperty("adsb图层", "visibility", "visible");
    } else {
      map.setLayoutProperty("飞机", "visibility", "none");
      map.setLayoutProperty("adsb图层", "visibility", "none");
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
watch(()=>setting.人影.监控.districtOptions.districtLine,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("districtLineOver", "visibility", "visible");
  }else{
    map.setLayoutProperty("districtLineOver", "visibility", "none");
  }
})
watch(()=>setting.人影.监控.beijingOptions.districtLine,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("beijingLineOver", "visibility", "visible");
  }else{
    map.setLayoutProperty("beijingLineOver", "visibility", "none");
  }
})
watch(()=>setting.人影.监控.beijingOptions.districtLineOpacity,(newVal)=>{
  map.setPaintProperty("beijingLineOver", "line-opacity", newVal);
})
watch(
  () => setting.人影.监控.districtOptions.districtBaseWidth,
  (newVal) => {
    map.setPaintProperty("districtLineBase","line-width",newVal)
  }
);
watch(
  () => setting.人影.监控.beijingOptions.districtBaseWidth,
  (newVal) => {
    map.setPaintProperty("beijingLineBase","line-width",newVal)
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
  () => setting.人影.监控.beijingOptions.districtLineWidth,
  (newVal) => {
    map.setPaintProperty("beijingLineOver","line-width",newVal)
  }
);
watch(
  () => setting.人影.监控.districtOptions.districtLineColor,
  (newVal) => {
    map.setPaintProperty("districtLineOver","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
);
watch(
  () => setting.人影.监控.beijingOptions.districtLineColor,
  (newVal) => {
    map.setPaintProperty("beijingLineOver","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
);
watch(
  () => setting.人影.监控.beijingOptions.districtBaseColor,
  (newVal) => {
    map.setPaintProperty("beijingLineBase","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
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
watch(
  () => setting.人影.监控.beijingOptions.districtFillColor,
  (newVal) => {
    map.setPaintProperty("beijingLayer","fill-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
  }
);
watch(()=>setting.人影.监控.ryAirspaces.fill,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("华北飞行区域area","visibility","visible")
  }else{
    map.setLayoutProperty("华北飞行区域area","visibility","none")
  }
})
watch(()=>setting.人影.监控.ryAirspaces.fillOpacity,(newVal)=>{
  map.setPaintProperty("华北飞行区域area","fill-opacity",newVal)
})
watch(()=>setting.人影.监控.ryAirspaces.fillColor,(newVal)=>{
  map.setPaintProperty("华北飞行区域area","fill-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
})
watch(()=>setting.人影.监控.ryAirspaces.base,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("华北飞行区域baseLine","visibility","visible")
  }else{
    map.setLayoutProperty("华北飞行区域baseLine","visibility","none")
  }
})
watch(()=>setting.人影.监控.ryAirspaces.baseOpacity,(newVal)=>{
  map.setPaintProperty("华北飞行区域baseLine","line-opacity",newVal)
})
watch(()=>setting.人影.监控.ryAirspaces.baseWidth,(newVal)=>{
  map.setPaintProperty("华北飞行区域baseLine","line-width",newVal)
})
watch(()=>setting.人影.监控.ryAirspaces.baseColor,(newVal)=>{
  map.setPaintProperty("华北飞行区域baseLine","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
})
watch(()=>setting.人影.监控.ryAirspaces.line,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("华北飞行区域line","visibility","visible")
  }else{
    map.setLayoutProperty("华北飞行区域line","visibility","none")
  }
})
watch(()=>setting.人影.监控.ryAirspaces.lineOpacity,(newVal)=>{
  map.setPaintProperty("华北飞行区域line","line-opacity",newVal)
})
watch(()=>setting.人影.监控.ryAirspaces.lineWidth,(newVal)=>{
  map.setPaintProperty("华北飞行区域line","line-width",newVal)
})
watch(()=>setting.人影.监控.ryAirspaces.lineColor,(newVal)=>{
  map.setPaintProperty("华北飞行区域line","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
})
watch(()=>setting.人影.监控.ryAirspaces.lineColor,(newVal)=>{
  map.setPaintProperty("华北飞行区域line","line-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
})
watch(()=>setting.人影.监控.ryAirspaces.label,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("华北飞行区域标签","visibility","visible")
  }else{
    map.setLayoutProperty("华北飞行区域标签","visibility","none")
  }
})
watch(()=>setting.人影.监控.ryAirspaces.labelColor,(newVal)=>{
  map.setPaintProperty("华北飞行区域标签","text-color",`rgba(${newVal.r},${newVal.g},${newVal.b},${newVal.a})`)
})
watch(()=>setting.人影.监控.ryAirspaces.labelOpacity,(newVal)=>{
  map.setPaintProperty("华北飞行区域标签","text-opacity",newVal)
})
</script>

<style lang="scss">
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
  left:$page-padding;
  top:$page-padding;
}
.mapboxgl-canvas:focus {
  outline: none;
}
// 标牌
.marker-content{
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
</style>
