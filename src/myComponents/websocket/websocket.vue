<template>
</template>
<script lang="ts" setup>
const 作业申请语句 = new SpeechSynthesisUtterance('收到作业申请');
const 作业批复语句 = new SpeechSynthesisUtterance('收到作业批复');
const 作业结束语句 = new SpeechSynthesisUtterance('作业结束');
const 作业撤销语句 = new SpeechSynthesisUtterance('作业已撤销');
import { onMounted, onBeforeUnmount } from "vue";
import { useBus } from "../bus";
import { eventbus } from "~/eventbus";
import Sleeper from "../zrender/sleeper";
import {useSysStatusStore} from '~/stores/sysStatus'
let countdown = 0
const sys = useSysStatusStore();
let sleeper = new Sleeper();
let bus = useBus();
class MyWebSocket extends WebSocket {
  dead: boolean = false;//不再重连
  immediate: boolean = false;//立即重连
}
let ws: MyWebSocket;
function connect() {
  ws = new MyWebSocket(
    `${window.location.protocol == "https:" ? "wss:" : "ws:"}//` + window.location.host + "/backend"
  );
  ws.onopen = function () {
    sys.触发系统菜单数据查询 = Date.now()
    sys.触发作业状态数据查询 = Date.now()
    sys.触发历史作业状态数据查询 = Date.now()
    sys.触发语音记录查询 = Date.now()
    sys.触发注册飞机查询 = Date.now()
    sys.触发完成信息查询 = Date.now()
    sys.触发网络信息查询 = Date.now()
    sys.网络状态 = "已连接"
    ws.send(JSON.stringify({ type: "login", content: Date.now()}));
    const loop = async () => {
      try {
        ws.readyState === WebSocket.OPEN &&
          ws.send(
            JSON.stringify({
              content: null,
              type: "heart1",
              user_list: [],
              clientTime1: performance.now(),
            })
          );
        await sleeper.sleep(5000);
        loop();
      } catch (e) {
        // console.log(e);
        //不做处理
      }
    };
    loop();//心跳检测
  };
  ws.onmessage = function (e) {
    var obj = JSON.parse(e.data);
    switch (obj.type) {
      case "heart2": //客户端延时
        obj.clientTime2 = performance.now();
        sys.网络状态 = (obj.clientTime2 - obj.clientTime1).toFixed(2) + "ms";
        sys.内存占用 =
          (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + "MB";
        break;
      case "heart4": //服务端延时
        // obj.type = "heart3";
        // ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(obj));
        break;
      case "handshake":
        sys.在线人数 = obj.content;
        break;
      case "login":
        break;
      case "logout":
        sys.在线人数 = obj.content;
        break;
      case "目录信息":
        console.log(obj.dirs, obj.files);
        break;
      case "目录信息改变":
        console.log(obj.event, obj.file);
        break;
      case "808定位数据":
        bus.uavData = obj;
        break;
      case "808终端离线":
        bus.uavOffline = obj;
        break;
      case "rhi":
        bus.wsData = obj;
        break;
      case "人影航迹数据":
        eventbus.emit('人影-飞机位置',obj.data.aircrafts)
        break;
      case "notify":
        const data = obj.data
        if(data.row){
          if(data.eventName=='writerows'&&data.row.ubyStatus == 72){
            speechSynthesis.cancel()
            speechSynthesis.speak(作业申请语句);
          }else if(data.eventName=='updaterows'&&data.row.before.ubyStatus == 72&&data.row.after.ubyStatus == 75){
            speechSynthesis.cancel()
            speechSynthesis.speak(作业批复语句);
          }else if(data.eventName=='updaterows'&&data.row.before.ubyStatus == 75&&data.row.after.ubyStatus == 100){
            speechSynthesis.cancel()
            speechSynthesis.speak(作业结束语句);
          }else if(data.eventName=='updaterows'&&data.row.before.ubyStatus == 72&&data.row.after.ubyStatus == 74){
            speechSynthesis.cancel()
            speechSynthesis.speak(作业撤销语句);
          }
          return
        }
        if(obj.data.tableName=='zyddata'){
          sys.触发作业状态数据查询 = Date.now()
        }else if(obj.data.tableName=='zydhisdata'){
          sys.触发历史作业状态数据查询 = Date.now()
        }else if(obj.data.tableName=='audio'){
          sys.触发语音记录查询 = Date.now()
        }else if(obj.data.tableName=='plane_addr'){
          sys.触发注册飞机查询 = Date.now()
        }else if(obj.data.tableName=='overinfo'){
          sys.触发完成信息查询 = Date.now()
        }else if(obj.data.tableName=='connection'){
          sys.触发网络信息查询 = Date.now()
        }else if(obj.data.tableName=='subusers'){
          sys.触发系统菜单数据查询 = Date.now()
        }
        // console.log(obj.data)
        break;
      default:
        // console.log(obj)
    }
    // infos.usedJSHeapSize = (performance.memory.usedJSHeapSize / 1000 / 1000).toFixed(2) + "MB";
  };
  ws.onerror = (err)=>{
    // console.log(err)
  }
  ws.onclose = function () {
    if(ws.immediate){
      ws.immediate = false
      if (!ws.dead) {
        sleeper.abort()
        sys.在线人数 = "-"
        sys.网络状态 = "重连中..."
        connect()
      }
    }else{
      countdown = 5
      sleeper.abort()
      sys.在线人数 = "-"
      if (!ws.dead) {
        reconnect()
      }
    }
  }
}
let timer:any = 0
let reconnect = ()=>{
  timer = setTimeout(() => {
    if(countdown<1){
      sleeper = new Sleeper();
      sys.网络状态 = "重连中..."
      connect();
    }else{
      sys.网络状态 = `${countdown}秒后重连`
      countdown -= 1;
      reconnect()
    }

  }, 1000);
}
function process(){
  ws.send(
    JSON.stringify({
      content: '',
      type: "获取nps数据",
      user_list: [],
      clientTime1: performance.now(),
    })
  );
}
let inited = false
onMounted(() => {
  if(!window.websocketInited){
    window.websocketInited = true
  }else{
    return;
  }
  inited = true
  document.addEventListener('visibilitychange', handler)
  eventbus.on('获取nps数据',process);
  connect();
  window.addEventListener("beforeunload", dispose);
});
function dispose() {
  clearTimeout(timer)
  sleeper.abort();
  if (ws) {
    ws.dead = true;
    ws.close();
  }
}
defineExpose({
  ReconnectImmediately(){
    ws.immediate = true
    ws.close()
  }
})
onBeforeUnmount(() => {
  if(!inited){
    return;
  }
  document.removeEventListener('visibilitychange', handler)
  clearInterval(timer)
  sys.在线人数 = "";
  sys.网络状态 = "";
  sys.内存占用 = "";
  dispose();
});
function handler(){
  if(document.visibilityState=='visible'){
    //页面可见
    if(ws.readyState!==WebSocket.OPEN){
      sleeper = new Sleeper();
      sys.网络状态 = "重连中..."
      connect();
    }
  }else{
    //页面不可见
    dispose();
  }
}
</script>

