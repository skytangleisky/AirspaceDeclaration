<template>
  <div class="left-container">
    <div class="left-button" v-for="item in option" :style="{zIndex: item.zIndex}">
      <div class="outer">
        <div :class="`inner ${item.active ? 'active' : ''}`" @click="handleClick(item)">

          <div v-if="!item.click && item.active" class="menu" @click.stop>
            <alarm v-if="item.content==='告警控制'"></alarm>
            <ryParams v-if="item.content==='人影参数'"></ryParams>
            <alarm v-if="item.content==='辅助管理'"></alarm>
            <alarm v-if="item.content==='历史查询统计'"></alarm>
            <alarm v-if="item.content==='查询统计'"></alarm>
          </div>
          <el-tooltip
            class="box-item"
            :content="item.content"
            placement="right"
            :show-after="500"
          >
            <el-icon class="icon" v-html="item.icon" style="font-size: 24px;"></el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import wechatRaw from './wechat.svg?raw'
import alarmRaw from './alarm.svg?raw'
import regulationRaw from './regulation.svg?raw'
import assistantRaw from './assistant.svg?raw'
import historyRaw from './history.svg?raw'
import statisticsRaw from './statistics.svg?raw'
import routeRaw from './route.svg?raw'
import configureRaw from './configure.svg?raw'
import Alarm from './告警控制/index.vue'
import ryParams from "./ryParams/ryParams.vue"
import { modelRef } from '~/tools'
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
interface Item {
  active?:any;
  zIndex?:number;
  content:string;
  icon?:string;
  click?:Function;
}
const option = reactive<Item[]>([
  {
    icon: wechatRaw,
    content: '信息交互',
    active:true,
    click:(active:boolean)=>{
      console.log('信息交互',active)
    }
  },
  {
    icon: alarmRaw,
    content: '告警控制',
  },
  {
    icon: regulationRaw,
    content: '人影参数',
  },
  {
    icon: assistantRaw,
    content: '辅助管理',
  },
  {
    icon: historyRaw,
    content: '历史查询统计',
  },
  {
    icon: statisticsRaw,
    content: '查询统计',
  },
  {
    icon: routeRaw,
    content: '航迹回放',
    click(){
      console.log('航迹回放')
    }
  },
  {
    icon: configureRaw,
    active:modelRef(setting,'showBusinessLayer'),
    content: '显示设置',
    click(item:Item){
      setting.showBusinessLayer = item.active
    }
  }
])
function handleClick(item:any){
  for(let i=0;i<option.length;i++){
    let it = option[i]
    if(it === item){
      it.active = !it.active
      it.zIndex = 1
    }else{
      it.zIndex = 0
      if(it.content!='显示设置') {
        it.active = false
      }
    }
  }
  if(item.click){
    item.click(item)
  }
}
</script>
<style lang="scss" scoped>
.left-container{
  position: absolute;
  left:6px;
  top:45px;
  display: flex;
  flex-direction: column;
  .left-button{
    .outer{
      padding:4px;
      .inner{
        
        position: relative;
        padding:4px;
        display: flex;
        border-radius: $border-radius-1;
        border:1px solid var(--el-border-color);
        box-sizing: border-box;
        background-color: var(--el-bg-color-opacity-8);
        &:hover{
          border:1px solid var(--el-color-primary);
        }
        &.active{
          border:1px solid var(--el-color-primary);
        }
        .menu{
          position: absolute;
          left:calc(100% + $grid-2);
          top:0;
          min-width: 100px;
          min-height: 100px;
          background-color: var(--el-bg-color-opacity-8);
          box-sizing: border-box;
          border:1px solid var(--el-border-color);
            border-radius: $border-radius-1;
        }
      }
    }
  }
}
</style>