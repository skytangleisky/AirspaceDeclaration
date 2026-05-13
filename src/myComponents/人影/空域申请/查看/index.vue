<template>
  <frame title="空域审批" v-model:render="sys.显示空域申请" width="1200px" height="400px">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
import { useSysStatusStore } from '~/stores/sysStatus';
const sys = useSysStatusStore()
import frame from '~/frames/frame.vue'
import Configure from './configure.vue'
</script>