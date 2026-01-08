<template>
  <frame title="电子围栏" v-model:render="setting.电子围栏" width="1200px" height="600px">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Configure from './configure.vue'
</script>