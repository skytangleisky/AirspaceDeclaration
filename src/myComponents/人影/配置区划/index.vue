<template>
  <frame v-model:render="setting.显示全国行政区划配置">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Configure from './configure.vue'

</script>