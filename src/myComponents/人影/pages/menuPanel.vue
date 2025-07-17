<template>
<div class="toolKitBgClass">
  <div v-if="setting.人影.监控.是否显示分布面板">分布</div>
  <div v-if="setting.人影.监控.是否显示产品面板">产品</div>
  <div v-if="setting.人影.监控.是否显示工具面板">工具</div>
</div>
</template>
<script lang="ts" setup>
  import { useSettingStore } from '~/stores/setting';
  const setting = useSettingStore();
</script>
<style lang="scss" scoped>
.toolKitBgClass{
  box-sizing: border-box;
  border-radius:5px;
  top:0;
  left:0;
  width:391px;
  min-height:559px;
  max-height: 100%;
  border:1px solid #bdd4ff;
  background-color: #f4f8ff;
}
.dark .toolKitBgClass{
  border:1px solid #c1d3fb;
  background-color: #273347;
}
</style>