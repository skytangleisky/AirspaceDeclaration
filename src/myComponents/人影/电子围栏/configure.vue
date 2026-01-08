<template>
  <div class="configure" @mousedown.stop>
    <div class="table">
      <el-table :data="filterTableData" style="width: 100%" height="100%" highlight-current-row>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="60">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="ID" prop="id" sortable width="100"/> -->
        <el-table-column label="开始生效时间" prop="create_time" sortable width="180" />
        <el-table-column label="结束生效时间" prop="end_time" sortable width="180" />
        <!-- <el-table-column label="状态" sortable width="150">
          <template #default="{ row }">
            <el-tag :type="getType(row.emStatus)">
            {{ status2value(row.emStatus) }}
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="活动名称" prop="name" sortable width="200" show-overflow-tooltip/>
        <el-table-column label="申请时间" prop="createTime" sortable width="180" />
        <el-table-column label="起飞" prop="remarkTLA" sortable show-overflow-tooltip/>
        <el-table-column label="活动类型" prop="typeDesc" sortable width="120"/>
        <el-table-column label="任务性质" prop="taskCategoryDesc" sortable width="120"/>
        <el-table-column label="操控模式" prop="operationModeDesc" sortable width="120"/>
        <el-table-column label="飞行模式" prop="flightModeDesc" sortable width="120"/>
        <el-table-column label="申请主体名称" prop="applicantName" sortable width="180" />
        <el-table-column label="通信联络方式" prop="remarkCont" sortable width="180" />
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[20, 50]"
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
  <Add v-model:render=render></Add>
</template>

<script lang="ts" setup>
import moment from 'moment';
const Tomorrow = moment().add(1, 'day')
// const range = ref<[Date, Date]>([
//   new Date(moment().year(), moment().month(), moment().date(), 0, 0),
//   new Date(Tomorrow.year(), Tomorrow.month(), Tomorrow.date(), 0, 0),
// ])
import Add from './新增/index.vue'
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
import {useSettingStore} from '~/stores/setting'
const setting = useSettingStore()
import { computed, ref, reactive, watch, provide, onMounted } from 'vue'
const getType = computed(()=>{
  return (status:number)=>{
    const text = status2value(status)
    switch(text){
      case '已申请':
        return 'success'
      case '已批准':
        return 'primary'
      case '不批准':
        return 'info'
      default:
        return 'danger'
    }
  }
})
import type { ComponentSize } from 'element-plus'
import { fetchList } from './api'
const currentPage4 = ref(1)
const pageSize4 = ref(20)
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

const tableData: Item[] = reactive([])
watch([currentPage4,pageSize4,range],()=>{
  setting.触发网络信息查询 = Date.now()
})
watch(()=>setting.触发网络信息查询,()=>{
  fetchList({page:currentPage4.value,size:pageSize4.value,range:range.value}).then(res=>{
    total.value = res.data.total
    tableData.splice(0,tableData.length,...res.data.results)
  })
}, { immediate: true })
function status2value(key:number){
  let ubyStatus = [
    { key: 0, value: "空闲" },
    { key: 9, value: "作业完成" },
    { key: 70, vlaue: "作业保存" },
    { key: 72, value: "已申请" },
    { key: 73, value: "撤销申请待回执" },
    { key: 74, value: "已撤销" },
    { key: 75, value: "已批准" },
    { key: 76, value: "不批准" },
    { key: 90, value: "作业开始带回执" },
    { key: 91, value: "作业开始" },
    { key: 92, value: "作业暂停待回执" },
    { key: 93, value: "作业强制终止" },
    { key: 99, value: "人工移除" },
    { key: 100, value: "作业结束" },
  ]
  return ubyStatus.filter((item) => item.key == key)[0]?.value || `未知状态${key}`;
}
function handleEdit(row: any) {
  render.value = true
  console.log(row)
}
const render = ref(false)
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