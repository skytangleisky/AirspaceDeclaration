<template>
  <subFrame v-model:render="render" :width="800" :height="400">
    <Add @close="render=false"></Add>
  </subFrame>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import SubFrame from '~/frames/subFrame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Add from './add.vue'
  const render = defineModel('render', {
    default: false,
    type: Boolean,
  })
</script>