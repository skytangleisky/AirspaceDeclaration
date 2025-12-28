<template>
  <frame title="人影地面作业装备通用火箭发射系统-唐刘村作业点" v-model:render="setting.火箭架配置" :width="800" :height="600">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
  import frame from '~/frames/frame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Configure from './configure.vue'
</script>