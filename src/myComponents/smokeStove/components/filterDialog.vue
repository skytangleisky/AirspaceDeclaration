<template>
  <Frame v-model:render="show">
    <DistrictFilter></DistrictFilter>
  </Frame>
</template>
<script lang="ts" setup>
  import Frame from "~/frames/frame.vue"
  import DistrictFilter from "./districtFilter.vue";
  const show = defineModel('show', {
    type: Boolean,
    default: true,
  })
</script>