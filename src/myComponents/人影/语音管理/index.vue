<template>
  <frame v-model:render="setting.语音管理" :width="1200" :height="600">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Configure from './configure.vue'
</script>