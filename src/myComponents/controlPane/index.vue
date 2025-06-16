<template>
  <div :class="`control-pane ${theme}`">
    <ul>
      <SubItem v-for="(item,key) in list" :key="key" :item="item"></SubItem>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import type { Item } from './def'
import SubItem from './SubItem.vue'
import { reactive } from 'vue';
const list = defineModel<Item[]>('list',{
  default:()=>reactive([])
})
const theme = defineModel<'default'|'jetblack'|'iceberg'|'retro'|'translucent'|'vivid'|'light'>('theme',{
  default:'default'
})
</script>
<style lang="scss">
.control-pane{
  &.default{
    --tp-base-background-color: var(--el-bg-color);
    --tp-base-shadow-color: var(--el-mask-color-extra-light);
    --tp-button-background-color: var(--el-color-primary);
    --tp-button-background-color-active: var(--el-color-primary-dark-2);
    --tp-button-background-color-focus: var(--el-color-primary-light-5);
    --tp-button-background-color-hover: var(--el-color-primary-light-3);
    --tp-button-foreground-color: var(--el-text-color-primary);
    --tp-container-background-color: var(--el-fill-color);
    --tp-container-background-color-active: var(--el-fill-color-dark);;
    --tp-container-background-color-focus: var(--el-fill-color-lighter);
    --tp-container-background-color-hover: var(--el-fill-color-light);
    --tp-container-foreground-color: var(--el-text-color-regular);
    --tp-groove-foreground-color:var(--el-text-color-regular);
    --tp-input-background-color: var(--el-fill-color);
    --tp-input-background-color-active: var(--el-fill-color-dark);
    --tp-input-background-color-focus: var(--el-fill-color-lighter);
    --tp-input-background-color-hover: var(--el-fill-color-light);
    --tp-input-foreground-color:var(--el-text-color-regular);
    --tp-label-foreground-color: var(--el-text-color-regular);
    --tp-monitor-background-color: var(--el-mask-color);
    --tp-monitor-foreground-color: var(--el-text-color-regular);
  }
  &.jetblack{
    --tp-base-background-color: hsla(0, 0%, 0%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 70%, 1);
    --tp-button-background-color-active: hsla(0, 0%, 85%, 1);
    --tp-button-background-color-focus: hsla(0, 0%, 80%, 1);
    --tp-button-background-color-hover: hsla(0, 0%, 75%, 1);
    --tp-button-foreground-color: hsla(0, 0%, 0%, 1);
    --tp-container-background-color: hsla(0, 0%, 10%, 1);
    --tp-container-background-color-active: hsla(0, 0%, 25%, 1);
    --tp-container-background-color-focus: hsla(0, 0%, 20%, 1);
    --tp-container-background-color-hover: hsla(0, 0%, 15%, 1);
    --tp-container-foreground-color: hsla(0, 0%, 50%, 1);
    --tp-groove-foreground-color: hsla(0, 0%, 10%, 1);
    --tp-input-background-color: hsla(0, 0%, 10%, 1);
    --tp-input-background-color-active: hsla(0, 0%, 25%, 1);
    --tp-input-background-color-focus: hsla(0, 0%, 20%, 1);
    --tp-input-background-color-hover: hsla(0, 0%, 15%, 1);
    --tp-input-foreground-color: hsla(0, 0%, 70%, 1);
    --tp-label-foreground-color: hsla(0, 0%, 50%, 1);
    --tp-monitor-background-color: hsla(0, 0%, 8%, 1);
    --tp-monitor-foreground-color: hsla(0, 0%, 48%, 1);
  }
  &.iceberg{
    --tp-base-background-color: hsla(230, 20%, 11%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(230, 10%, 80%, 1);
    --tp-button-background-color-active: hsla(230, 10%, 95%, 1);
    --tp-button-background-color-focus: hsla(230, 10%, 90%, 1);
    --tp-button-background-color-hover: hsla(230, 10%, 85%, 1);
    --tp-button-foreground-color: hsla(230, 20%, 11%, 1);
    --tp-container-background-color: hsla(230, 25%, 16%, 1);
    --tp-container-background-color-active: hsla(230, 25%, 31%, 1);
    --tp-container-background-color-focus: hsla(230, 25%, 26%, 1);
    --tp-container-background-color-hover: hsla(230, 25%, 21%, 1);
    --tp-container-foreground-color: hsla(230, 10%, 80%, 1);
    --tp-groove-foreground-color: hsla(230, 20%, 8%, 1);
    --tp-input-background-color: hsla(230, 20%, 8%, 1);
    --tp-input-background-color-active: hsla(230, 28%, 23%, 1);
    --tp-input-background-color-focus: hsla(230, 28%, 18%, 1);
    --tp-input-background-color-hover: hsla(230, 20%, 13%, 1);
    --tp-input-foreground-color: hsla(230, 10%, 80%, 1);
    --tp-label-foreground-color: hsla(230, 12%, 48%, 1);
    --tp-monitor-background-color: hsla(230, 20%, 8%, 1);
    --tp-monitor-foreground-color: hsla(230, 12%, 48%, 1);
  }
  &.retro{
    --tp-base-background-color: hsla(40, 3%, 90%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.3);
    --tp-button-background-color: hsla(40, 3%, 70%, 1);
    --tp-button-background-color-active: hsla(40, 3%, 55%, 1);
    --tp-button-background-color-focus: hsla(40, 3%, 60%, 1);
    --tp-button-background-color-hover: hsla(40, 3%, 65%, 1);
    --tp-button-foreground-color: hsla(40, 3%, 20%, 1);
    --tp-container-background-color: hsla(40, 3%, 70%, 1);
    --tp-container-background-color-active: hsla(40, 3%, 55%, 1);
    --tp-container-background-color-focus: hsla(40, 3%, 60%, 1);
    --tp-container-background-color-hover: hsla(40, 3%, 65%, 1);
    --tp-container-foreground-color: hsla(40, 3%, 20%, 1);
    --tp-groove-foreground-color: hsla(40, 3%, 40%, 1);
    --tp-input-background-color: hsla(120, 3%, 20%, 1);
    --tp-input-background-color-active: hsla(120, 3%, 35%, 1);
    --tp-input-background-color-focus: hsla(120, 3%, 30%, 1);
    --tp-input-background-color-hover: hsla(120, 3%, 25%, 1);
    --tp-input-foreground-color: hsla(120, 40%, 60%, 1);
    --tp-label-foreground-color: hsla(40, 3%, 50%, 1);
    --tp-monitor-background-color: hsla(120, 3%, 20%, 1);
    --tp-monitor-foreground-color: hsla(120, 40%, 60%, 0.8);
  }
  &.translucent{
    --tp-base-background-color: hsla(0, 0%, 10%, 0.8);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 80%, 1);
    --tp-button-background-color-active: hsla(0, 0%, 100%, 1);
    --tp-button-background-color-focus: hsla(0, 0%, 95%, 1);
    --tp-button-background-color-hover: hsla(0, 0%, 85%, 1);
    --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
    --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-container-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.2);
    --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-input-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-label-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);
  }
  &.vivid{
    --tp-base-background-color: hsla(0, 80%, 40%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 100%, 1);
    --tp-button-background-color-active: hsla(0, 0%, 85%, 1);
    --tp-button-background-color-focus: hsla(0, 0%, 90%, 1);
    --tp-button-background-color-hover: hsla(0, 0%, 95%, 1);
    --tp-button-foreground-color: hsla(230, 20%, 11%, 1);
    --tp-container-background-color: hsla(0, 0%, 0%, 0.2);
    --tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
    --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.3);
    --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
    --tp-container-foreground-color: hsla(0, 0%, 100%, 0.9);
    --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
    --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
    --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
    --tp-input-foreground-color: hsla(0, 0%, 100%, 0.9);
    --tp-label-foreground-color: hsla(0, 0%, 100%, 0.9);
    --tp-monitor-background-color: hsla(0, 0%, 0%, 0.5);
    --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.5);
  }
  position: absolute;
  background:var(--tp-base-background-color);
  box-shadow: 0 2px 4px var(--tp-base-shadow-color);
  overflow: hidden;
  border-radius: 6px;
  font-family: Roboto Mono, Source Code Pro, Menlo, Courier, monospace;
  --border-width:4px;
  --padding-left:4px;
  font-size: 18px;
  @media (max-width: 1200px) {
    font-size: 16px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
  @media (max-width: 480px) {
    font-size: 11px;
  }
  ul,li{
    list-style: none;
    margin:0;
    padding:0;
  }
  .control-item{
    &:has(.folder):has(>.item){
      border-left: var(--border-width) solid var(--tp-container-background-color);
    }
    &:has(.folder):has(>.item:hover){
      border-left: var(--border-width) solid var(--tp-container-background-color-hover);
    }
    &:has(.folder):has(>.item:active),&:has(.folder):has(>.item:active:hover){
      border-left: var(--border-width) solid var(--tp-container-background-color-active);
    }
    &:has(.folder):has(>.item:focus-within){
      border-left: var(--border-width) solid var(--tp-container-background-color-focus);
    }
    .control-item{
      margin-left: var(--padding-left);
    }
  }
  .control-item{
    display: flex;
    flex-direction: column;
    .item{
      flex:1;
      display: flex;
      flex-direction: row;
      position: relative;
      align-items: center;
      .label{
        flex:1;
        padding:4px 0 4px 6px;
        width: auto;
        color:var(--tp-label-foreground-color);
      }
      &:has(.folder) .label{
        color:var(--tp-container-foreground-color);
      }
      .value{
        width:150px;
      }
      .folder{
        display: flex;
        flex:1;
        background-color: var(--tp-container-background-color);
        padding-right: 6px;
        &:hover{
          background-color: var(--tp-container-background-color-hover);
        }
        &:active,&:active:hover{
          background-color: var(--tp-container-background-color-active);
        }
        &:focus-within{
          background-color: var(--tp-container-background-color-focus);
        }
      }
    }
  }
}

</style>