<template>
  <frame v-bind:render="true" width="1820px" height="870px">
    <smokeStove></smokeStove>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import smokeStove from '~/myComponents/smokeStove/smokeStove.vue'

</script>