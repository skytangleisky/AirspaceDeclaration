<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="workID" label="作业ID" width="240" />
    <el-table-column prop="strZydIDName" label="作业点名称" width="120" />
    <el-table-column prop="tagPos" label="经纬度" width="200" />
    <el-table-column prop="beginTm" label="作业时间" width="160" />
    <el-table-column prop="timeLen" label="作业时长（秒）" width="120" />
    <el-table-column prop="workType" label="作业类型" width="80" >
      <template #default="{ row }">
        {{ row.workType==0 ? '未定义' : '未知'}}
      </template>
    </el-table-column>
    <el-table-column prop="workTool" label="作业工具" width="150" >
      <template #default="{ row }">
        {{
          row.workTool==0 ? '火箭' :
          row.workTool==1 ? '高炮' :
          row.workTool==2 ? '火箭+高炮' :
          row.workTool==3 ? '烟炉' :
          row.workTool==4 ? '火箭+烟炉' :
          row.workTool==5 ? '高炮+烟炉' :
          row.workTool==6 ? '火箭+高炮+烟炉' :
          '为定义'
        }}
      </template>
    </el-table-column>
    <el-table-column prop="numPD" label="炮弹用量" width="80" />
    <el-table-column prop="numHJ" label="火箭用量" width="80" />
    <el-table-column prop="numYT" label="烟条用量" width="80" />
    <el-table-column prop="numOther" label="其他用量" width="80" />
    <el-table-column prop="shootDirect" label="开始射向" width="80" />
    <el-table-column prop="shootAngle" label="结束射向" width="80" />
    <el-table-column prop="shootDirect" label="开始射角" width="80" />
    <el-table-column prop="shootAngle" label="结束射角" width="80" />
    <el-table-column prop="workArea" label="作业面积" width="80" />
    <el-table-column prop="beforeWeather" label="作业前天气" width="100" />
    <el-table-column prop="afterWeather" label="作业后天气" width="100" />
    <el-table-column prop="workEffect" label="作业效果" width="100" />
    <el-table-column label="操作" min-width="120">
      <template #default="{row}">
        <el-button disable v-if="row.isconfirmed=='1'" type="success" size="small" disabled>
          已确认
        </el-button>
        <el-popconfirm
          v-else
          class="box-item"
          title="是否确认"
          placement="right"
          confirm-button-text="确认"
          cancel-button-text="返回"
          @confirm="handleClick"
        >
          <template #reference>
            <el-button type="warning" size="small">待确认</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="pageOption.page" :page-size="pageOption.size" layout="prev, pager, next, jumper, total" :total="pageOption.total" />
</template>
<script lang="ts" setup>
import {完成信息查询} from '~/api/天工.ts'
import { watch,reactive } from 'vue'
const pageOption = reactive({
  page:1,
  size:10,
  total:0,
})
let currentController: AbortController | null = null;
watch([()=>pageOption.page,()=>pageOption.size],()=>{
  if(currentController!=null){
    currentController.abort()
  }
  currentController = new AbortController()
  完成信息查询({page:pageOption.page,size:pageOption.size},currentController.signal).then(res=>{
    pageOption.total = res.data.total
    tableData.splice(0,tableData.length,...res.data.results)
    console.log(tableData)
  })
},{
  immediate:true,
  // deep:true,
})
const handleClick = () => {
  console.log('click')
}
const tableData = reactive<any>([])
</script>