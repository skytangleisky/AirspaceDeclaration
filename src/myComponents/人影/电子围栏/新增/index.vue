<template>
  <subFrame :title="form.title" v-model:render="render" width="800px" height="750px">
    <Add @close="render=false"></Add>
  </subFrame>
</template>
<script lang="ts" setup>
  const form = inject('form',{
    title:'添加记录'
  })
  import { inject, ref } from 'vue'
  import SubFrame from '~/frames/subFrame.vue'
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import Add from './add.vue'
  const render = defineModel('render', {
    default: false,
    type: Boolean,
  })
</script>