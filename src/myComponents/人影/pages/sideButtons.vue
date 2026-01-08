<template>
  <div class="sideButtons">
    <div class="sideButtonGroup" v-for="item in groups">
      <div class="sideButton" @click="item.expend=!item.expend">{{item.name}}<el-icon v-html="arrowDownSvg"></el-icon></div>
      <div v-if="item.children&&item.children.length>0" :class="`list-outer ${item.expend ? '' : 'hide'}`">
        <div class="list">
          <div v-for="(it,index) in item.children" :key="item.name" class="sideButton-outer">
            <div :class="`sideButton ${it.active ? 'selected' : ''}`" @click="it.click(item,index)">{{it.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive,computed } from 'vue'
import arrowDownSvg from '~/assets/arrowDown.svg?raw'
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
const groups = reactive([
  {name:'地图',expend:false,children:[
    {name:'白板地图',active:computed(()=>setting.人影.监控.tile === 0),click:(parent:any,index:number)=>setting.人影.监控.tile = 0},
    {name:'矢量地图',active:computed(()=>setting.人影.监控.tile === 1),click:(parent:any,index:number)=>setting.人影.监控.tile = 1},
    {name:'影像地图',active:computed(()=>setting.人影.监控.tile === 2),click:(parent:any,index:number)=>setting.人影.监控.tile = 2},
    {name:'地形地图',active:computed(()=>setting.人影.监控.tile === 3),click:(parent:any,index:number)=>setting.人影.监控.tile = 3},
  ]},
  {name:'操作',expend:true,children:[
    {name:'批量操作',active:computed(()=>setting.绘制模式 === 'draw_polygon'),click:(parent:any,index:number)=>parent.children[index].active ? setting.绘制复原() : setting.批量操作()},
    {name:'注册飞机',click:(parent:any,index:number)=>setting.人影.监控.注册飞机列表显示 = true},
  ]},
  {name:'标绘',children:[
    {name:'标点',active:computed(()=>setting.绘制模式 === 'draw_point'),click:(parent:any,index:number)=>parent.children[index].active ? setting.绘制复原() : setting.标点()},
    {name:'标线',active:computed(()=>setting.绘制模式 === 'draw_line_string'),click:(parent:any, index:number)=>parent.children[index].active ? setting.绘制复原() : setting.标线()},
    {name:'标面',active:computed(()=>setting.绘制模式 === 'draw_polygon'),click:(parent:any, index:number)=>parent.children[index].active ? setting.绘制复原() : setting.标面()},
    {name:'清除',click:(parent:any, index:any) => setting.清除()},
  ]},
  {name:'工具',children:[
    {name:'获取经纬度',active:computed(()=>setting.获取经纬度),click:(parent:any,index:number)=>setting.获取经纬度 = !parent.children[index].active},
    {name:'测距',active:computed(()=>setting.绘制模式==='custom_draw_line_with_distance'),click:(parent:any,index:number)=>parent.children[index].active ? setting.绘制复原() : setting.测距()},
    {name:'测面',click(parent:any, index:number) {
      // setting.测面()
    }},
    {name:'清除',click:(parent:any, index:number)=>setting.清除()},
  ]},
])
</script>
<style lang="scss" scoped>
    .sideButtons {
        display: flex;
        flex-direction: column;
        width: fit-content;
        height: 100%;
        font-size: .16rem;
        user-select: none;
        pointer-events: none;
        margin-right: $grid-2;
        gap: $grid-2;
        
        .sideButtonGroup {
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            
            border-radius: $border-radius-1;
            border: 1px solid var(--el-border-color);
            background-color: var(--el-bg-color-opacity-8);
            overflow: hidden;
            .sideButton {
                cursor: pointer;
                width: 100%;
                height: .32rem;
                line-height: .32rem;
                padding: $grid-1 $grid-2;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--el-color-primary);
                &:hover {
                    color: #fff;
                    background-color: var(--el-color-primary-light-3);
                }
                
                &.selected {
                    background-color: var(--el-color-primary);
                }
                
                
                
            }
            
            .list-outer {
                interpolate-size: allow-keywords;
                transition: height 0.3s ease-in-out, opacity 0.3s linear;
                height: auto;
                opacity: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                
                &.hide {
                    height: 0;
                    opacity: 0;
                    transition: height 0.3s ease-in-out, opacity 0.3s linear;
                }
                
                .list {
                    display: flex;
                    flex-direction: column;
                    
                    .sideButton {
                        color: var(--el-text-primary);
                        
                        &:hover {
                            color: #fff;
                            border-color: transparent;
                            background-color: var(--el-color-primary-light-3);
                        }
                        
                        &.selected {
                            color: #fff;
                        }
                        
                        
                        &:first-child {
                            border-top: 1px solid var(--el-border-color);
                        }
                        
                        // &:last-child {
                        //     border-radius: 0 0 $border-radius-1 $border-radius-1;
                        // }
                    }
                    
                }
            }
        }
    }
    
    .dark .sideButtonGroup {
        background-color: #273347;
        
        .sideButton {
            color: lightblue;
        }
        
        .list-outer .list {
            .sideButton {
                color: #ddd;
            }
        }
    }
</style>