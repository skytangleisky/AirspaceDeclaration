<template>
  <frame title="计划审批" v-bind:render="true" width="1200px" height="760px">
    <Configure></Configure>
  </frame>
</template>
<script lang="ts" setup>
import { useSysStatusStore } from '~/stores/sysStatus';
const sys = useSysStatusStore()
import frame from '~/frames/frame.vue'
import Configure from './configure.vue'
</script>