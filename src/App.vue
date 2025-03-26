<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <RgyxWorkPoint />
    <!-- <SmokeStove></SmokeStove> -->
    <Websocket />
  </div>
</template>
<script setup>
// import rgyxWorkPoint from "~/components/rgyx-work-point.vue";//示例
import RgyxWorkPoint from "~/myComponents/人影/pages/synthesis.vue";//空域申请
// import SmokeStove from "~/myComponents/smokeStove/smokeStove.vue";//烟炉作业
import Websocket from "~/myComponents/websocket/websocket.vue";
import "~/styles/element/index.scss"
</script>
<style>
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-size: 100px;
  color: var(--el-text-color-primary);
}
#app {
  width: 100vw;
  height: 100vh;
  font-size: 14px;
}
</style>
