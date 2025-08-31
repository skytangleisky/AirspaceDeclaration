<template>
  <div class="colormap" v-if="(setting.人影.监控.睿图雷达||setting.人影.监控.CMPAS降水融合3km||setting.人影.监控.组合反射率)&&setting.人影.监控.色标.length">
    <div class="item" v-for="item in setting.人影.监控.色标" :style="{background:item.color}">
      <div class="label">
        {{item.value}}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
</script>
<style scoped lang="scss">
.colormap{
  width: fit-content;
  height: 20px;
  display: flex;
  background-color: var(--el-bg-color-opacity-8);
  border:1px solid var(--el-border-color);
  padding:0.08rem 0.12rem;
  border-radius:4px;
  color:black;
  .item{
    border:1px solid grey;
    border-right:none;
    box-sizing: border-box;
    position: relative;
    width:20px;
    height: 10px;
    .label{
      position: absolute;
      top: 12px;
      left: 0;
      width: 100%;
      height: 100%;
      font-size:10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .item:first-child{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .item:last-child{
    border-right:1px solid grey;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
.dark .colormap{
  color: #fff;
}
</style>