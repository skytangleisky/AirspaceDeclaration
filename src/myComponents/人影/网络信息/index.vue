<template>
  <frame title="网络信息" v-model:render="setting.网络信息" width="1400px" height="520px">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Configure from './configure.vue'
</script>