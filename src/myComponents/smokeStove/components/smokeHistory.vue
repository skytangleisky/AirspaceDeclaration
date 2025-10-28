<template>
  <div>
    <div class="filter"></div>
      <el-table class="table" :data="option.arr" style="width: 100%" height="250">
        <el-table-column prop="stoveID" label="烟炉ID" width="150" />
        <el-table-column prop="stoveName" label="烟炉名称" width="200" />
        <el-table-column prop="mgr_unit" label="管理单位" width="120" />
        <el-table-column prop="applyTm" label="申请时间" width="200" />
        <el-table-column prop="telNumber" label="电话号码" width="100"/>
        <el-table-column prop="fireCount" label="点火的烟条数量" />
        <el-table-column prop="beginTm" label="开始时间" />
        <el-table-column prop="endTm" label="结束时间" />
        <el-table-column prop="writeTm" label="记录时间" />
        <el-table-column prop="bEdit" label="是否编辑" />
      </el-table>
      <div style="display: flex;justify-content: space-between;">
        <el-pagination
          class="pagination"
          v-model:current-page="paginationOption.currentPage"
          v-model:page-size="paginationOption.pageSize"
          :page-sizes="[5, 10, 15, 20]"
          size="default"
          :background="false"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationOption.total"
          :teleported="false"
        />
        <div style="display: flex;justify-content: center;align-items: center;cursor:pointer" @click="数据更新时间=moment().format('YYYY-MM-DD HH:mm:ss')">
          <el-icon><Refresh /></el-icon>
          {{ 数据更新时间 }}
        </div>
      </div>
  </div>
</template>
<script setup lang="ts">
import { Refresh } from "@element-plus/icons-vue";
import {烟炉历史} from '~/api/天工'
import { reactive, watch, ref } from 'vue';
import moment from 'moment';
const 数据更新时间 = ref(moment().format('YYYY-MM-DD HH:mm:ss'))
const paginationOption = reactive({
  currentPage:1,
  pageSize:5,
  total:0
})
watch(paginationOption,()=>{
  数据更新时间.value = moment().format('YYYY-MM-DD HH:mm:ss')
})
watch(数据更新时间,()=>{
  烟炉历史(paginationOption).then(res=>{
    paginationOption.total = res.data.total
    option.arr = res.data.results
  })
},{deep:true,immediate:true})
const option = reactive({
  arr:new Array()
})


</script>
<style lang="scss" scoped>
.table{
  padding-bottom:10px;
}
</style>

