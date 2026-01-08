<template>
  <frame title="语音管理" v-model:render="setting.语音管理" once width="1600px" height="600px">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Configure from './configure.vue'
</script>