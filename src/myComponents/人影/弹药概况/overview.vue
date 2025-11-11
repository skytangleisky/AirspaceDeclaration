<template>
  <div class="overview" @mousedown.stop>
    <div>弹药概况</div>
    <el-radio-group v-model="radio">
      <el-radio :value="2">在库</el-radio>
      <el-radio :value="5">使用</el-radio>
      <el-radio :value="6">故障</el-radio>
      <el-radio :value="30">报废</el-radio>
    </el-radio-group>
    <div class="chart-group">
      <div ref="chartDomRef1" class="chartDom" v-resize="resize"></div>
      <div ref="chartDomRef2" class="chartDom" v-resize="resize"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { 弹药概况,弹药概况2 } from '~/api/天工'
import { onMounted,ref } from 'vue'
import {useSettingStore} from '~/stores/setting'
const setting = useSettingStore()
import * as echarts from 'echarts'
const radio = ref(2)
const option1:any = {
  backgroundColor: 'transparent',
  title: {
    text: '炮弹概况',
    // subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top:'center',
    selectedMode: true,
    formatter: function (name:string) {
      const dataItem = option1.series[0].data.find((d:any) => d.name === name);
      return `${name} ${dataItem ? dataItem.value : 0}`;
    }
  },
  series: [
    {
      name: '炮弹数量',
      center: ['60%', '50%'],
      type: 'pie',
      radius: '40%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
const option2:any = {
  backgroundColor: 'transparent',
  title: {
    text: '火箭弹概况',
    // subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'right',
    top:'center',
    selectedMode: true,
    formatter: function (name:string) {
      const dataItem = option2.series[0].data.find((d:any) => d.name === name);
      return `${name} ${dataItem ? dataItem.value : 0}`;
    }
  },
  series: [
    {
      name: '火箭弹数量',
      center: ['40%', '50%'],
      type: 'pie',
      radius: '40%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
watch(radio,()=>{
  弹药概况(radio.value).then((res:any)=>{
    const reuslt = res.data[0]
    option1.series[0].data.length = 0
    option2.series[0].data.length = 0
    reuslt.forEach((item:any,index:number)=>{
      item.pd_count = item.pd_count || 0
      item.hjd_count = item.hjd_count || 0
      item.district_name = item.district_name.replaceAll('北京','')
      option1.series[0].data.push({value:item.pd_count,name:item.district_name,adcode:item.district_code})
      option2.series[0].data.push({value:item.hjd_count,name:item.district_name,adcode:item.district_code})
    })
    // option.series[0].data[0].value = res.data[0][0].pd_count
    // option.series[0].data[1].value = res.data[0][1].pd_count
    // option.series[0].data[2].value = res.data[0][2].pd_count
    // option.series[0].data[3].value = res.data[0][3].pd_count
    myChart1.setOption(option1)
    myChart2.setOption(option2)
  })





  /*弹药概况2(radio.value).then((res:any)=>{
    const reuslt = res.data[0]
    option1.series[0].data.length = 0
    option2.series[0].data.length = 0
    reuslt.forEach((item:any,index:number)=>{
      item.pd_count = item.pd_count || 0
      item.hjd_count = item.hjd_count || 0
      item.district_name = item.district_name.replaceAll('北京','')
      option1.series[0].data.push({value:item.pd_count,name:item.district_name,adcode:item.district_code})
      option2.series[0].data.push({value:item.hjd_count,name:item.district_name,adcode:item.district_code})
    })
    // option.series[0].data[0].value = res.data[0][0].pd_count
    // option.series[0].data[1].value = res.data[0][1].pd_count
    // option.series[0].data[2].value = res.data[0][2].pd_count
    // option.series[0].data[3].value = res.data[0][3].pd_count
    myChart1.setOption(option1)
    myChart2.setOption(option2)
  })*/
},{immediate:true})
const chartDomRef1 = ref<HTMLDivElement>()
var myChart1: echarts.ECharts
const chartDomRef2 = ref<HTMLDivElement>()
var myChart2: echarts.ECharts
function resize(){
  myChart1&&myChart1.resize()
  myChart2&&myChart2.resize()
}
onMounted(()=>{
  myChart1 = echarts.init(chartDomRef1.value,'dark');
  myChart2 = echarts.init(chartDomRef2.value,'dark');
  myChart1.on('click', function (params) {
    console.log(params)
  });
})


</script>
<style lang="scss" scoped>
.overview{
  cursor:auto;
  position: relative;
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .chart-group{
    flex:1;
    display: flex;
    flex-direction: row;
    .chartDom{
      flex:1;
    }
  }
}
</style>