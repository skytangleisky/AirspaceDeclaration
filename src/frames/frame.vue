<template>
  <teleport to="#wstd-container">
    <div v-dragable class="meeting" v-show="show" v-if="render">
      <slot></slot>
      <div class="close-btn" @click="show=false" @mousedown.stop><el-icon v-html="closeUrl"></el-icon></div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
const show = defineModel('show',{
  default:true
})
const render = defineModel('render',{
  default:true
})
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