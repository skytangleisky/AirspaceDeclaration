<template>
  <div class="configure" @mousedown.stop>
    <div class="table">
      <el-table :data="filterTableData" style="width: 100%" height="100%" highlight-current-row>
        <!-- <el-table-column label="id" prop="id" sortable /> -->
        <!-- <el-table-column label="uuid" prop="uuid" sortable /> -->
        <el-table-column label="作业点ID" prop="strZydID" sortable />
        <el-table-column label="作业点名称" prop="strName" sortable show-overflow-tooltip />
        <el-table-column label="申请次数" prop="申请次数" sortable />
        <el-table-column label="批复次数" prop="批复次数" sortable />
        <el-table-column label="批准次数" prop="批准次数" sortable />
        <el-table-column label="不批准次数" prop="不批准次数" sortable />
        <el-table-column label="批复超时次数" prop="批复超时次数" sortable />
        <el-table-column label="批复率(%)" prop="批复率" sortable />
        <el-table-column label="批准率(%)" prop="批准率" sortable />
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 20]"
        :size="size"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-date-picker
        style="flex-grow: 0;"
        v-model="range"
        type="datetimerange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :default-value="defaultDates"
        unlink-panels
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from 'moment';
const Tomorrow = moment().add(1, 'day')
// const range = ref<[Date, Date]>([
//   new Date(moment().year(), moment().month(), moment().date(), 0, 0),
//   new Date(Tomorrow.year(), Tomorrow.month(), Tomorrow.date(), 0, 0),
// ])
const range = ref<any>()
const now = new Date()
const defaultDates = [
  new Date(now.getFullYear(), now.getMonth() - 1, 1), // 上个月
  new Date(now.getFullYear(), now.getMonth(), 1)      // 当前月
]
const form = reactive({
  title:'添加记录',
  id: null,
  uuid: null,
  createTime: null,
  updateTime: null,
  path: null,
  caller: '511011003',//内江-团结水库
  callee: '510100000',//四川省-成都市
  uploadProgress:0,
})
provide('form',form)
import { computed, ref, reactive, watch, provide, onMounted } from 'vue'
import type { ComponentSize } from 'element-plus'
import { fetchList } from './api'
const currentPage4 = ref(1)
const pageSize4 = ref(10)
const total = ref(0)
const size = ref<ComponentSize>('default')
const background = ref(false)

const handleSizeChange = (val: number) => {

  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  // console.log(`current page: ${val}`)
}

interface Item {
  id: string
  uuid: string
  datetime_create: string
  datetime_update: string
  path: string
  caller: string
  callee: string
}

const search = ref('')
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
const tableData: Item[] = reactive([])
watch([currentPage4,pageSize4,range],()=>{
  setting.触发作业状态数据查询 = Date.now()
})
watch(()=>setting.触发作业状态数据查询,()=>{
  fetchList({page:currentPage4.value,size:pageSize4.value,range:range.value}).then(res=>{
    total.value = res.data.total
    tableData.splice(0,tableData.length,...res.data.results)
  })
}, { immediate: true })
</script>
<style lang="scss" scoped>
.configure{
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor:default;
  height: 100%;
  width: 100%;
  padding:10px;
  box-sizing: border-box;
  .table{
    flex:1;
    overflow: auto;
  }
  .pagination{
    padding-top:10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>