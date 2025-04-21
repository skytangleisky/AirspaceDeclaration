<template>
  <div class="wstd-main-container">
      <RgyxWorkPoint />
      <Websocket />
  </div>
</template>
<script setup>
// import RgyxWorkPoint from "~/components/rgyx-work-point.vue";//示例
import RgyxWorkPoint from "~/myComponents/人影/pages/synthesis.vue"; //空域申请
import Websocket from "~/myComponents/websocket/websocket.vue";
</script>
<style>
.wstd-main-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
