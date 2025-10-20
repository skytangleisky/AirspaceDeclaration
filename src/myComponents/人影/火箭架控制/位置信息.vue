<template>
  <div class="position-info">
    <div>位置信息</div>
    <div class="body">
      <div>经度：{{ positionInfo.经度 }}</div>
      <div>纬度：{{ positionInfo.纬度 }}</div>
      <div>高度：{{ positionInfo.高度 }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineModel} from 'vue'
const positionInfo = defineModel('positionInfo',{
  default:{
    经度: '',
    纬度: '',
    高度: '',
  }
})
</script>
<style lang="scss" scoped>
.position-info{
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