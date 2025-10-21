<template>
  <div class="overview">
    弹药概况
    <div ref="chartDomRef" class="chartDom" v-resize="resize"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted,ref } from 'vue'
import {useSettingStore} from '~/stores/setting'
const setting = useSettingStore()
import * as echarts from 'echarts'

const chartDomRef = ref<HTMLDivElement>()
var myChart: echarts.ECharts
function resize(){
  myChart&&myChart.resize()
}
onMounted(()=>{
  myChart = echarts.init(chartDomRef.value);
  var option;

  option = {
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  option && myChart.setOption(option);
})


</script>
<style lang="scss" scoped>
.chartDom{
  width: 100%;
  height: 400px;
}
</style>