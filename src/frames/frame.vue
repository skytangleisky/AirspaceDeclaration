<template>
  <teleport to="#wstd-container">
    <div ref="meeting" v-dragable class="meeting" v-show="SHOW" v-if="IF">
      <div class="title" @mousedown.stop>{{ title }}</div>
      <slot></slot>
      <div class="close-btn" @click="close" @mousedown.stop><el-icon v-html="closeUrl"></el-icon></div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
const title = defineModel('title',{
  default:'标题'
})
import {onMounted, ref, watch} from 'vue'
function close(){
  if(once.value){
    IF.value=false
  }else{
    SHOW.value=false
  }
  render.value = false
}
const SHOW = ref(true)
const IF = ref(true)
const once = defineModel<boolean>('once',{
  default:false
})
const render = defineModel('render',{
  required:false,
  default:true
})
const width = defineModel('width',{
  default:'100%'
})
const height = defineModel('height',{
  default:'100%'
})
watch(width,(newVal,oldVal)=>{
  if(meeting.value){
    meeting.value!.style.setProperty('--width', newVal);
  }
  if(width.value=='100%'&&height.value=='100%'){
    meeting.value!.style.setProperty('border', 'none');
  }
})
watch(height,(newVal,oldVal)=>{
  if(meeting.value){
    meeting.value!.style.setProperty('--height', newVal);
  }
  if(width.value=='100%'&&height.value=='100%'){
    meeting.value!.style.setProperty('border', 'none');
  }
})
const meeting = ref()
onMounted(()=>{
  if(meeting.value){
    meeting.value!.style.setProperty('--width', width.value);
    meeting.value!.style.setProperty('--height', height.value);
    if(width.value=='100%'&&height.value=='100%'){
      meeting.value!.style.setProperty('border', 'none');
    }
  }
})
watch(render,(newVal,oldVal)=>{
  if(once.value){
    IF.value=newVal
  }else{
    SHOW.value=newVal
  }
},{immediate:true})

import closeUrl from '~/assets/close.svg?raw'
</script>
<style lang="scss" scoped>
.meeting{
  background:darkblue;
  border-radius:4px;
  box-sizing:border-box;
  display: flex;
  flex-direction: column;
  --width:100%;
  --height:100%;
  width:var(--width);
  height:var(--height);
  background:var(--el-bg-color-opacity-8);
  border:1px solid var(--el-border-color);
  position:absolute;
  left:calc(50% - var(--width)/2);
  top:calc(50% - var(--height)/2);
  padding:4px;
  z-index:2000;
  cursor:move;
  // background: linear-gradient(135deg, #5a5a71 0%, #33354a 100%);
  &:hover {
    .close-btn {
      display: flex;
    }
  }
  .title{
    width:100%;
    box-sizing: border-box;
    cursor:default;
    background-color: var(--el-bg-color);
    position: relative;
    white-space: nowrap;
    font-size: 0.2rem;
    font-weight: bold;
    padding-left: 4px;
    text-align: left;
  }

  .close-btn {
    right: 0px;
    top:0px;
    position: absolute;
    justify-content: center;
    align-items:center;
    font-size: 0.16rem;
    z-index:999;
    color:white;
    display: flex;
    cursor:pointer;
    &:hover {
      display: flex;
      .el-icon {
        color: #ff4d4f;
      }
    }
    &:active {
      transform: rotateX(180deg);
      transition: transform 0.3s;
      transition-timing-function: ease-in-out;
      .el-icon {
          color: #d32f2f;
      }
    }
  }
}
</style>