<template>
  <datatable
    style="padding: 10px"
    database="host=tanglei.top&port=3308&user=root&password=mysql&database=ryplat"
    table="zydhisdata"
  ></datatable>
</template>
<script lang="ts" setup>
import datatable from "~/myComponents/datatable/index.vue";
</script>
