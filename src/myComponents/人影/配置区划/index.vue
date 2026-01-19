<template>
  <frame title="全国行政区划配置" v-model:render="setting.显示全国行政区划配置" width="400px" height="600px">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Configure from './configure.vue'
</script>