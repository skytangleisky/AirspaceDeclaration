<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <rgyxWorkPoint />
    <Websocket />
  </div>
</template>
<script setup>
// import rgyxWorkPoint from "~/components/rgyx-work-point.vue";
import { defineAsyncComponent } from "vue";
const rgyxWorkPoint = defineAsyncComponent(()=>import("~/myComponents/人影/pages/synthesis.vue"))
import Websocket from "~/myComponents/websocket/websocket.vue";
</script>
<style>
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
#app {
  width: 100vw;
  height: 100vh;
  font-size: 14px;
}
</style>
