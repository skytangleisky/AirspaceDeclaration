<template>
  <teleport to="#wstd-container">
    <div v-dragable class="meeting" v-show="SHOW" v-if="IF">
      <slot></slot>
      <div class="close-btn" @click="close" @mousedown.stop><el-icon v-html="closeUrl"></el-icon></div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue'
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
const once = defineModel('once',{
  default:false
})
const render = defineModel('render',{
  required:false,
  default:true
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
  width:800px;
  height:400px;
  background:var(--el-bg-color-opacity-8);
  border:1px solid var(--el-border-color);
  position:absolute;
  left:calc(50% - 400px);
  top:calc(50% - 200px);
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
    right:4px;
    top:4px;
    position: absolute;
    width:20px;
    height:20px;
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