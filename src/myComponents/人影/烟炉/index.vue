<template>
  <frame v-model:render="setting.显示烟炉" :width="1820" :height="870">
    <smokeStove></smokeStove>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import smokeStove from '~/myComponents/smokeStove/smokeStove.vue'

</script>