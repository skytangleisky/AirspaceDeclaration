<template>
  <div class="wstd-container" id="wstd-container">
      <RgyxWorkPoint />
      <Websocket />
  </div>
</template>
<script setup lang="ts">
// import RgyxWorkPoint from "~/components/rgyx-work-point.vue";//示例
import RgyxWorkPoint from "~/myComponents/人影/pages/synthesis.vue"; //空域申请
import Websocket from "~/myComponents/websocket/websocket.vue";
localStorage.setItem('config',`{"userInfo":{"id":"82b72a90-e339-4d3c-8cc6-ccd1b5f8f942","name":"北京人影办","fullName":"北京人影办","password":"e3bb6327e760392569bcb4c145c60742","belongsProvinceId":"110000","belongsProvinceName":null,"belongsCityId":"110100","belongsCityName":null,"belongsCountyId":"110116","belongsCountyName":null,"sex":1,"roleId":"22630d8a-c0fd-4bc2-997c-5f2c51c32ca8","roleName":"管理机关人员","departId":"bad03c66-b6f8-4212-acc3-24ce1a30ea55","departName":"北京市人工影响天气中心","jobPostId":"","jobPostName":null,"phone":"-","email":"-","signInCount":2,"thisSignInTime":"2025-07-29 21:43:19","lastSignInTime":"2025-07-03 17:28:41","thisSignInIp":"172.23.1.1(未知)","lastSignInIp":"172.23.1.8(未知)","loginCount":2,"dueDate":"","imgUrl":null,"remark":"","createDate":"2025-07-03 17:21:29","createUserId":null,"upDate":null,"upUserId":null,"delDate":null,"delUserId":null,"unifiedUserCode":null,"attrs":null,"dept":{"id":"bad03c66-b6f8-4212-acc3-24ce1a30ea55","code":null,"name":"北京市人工影响天气中心","parentId":"464d7fd9-cb26-42d1-af3e-723344c95e0e","parentName":"中国气象局人工影响天气中心","lv":null,"regionLv":4,"leader":"","telephone":"","email":null,"status":null,"remark":"","sortNo":110000,"createDate":"2023-11-24 18:04:42","createUserId":"4d5c3cd5-6fb8-4856-837d-33d2a400a5e9","upDate":"2025-03-21 10:09:22","upUserId":"4d5c3cd5-6fb8-4856-837d-33d2a400a5e9","unitId":"7436d5d1-cfc3-4424-8c86-3577abc79f1c"},"belongsProvince":{"id":"110000","regionId":"110000","regionName":"北京","shortName":"北京","oldName":null,"parentRegionId":"100000","lon":116.405289,"lat":39.904987,"lv":3,"zoom":7,"area":null,"sort":1,"remark":null,"createUserId":null,"createDate":null,"updateUserId":null,"updateDate":null,"delUserId":null,"delDate":null},"belongsCity":{"id":"110100","regionId":"110100","regionName":"北京市","shortName":"北京","oldName":null,"parentRegionId":"110000","lon":116.405289,"lat":39.904987,"lv":4,"zoom":8,"area":null,"sort":1,"remark":null,"createUserId":null,"createDate":null,"updateUserId":null,"updateDate":null,"delUserId":null,"delDate":null},"belongsCounty":{"id":"110116","regionId":"110116","regionName":"怀柔区","shortName":"怀柔","oldName":null,"parentRegionId":"110100","lon":116.637123,"lat":40.324272,"lv":5,"zoom":9,"area":null,"sort":8,"remark":null,"createUserId":null,"createDate":null,"updateUserId":null,"updateDate":null,"delUserId":null,"delDate":null},"warehouseInfo":null,"userAgentEntity":{"id":"ed125f9b-8a11-4c4a-8c5d-ecc592e44259","name":"Chrome 13","browserType":"WEB_BROWSER","group":"CHROME","manufacturer":"GOOGLE","renderingEngine":"WEBKIT","browserVersion":"138.0.0.0","systemName":"Mac OS X","systemDeviceType":"COMPUTER","systemGroup":"MAC_OS_X","systemManufacturer":"APPLE","clientIp":"172.23.1.1(未知)","userId":"82b72a90-e339-4d3c-8cc6-ccd1b5f8f942","userName":"怀柔人影办","target":"运维平台","remark":null,"createDate":"2025-07-29 21:43:19.319"}},"projection":"EPSG:4326","tokenOfTiandt":"b5c6d22f3ea7a78d2526bcc2552882ef","projectName":"admin","currSys":"gen_dev","geoserverUrl":"http://192.168.1.112:3142/geoserver","gcnUrl":"http://3dspace.i234.me:86","rootUrl":null,"proRootUrl":null,"proFileSerRootUrl":null,"mapFjServerUrl":"http://service.fjmap.net","mapTianDiTuUrl":"http://3dspace.i234.me:85/tianditu{0-6}","cesiumMapTianDiTuUrl":"http://3dspace.i234.me:85/tianditu{s}","terrainUrl":"http://data.marsgis.cn/terrain","mapTianDiTuToken":"b5c6d22f3ea7a78d2526bcc2552882ef","minZoom":4,"maxZoom":17,"aseKey":"lgl81my8v8x9vgol","map":{"sth":"GS(2022)3124号","ol":{"projection":"EPSG:4326","zoomFactorSize":2,"tkStr":"&tk=b5c6d22f3ea7a78d2526bcc2552882ef"}}}`)
localStorage.setItem('accessToken','ffea9a57ba25e9bec28b5fd27cb2d97c')
</script>
<style>
.wstd-container {
  position: relative;
  height: 100%;
  width: 100%;
  color:var(--el-text-color-primary);
}
</style>
