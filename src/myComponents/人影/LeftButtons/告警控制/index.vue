<template>
  <div>
    <el-checkbox label="显示冲突告警"></el-checkbox>
    <el-checkbox label="显示侵入告警"></el-checkbox>
    <el-checkbox label="作业自动不批准"></el-checkbox>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const option = reactive([
  {}
])
</script>
<style lang="scss" scoped>
</style>