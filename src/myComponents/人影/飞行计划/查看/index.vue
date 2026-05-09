<template>
  <frame title="审批" v-model:render="sys.显示飞行计划" width="1200px" height="660px">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
import { useSysStatusStore } from '~/stores/sysStatus';
const sys = useSysStatusStore()
import frame from '~/frames/frame.vue'
import Configure from './configure.vue'
</script>