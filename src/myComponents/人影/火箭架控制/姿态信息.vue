<template>
  <div class="posture-info">
    <div>姿态信息</div>
    <div class="body">
      <div>当前方位角：{{ postureInfo.方位角 }}</div>
      <div>当前仰角：{{ postureInfo.仰角 }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineModel} from 'vue'
const postureInfo = defineModel('attitudeInfo',{
  default:{
    方位角: '',
    仰角: '',
  }
})
</script>
<style lang="scss" scoped>
.posture-info{
  display: flex;
  flex-direction: column;
  height: 100%;
  .body{
    margin-left:10px;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around;
  }
}
</style>