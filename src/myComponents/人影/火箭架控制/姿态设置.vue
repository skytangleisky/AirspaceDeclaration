<template>
  <div class="posture-setting">
    <div>姿态设置</div>
    <div class="body">
      <div class="input-group">
        <div style="display: flex;white-space: nowrap;">方位(゜)：<input v-model="postureInfo.方位" style="width: 50px;" type="number" step="1" min="0" max="360"></div>
        <div style="display: flex;white-space: nowrap;">仰角(゜)：<input v-model="postureInfo.仰角" style="width: 50px;" type="number" step="1" min="0" max="90"></div>
      </div>
      <el-button type="primary" size="small">设置</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
const postureInfo = defineModel('postureSetting',{
  default:{
    方位: '',
    仰角: '',
  }
})
</script>
<style scoped lang="scss">
.posture-setting {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  .body {
    box-sizing: border-box;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    .input-group{
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}
</style>