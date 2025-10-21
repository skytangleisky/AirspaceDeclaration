<template>
  <frame v-model:render="setting.弹药概况">
    <Overview></Overview>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Overview from './overview.vue'
</script>