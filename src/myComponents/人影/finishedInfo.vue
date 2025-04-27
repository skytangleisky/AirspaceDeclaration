<template>
  <div style="width:100%;display: flex;height:40px;justify-content: space-between;">
    <el-date-picker
      v-model="range"
      type="datetimerange"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :default-value="defaultDates"
      unlink-panels
      style="max-width:350px"
    />
    <el-select
      clearable
      v-model="zydID"
      filterable
      placeholder="作业点名称过滤"
      style="width: 260px"
      :value-on-clear="null"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left;color: var(--el-text-color-secondary)">{{ item.value }}</span>
        <span
          style="float: right;font-size: 16px;"
        >
          {{ item.label }}
          <span style="color:var(--el-text-color-secondary)">{{ item.count }}</span>
        </span>
      </el-option>
    </el-select>
  </div>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="workID" label="作业ID" width="240" />
    <el-table-column prop="strZydIDName" label="作业点名称" width="120" />
    <el-table-column prop="tagPos" label="经纬度" width="200" />
    <el-table-column prop="beginTm" label="作业时间" width="160" />
    <el-table-column prop="timeLen" label="作业时长（秒）" width="120" />
    <el-table-column label="作业类型" width="150" >
      <template #default="{row}">
        {{ workType[row.workType] }}
      </template>
    </el-table-column>
    <el-table-column label="作业工具" width="150" >
      <template #default="{ row }">
        {{ workCat[row.workTool] }}
      </template>
    </el-table-column>
    <el-table-column prop="numPD" label="炮弹用量" width="80" />
    <el-table-column prop="numHJ" label="火箭用量" width="80" />
    <el-table-column prop="numYT" label="烟条用量" width="80" />
    <el-table-column prop="numOther" label="其他用量" width="80" />
    <el-table-column prop="shootDirect" label="开始射向" width="80">
      <template #default="{row}">{{Number(row.shootDirect.substring(0,3))}}</template>
    </el-table-column>
    <el-table-column prop="shootDirect" label="结束射向" width="80">
      <template #default="{row}">{{Number(row.shootDirect.substring(3,6))}}</template>
    </el-table-column>
    <el-table-column prop="shootDirect" label="开始射角" width="80">
      <template #default="{row}">{{Number(row.shootDirect.substring(0,2))}}</template>
    </el-table-column>
    <el-table-column prop="shootAngle" label="结束射角" width="80">
      <template #default="{row}">{{Number(row.shootAngle.substring(2,4))}}</template>
    </el-table-column>
    <el-table-column prop="workArea" label="作业面积" width="80" />
    <el-table-column prop="beforeWeather" label="作业前天气" width="120">
      <template #default="{row}">{{weather[row.beforeWeather]}}</template>
    </el-table-column>
    <el-table-column prop="afterWeather" label="作业后天气" width="120">
      <template #default="{row}">{{weather[row.afterWeather]}}</template>
    </el-table-column>
    <el-table-column prop="workEffect" label="作业效果" width="100">
      <template #default="{row}">{{effect[row.workEffect]}}</template>
    </el-table-column>
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
import {完成信息查询,完成信息查询中一段时间内作业点数据} from '~/api/天工.ts'
import { watch,reactive,ref } from 'vue'
const range = ref(null)
const now = new Date()
const defaultDates = [
  new Date(now.getFullYear(), now.getMonth() - 1, 1), // 上个月
  new Date(now.getFullYear(), now.getMonth(), 1)      // 当前月
]
const pageOption = reactive({
  page:1,
  size:10,
  total:0,
})
const workType = {
  0: "未定义",
  1: "增雨",
  2: "防雹",
  3: "大气污染治理",
  4: "其他",
}
const workCat = {
  0:'火箭',
  1:'高炮',
  2:'火箭+高炮',
  3:'烟炉',
  4:'火箭+烟炉',
  5:'高炮+烟炉',
  6:'火箭+高炮+烟炉'
}
const effect = {
  0:'好',
  1:'一般',
  2:'不好',
}
const weather = {
  0:'阴',
  1:'阴有零星小雨',
  2:'阴有零星小雨',
  3:'阵雨',
  4:'雷阵雨',
  5:'雷阵雨伴有大风',
  6:'冰雹',
  7:'小雨',
  8:'中雨',
  9:'大雨',
  10:'雾',
  11:'小雪',
  12:'中雪',
  13:'大雪',
  14:'雨夹雪',
  15:'大风',
  16:'雷电',
  17:'多云',
}
const zydID = ref(null)
watch(zydID,()=>{
  console.log('---------------->',zydID.value)
},{
  immediate:true,
})
const options = reactive<Array<{label:string,value:string,count:number}>>([])
let currentController: AbortController | null = null;
watch([()=>pageOption.page,()=>pageOption.size,zydID,range],()=>{
  if(currentController!=null){
    currentController.abort()
  }
  currentController = new AbortController()
  完成信息查询({page:pageOption.page,size:pageOption.size,range:range.value,zydID:zydID.value},currentController.signal).then(res=>{
    pageOption.total = res.data.total
    tableData.splice(0,tableData.length,...res.data.results)
  })
},{
  immediate:true,
})
watch(range,()=>{
  options.splice(0,options.length)
  完成信息查询中一段时间内作业点数据(range.value).then(res=>{
    res.data.results.forEach(item=>{
      options.push({label:item.strZydIDName,value:item.strZydID,count:item.count})
    })
  })
},{
  immediate:true,
})
const handleClick = () => {
  console.log('click')
}
const tableData = reactive<any>([])
</script>