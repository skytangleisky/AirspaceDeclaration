<template>
  <teleport to="#wstd-container">
    <div ref="meeting" v-dragable class="meeting" v-show="SHOW" v-if="IF">
      <slot></slot>
      <div class="close-btn" @click="close" @mousedown.stop><el-icon v-html="closeUrl"></el-icon></div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
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
  default:800
})
const height = defineModel('height',{
  default:400
})
const meeting = ref()
onMounted(()=>{
  if(meeting.value){
    if(width.value>0){
      meeting.value!.style.setProperty('--width', width.value+'px');
    }
    if(height.value>0){
      meeting.value!.style.setProperty('--height', height.value+'px');
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
  border-radius:4px;
  box-sizing:border-box;
  --width:800px;
  --height:400px;
  width:var(--width);
  height:var(--height);
  background:var(--el-bg-color-opacity-8);
  border:1px solid var(--el-border-color);
  position:absolute;
  left:calc(50% - var(--width)/2);
  top:calc(50% - var(--height)/2);
  padding:4px;
  z-index:9999;
  cursor:move;
  // background: linear-gradient(135deg, #5a5a71 0%, #33354a 100%);
  &:hover {
    .close-btn {
      display: flex;
    }
  }

  .close-btn {
    right:-1px;
    top:-1px;
    position: absolute;
    justify-content: center;
    align-items:center;
    font-size: 0.16rem;
    z-index:999;
    color:white;
    display: none;
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