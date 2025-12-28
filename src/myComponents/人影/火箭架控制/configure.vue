<template>
  <div class="rocket" @mousedown.stop>
    <div class="title">
      </div><div class="status">
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="作业控制" name="first">
        <rocketConfigure></rocketConfigure>
      </el-tab-pane>
      <el-tab-pane label="作业信息" name="second">
        <rocketInfo></rocketInfo>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import rocketConfigure from './rocketConfigure.vue'
import rocketInfo from './rocketInfo.vue'
const activeName = ref('first')
function handleClick(tab: any, event: any) {
  // console.log(tab, event);
}
</script>
<style lang="scss" scoped>
.rocket{
  cursor: auto;
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title{
    display: flex;
    align-items: center;
    justify-content: center;
    .status{
      position: absolute;
      width: 10px;
      height: 10px;
      right: 10px;
      border-radius: 50%;
      display: inline-block;
      background-color: #00ff00;
    }
  }
  .demo-tabs{
    ::v-deep(.el-tab-pane){
      height: 100%;
    }
    flex:1;
  }
}
</style>