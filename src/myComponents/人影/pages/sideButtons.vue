<template>
  <div class="sideButtons">
    <div class="sideButtonGroup" v-for="item in groups">
      <div class="sideButton" @click="item.expend=!item.expend">{{item.name}}<el-icon v-html="arrowDownSvg"></el-icon></div>
      <div v-if="item.children&&item.children.length>0" :class="`list-outer ${item.expend ? '' : 'hide'}`">
        <div class="list">
          <div v-for="(it,index) in item.children" :key="item.name" class="sideButton-outer">
            <div :class="`sideButton ${item.active&&item.active.includes(index) ? 'selected' : ''}`" @click="(it as any).click?(it as any).click(item,index):item.active = [index]">{{it.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref,reactive,computed } from 'vue'
import arrowDownSvg from '~/assets/arrowDown.svg?raw'
import { modelRef } from '~/tools'
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
const active = computed({
  get(){
    return [setting.人影.监控.tile]
  },
  set(val){
    setting.人影.监控.tile = val[0]
  }
})
const groups = reactive([
  {name:'地图',expend:false,active,children:[
    {name:'白板地图'},
    {name:'矢量地图'},
    {name:'影像地图'},
    {name:'地形地图'},
  ]},
  {name:'操作',expend:true,active:computed(()=>{
    if(setting.绘制模式 === 'draw_polygon'){
      return reactive([0])
    }else{
      return reactive([])
    }
  }),children:[
    {name:'批量操作',click(parent:any,index:number){
      if(parent.active.includes(index)){
        for(let i=0;i<parent.active.length;i++){
          if(parent.active[i--] === index){
            parent.active.splice(i,1)
          }
        }
        setting.绘制复原()
      }else{
        parent.active.push(index)
        setting.批量操作()
      }
    }},
    {name:'注册飞机',click(parent:any,index:number){
      setting.人影.监控.注册飞机列表显示 = true
    }},
  ]},
  {name:'标绘',active:computed(()=>{
    if(setting.绘制模式 === 'draw_point'){
      return reactive([0])
    }else if(setting.绘制模式 === 'draw_line_string'){
      return reactive([1])
    }else if(setting.绘制模式 === 'draw_polygon'){
      return reactive([2])
    }else{
      return reactive([])
    }
  }),children:[
    {name:'标点',click(parent:any,index:number){
      if(parent.active.includes(index)){
        for(let i=0;i<parent.active.length;i++){
          if(parent.active[i--] === index){
            parent.active.splice(i,1)
          }
        }
        setting.绘制复原()
      }else{
        parent.active.push(index)
        setting.标点()
      }
    }},
    {name:'标线',click(parent:any, index:number) {
      if(parent.active.includes(index)){
        for(let i=0;i<parent.active.length;i++){
          if(parent.active[i] === index){
            parent.active.splice(i--,1)
          }
        }
        setting.绘制复原()
      }else{
        parent.active.push(index)
        setting.标线()
      }
    }},
    {name:'标面',click(parent:any, index:number) {
      if(parent.active.includes(index)){
        for(let i=0;i<parent.active.length;i++){
          if(parent.active[i] === index){
            parent.active.splice(i--,1)
          }
        }
        setting.绘制复原()
      }else{
        parent.active.push(index)
        setting.标面()
      }
    }},
    {name:'清除',click(parent:any, index:any) {
      setting.清除()
    }},
  ]},
  {name:'工具',active:computed(()=>{
    const selected = reactive<number[]>([])
    if(setting.获取经纬度){
      selected.push(0)
    }
    if(setting.绘制模式 === 'custom_draw_line_with_distance'){
      selected.push(1)
    }
    return selected
  }),children:[
    {name:'获取经纬度',click(parent:any,index:number){
      if(parent.active.includes(index)){
        for(let i=0;i<parent.active.length;i++){
          if(parent.active[i] === index){
            parent.active.splice(i--,1)
          }
        }
        setting.绘制复原()
      }else{
        parent.active.push(index)
        setting.经纬度()
      }
    }},
    {name:'测距',click(parent:any, index:number) {
      if(parent.active.includes(index)){
        for(let i=0;i<parent.active.length;i++){
          if(parent.active[i] === index){
            parent.active.splice(i--,1)
          }
        }
        setting.绘制复原()
      }else{
        parent.active.push(index)
        setting.测距()
      }
    }},
    {name:'测面',click(parent:any, index:number) {
      // setting.测面()
    }},
    {name:'清除',click(parent:any, index:number) {
      setting.清除()
    }},
  ]},
])
</script>
<style lang="scss" scoped>
.sideButtons {
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: 100%;
  font-size:16px;
  user-select: none;
  .sideButtonGroup{
    margin-bottom:5px;
    display: flex;
    flex-direction: column;
    padding:4px 4px;
    justify-content: center;
    margin-right: 10px;
    border-radius: 4px;
    border:1px solid gray;
    background-color: #fff;
    .sideButton{
      cursor:pointer;
      width:100%;
      height:24px;
      padding:5px 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      color:darkblue;
      border-radius:4px;
      border: 2px solid transparent;
      // background-color: var(--el-color-primary);
      &:hover{
        border:2px solid var(--el-color-primary-dark-2);
      }
      &:active{
        background-color: var(--el-color-primary-light-3);
      }
      &.selected{
        background-color: var(--el-color-primary);
      }
    }
    .list-outer{
      interpolate-size: allow-keywords;
      transition: height 0.3s ease-in-out, opacity 0.3s linear;
      height: auto;
      opacity: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      &.hide{
        height: 0;
        opacity: 0;
        transition: height 0.3s ease-in-out, opacity 0.3s linear;
      }
      .list{
        padding-top:2px;
        .sideButton-outer{
          &:nth-child(1){
            border-top:1px solid gray;
            padding-top:2px;
          }
        }
        display: flex;
        flex-direction: column;
        gap:2px;
        .sideButton{
          color:#000;
        }
      }
    }
  }
}
.dark .sideButtonGroup{
  background-color: #273347;
  .sideButton{
    color:lightblue;
  }
  .list-outer .list{
    .sideButton{
      color:#ddd;
    }
  }
}
</style>