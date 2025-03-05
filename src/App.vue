<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <rgyxWorkPoint />
    <AircraftPos></AircraftPos>
  </div>
  <!-- <el-button type="primary">OK</el-button> -->
</template>
<script setup>
// import rgyxWorkPoint from "~/components/rgyx-work-point.vue";
import rgyxWorkPoint from "~/myComponents/人影/pages/synthesis.vue";
import AircraftPos from "~/myComponents/websocket/aircraftPosition.vue";
</script>
<style>
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
