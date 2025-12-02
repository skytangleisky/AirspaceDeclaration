<template>
  <div class="configure" @mousedown.stop>
    <div class="table">
      <el-table :data="filterTableData" style="width: 100%" height="100%" highlight-current-row>
        <el-table-column label="id" prop="id" sortable />
        <!-- <el-table-column label="uuid" prop="uuid" sortable /> -->
        <el-table-column label="创建时间" prop="datetime_create" sortable />
        <el-table-column label="更新时间" prop="datetime_update" sortable />
        <el-table-column label="路径" prop="path" sortable />
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
        :page-sizes="[100, 200, 300, 400]"
        :size="size"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <Add v-model:render="showAdd"></Add>
</template>

<script lang="ts" setup>
import Add from './新增/index.vue'
import { computed, ref, reactive, onMounted } from 'vue'
import type { ComponentSize } from 'element-plus'
import { fetchList } from './api'
const currentPage4 = ref(1)
const pageSize4 = ref(100)
const total = ref(0)
const size = ref<ComponentSize>('default')
const background = ref(false)
const showAdd = ref(false)

const handleSizeChange = (val: number) => {

  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

interface User {
  date: string
  name: string
  address: string
}

const search = ref('')
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  tableData.splice(index, 1)
}

const tableData: User[] = reactive([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  }
])
onMounted(()=>{
  fetchList({page:currentPage4.value,size:pageSize4.value}).then(res=>{
    total.value = res.data.total
    tableData.splice(0,tableData.length,...res.data.results)
  })
})
function handleAdd(){
  showAdd.value = true
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
    justify-content: left;
  }
}
</style>