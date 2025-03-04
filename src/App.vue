<template>
  <rgyxWorkPoint />
  <AircraftPos></AircraftPos>
</template>
<script setup>
import "~/styles/index.scss";
import '~/composables';//初始化主题，默认自动主题
import 'uno.css'
import "~/styles/element/index.scss"
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
