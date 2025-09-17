<template>
  <el-table :data="setting.人影.监控.需要重点关注的飞机" style="width: 100%;max-height: 500px;"  @row-click="handleRowClick" :row-class-name="tableRowClassName">
    <el-table-column prop="strProtocol" label="数据类型" />
    <el-table-column prop="strCallCode" label="飞机标识" style="white-space: nowrap;"/>
    <el-table-column prop="iAddress" label="二次码" :formatter="(a,b,val)=>Number(val).toString(8).padStart(4,'0')"/>
    <el-table-column prop="height" label="高度" />
    <el-table-column prop="update_time" label="最后更新时间" width="180"/>
    <el-table-column prop="speed" label="速度" width="140" :formatter="(a,b,val)=>(val*3.6).toFixed(2)+'km/h'"/>
    <el-table-column prop="orientation" label="航向" :formatter="(a,b,val)=>val.toFixed(2)+'&deg;'"/>
  </el-table>
  <List></List>
  <Add v-model:show="addShow"></Add>
  <Edit v-model:show="confirmShow"></Edit>
</template>
<script lang="ts" setup>
import List from './人影飞机/list.vue'
import Add from './人影飞机/add.vue'
import Edit from './人影飞机/edit.vue'
import {注册飞机查询,完成信息查询中一段时间内作业点数据,通过workID删除完成信息和完成信息确认,通过workID恢复完成信息} from '~/api/天工.ts'
import { watch,reactive,ref,provide,onMounted,onBeforeUnmount,computed,toRaw } from 'vue'
import {useSettingStore} from '~/stores/setting'
import { toDMS } from '~/tools'
const tableRowClassName = ({ row }) => {
  return 'row-selected'
  // return row.selected = true ? 'row-selected' : '';
};
import moment from 'moment'
const setting = useSettingStore()
const addShow = ref(false)
const confirmShow = ref(false)
const viewShow = ref(false)
const viewID = ref("")
const now = new Date()
const defaultDates = [
  new Date(now.getFullYear(), now.getMonth() - 1, 1), // 上个月
  new Date(now.getFullYear(), now.getMonth(), 1)      // 当前月
]
const globalOptions:any[] = []
const options = reactive<Array<{label:string,value:string,count:number}>>([])
let currentController: AbortController | null = null;
const 触发注册飞机查询 = ref(Date.now())
import {eventbus} from '~/eventbus'
import { wgs84togcj02 } from "~/myComponents/map/workers/mapUtil";
provide('触发注册飞机查询',触发注册飞机查询)
watch(触发注册飞机查询,()=>{
  if(currentController!=null){
    currentController.abort()
  }
  currentController = new AbortController()
  注册飞机查询({page:0,size:0},currentController.signal).then((res)=>{
    setting.人影.监控.注册飞机数据.splice(0,setting.人影.监控.注册飞机数据.length,...res.data.results)
  }).catch(e=>{
  })
},{
  immediate:true
})
setting.人影.监控.需要重点关注的飞机 = computed(()=>{
  const results = new Array()
  setting.人影.监控.飞机数据.forEach(({properties})=>{
    setting.人影.监控.注册飞机数据.forEach(row=>{
      if(properties.unSsrCode == row.iAddress){
        results.push({
          dtRegTime:row.dtRegTime,
          strProtocol:row.strProtocol,
          strCallCode:row.strCallCode,
          iAddress:row.iAddress,
          height:properties.iAltitudeADS,
          update_time:properties.time,
          speed:properties.fSpeed,
          orientation:properties.fHeading,
          position:wgs84togcj02(properties.fLongitude,properties.fLatitude),
        })
      }
    })
  })
  return results
})
function handleRowClick(row,col,event){
  eventbus.emit('人影-将站点移动到屏幕中心',toRaw(row).position)
}
let timer:any = 0
onMounted(()=>{
  timer = setInterval(()=>{
    触发注册飞机查询.value = Date.now()
  },1000)
})
onBeforeUnmount(()=>{
  clearInterval(timer)
})
</script>
<style scoped lang="scss">
.el-table.is-scrolling-left::v-deep(th.el-table-fixed-column--left) {
  background-color: var(--el-color-primary);
}
.el-pagination{
  margin-top:$grid-2;
}
</style>