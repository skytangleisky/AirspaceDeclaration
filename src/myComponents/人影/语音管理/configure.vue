<template>
  <div class="configure" @mousedown.stop>
    <div class="table">
      <el-table :data="filterTableData" style="width: 100%" height="100%" highlight-current-row>
        <el-table-column label="id" prop="id" sortable />
        <!-- <el-table-column label="uuid" prop="uuid" sortable /> -->
        <el-table-column label="创建时间" prop="datetime_create" sortable />
        <el-table-column label="更新时间" prop="datetime_update" sortable />
        <el-table-column label="路径" prop="path" sortable width="500"/>
        <el-table-column label="呼出方" prop="caller" sortable />
        <el-table-column label="呼入方" prop="callee" sortable />
        <el-table-column :align="'right'">
          <template #header>
            <div style="display: flex;justify-content: flex-end;">
              <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
            </div>
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
      <el-input style="width: 200px;" v-model="station.人影界面被选中的设备" placeholder="请输入呼出方" clearable></el-input>
    </div>
  </div>
  <Add v-model:render="showAdd"></Add>
</template>

<script lang="ts" setup>
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
import { useStationStore } from '~/stores/station'
const station = useStationStore()
import Add from './新增/index.vue'
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
const showAdd = ref(false)

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
const handleEdit = (index: number, row: Item) => {
  form.title = '修改记录'
  form.id = row.id
  form.uuid = row.uuid
  form.createTime = row.datetime_create
  form.updateTime = row.datetime_update
  form.path = computed({
    get(){
      return row.path
    },
    set(val){
      row.path = val
    }
  })
  form.caller = row.caller
  form.callee = row.callee
  showAdd.value = true
}
import axios from 'axios'
import {删除语音记录} from './api'
const handleDelete = (index: number, row: Item) => {
  axios.delete("/backend/upload", {
    data: [row.path]
  }).then(response => {
    console.log('删除成功',response.data)
    删除语音记录([{'uuid':row.uuid}]).then(()=>{
      console.log('删除语音记录成功')
      触发语音记录查询.value = Date.now()
    }).catch((err)=>{
      console.error('删除语音记录失败',err)
    })
  }).catch(error => {
    console.error('删除失败',error)
  });
}

const tableData: Item[] = reactive([
])
const 触发语音记录查询 = computed({
  get(){
    return setting.触发语音记录查询
  },
  set(val){
    setting.触发语音记录查询 = val
  }
})
provide('触发语音记录查询',触发语音记录查询)
watch(()=>station.人影界面被选中的设备,()=>{
  触发语音记录查询.value = Date.now()
})
watch([currentPage4,pageSize4],()=>{
  触发语音记录查询.value = Date.now()
})
watch(触发语音记录查询,()=>{
  fetchList({page:currentPage4.value,size:pageSize4.value,caller_filter:station.人影界面被选中的设备}).then(res=>{
    total.value = res.data.total
    tableData.splice(0,tableData.length,...res.data.results)
  })
}, { immediate: true })
function handleAdd(){
  showAdd.value = true
  form.title = '添加记录'
  form.id = null
  form.uuid = null
  form.createTime = null
  form.updateTime = null
  form.path = null
  form.caller = station.人影界面被选中的设备||'511011003'//内江-团结水库
  form.callee = '510100000'//四川省-成都市
  form.uploadProgress = 0
}
</script>
<style lang="scss" scoped>
.configure{
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