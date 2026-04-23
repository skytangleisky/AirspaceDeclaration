<template>
  <div>
    <el-checkbox label="显示冲突告警" v-model="setting.人影.监控.显示冲突告警"></el-checkbox>
    <el-checkbox label="显示侵入告警" v-model="setting.人影.监控.显示侵入告警" disabled></el-checkbox>
    <el-checkbox label="作业自动不批准" v-model="setting.人影.监控.作业自动不批准"></el-checkbox>
  </div>
</template>
<script setup lang="ts">
import { useSettingStore } from '~/stores/setting';
const setting = useSettingStore();
import { reactive } from 'vue'
</script>
<style lang="scss" scoped>
</style>