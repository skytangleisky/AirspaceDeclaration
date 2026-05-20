<template>
  <component :is="sys.singleDialog"></component>
</template>
<script setup lang="ts">
import { useSysStatusStore } from '~/stores/sysStatus';
const sys = useSysStatusStore()
</script>